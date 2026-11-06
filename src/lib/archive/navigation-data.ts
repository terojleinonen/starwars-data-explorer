import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";

/** Navigation needs names and destinations, not every fact and citation. */
export function getNavigationRecords(){
 const db=new DatabaseSync(join(process.cwd(),"data","archive.sqlite"),{readOnly:true});
 try{return (db.prepare("SELECT id,title,category,slug FROM records ORDER BY title").all() as {id:string;title:string;category:string;slug:string}[]).map(r=>({id:r.id,title:r.title,category:r.category,href:`/${r.category}/${r.slug}`}));}
 finally{db.close();}
}
