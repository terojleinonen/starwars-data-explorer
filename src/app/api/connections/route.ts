import {getRecord} from "@/lib/archive/database";
import {connectionSnapshot} from "@/lib/archive/connection-snapshot";
import {categoryKeys,type Category} from "@/lib/archive/types";
export function GET(request:Request){
 const params=new URL(request.url).searchParams,category=params.get("category"),slug=params.get("slug");
 if(!categoryKeys.includes(category as Category)||!slug||slug.length>200)return Response.json({error:"Invalid record"},{status:400});
 const record=getRecord(category as Category,slug);
 if(!record)return Response.json({error:"Record not found"},{status:404});
 return Response.json(connectionSnapshot(record));
}
