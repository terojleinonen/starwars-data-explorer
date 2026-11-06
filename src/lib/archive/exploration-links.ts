import {recordHref,type ArchiveRecord} from "@/lib/archive/types";
export function comparisonRecordHref(record:Pick<ArchiveRecord,"category"|"slug">,left:Pick<ArchiveRecord,"category"|"slug">,right:Pick<ArchiveRecord,"category"|"slug">,path=false,checked=false){
 const query=new URLSearchParams({left:`${left.category}/${left.slug}`,right:`${right.category}/${right.slug}`});if(path)query.set("mode","path");if(checked)query.set("scope","checked");
 return `${recordHref(record)}?exploreFrom=${encodeURIComponent(`/compare?${query}`)}#record-connections`;
}
