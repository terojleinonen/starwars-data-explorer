import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

// Scope decisions are reproducible overlays, never edits to historical review inputs.
export function applyReviewPlan(db,root){
  const plan=JSON.parse(readFileSync(join(root,'data/reviews/review-plan-01.json'),'utf8'));
  assert.equal(plan.version,1);
  db.prepare('INSERT INTO review_batches VALUES(?,?,?,?)').run(plan.id,plan.checkedAt,plan.reviewer,plan.scope);
  const changes=[];
  for(const update of plan.issueUpdates){
    assert.ok(['pending','deferred'].includes(update.status),'Planning cannot resolve a factual question');
    const rows=db.prepare('SELECT * FROM review_issues WHERE record_id=? AND field=?').all(update.recordId,update.field);
    assert.equal(rows.length,1,'Planning update must identify one historical issue');
    const before={...rows[0]};
    assert.equal(before.status,update.expectedStatus);
    db.prepare('UPDATE review_issues SET field=?,status=?,note=? WHERE id=?').run(update.newField,update.status,update.note,before.id);
    changes.push({kind:'issue_update',recordId:update.recordId,before,after:{field:update.newField,status:update.status,note:update.note}});
  }
  for(const issue of plan.issueAdditions){
    assert.ok(['pending','deferred'].includes(issue.status));
    assert.ok(db.prepare('SELECT 1 FROM record_reviews WHERE record_id=?').get(issue.recordId));
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM review_issues WHERE record_id=? AND field=?').get(issue.recordId,issue.field).n,0);
    db.prepare('INSERT INTO review_issues(record_id,batch_id,field,status,note) VALUES(?,?,?,?,?)').run(issue.recordId,plan.id,issue.field,issue.status,issue.note);
    changes.push({kind:'issue_addition',...issue});
  }
  for(const update of plan.limitationUpdates){
    const row=db.prepare('SELECT limitations FROM record_reviews WHERE record_id=?').get(update.recordId);
    assert.deepEqual(JSON.parse(row.limitations),update.expected,'Apply the scope plan after the reviewed data overlays');
    db.prepare('UPDATE record_reviews SET limitations=? WHERE record_id=?').run(JSON.stringify(update.limitations),update.recordId);
    changes.push({kind:'limitations',recordId:update.recordId,before:update.expected,after:update.limitations});
  }
  writeFileSync(join(root,'data/reviews/review-plan-01-change-log.json'),JSON.stringify({plan:plan.id,checkedAt:plan.checkedAt,changes},null,2)+'\n');
  return {id:plan.id,issueUpdates:plan.issueUpdates.length,issueAdditions:plan.issueAdditions.length,deferred:db.prepare("SELECT COUNT(*) AS n FROM review_issues WHERE status='deferred'").get().n};
}
