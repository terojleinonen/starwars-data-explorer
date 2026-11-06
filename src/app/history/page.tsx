import AtlasPage from "@/components/atlas-page";
export const metadata={title:"History — The Galactic Memory"};
export default async function Page({searchParams}:{searchParams:Promise<{world?:string;record?:string;returnTo?:string}>}){const {world,record,returnTo}=await searchParams;return <AtlasPage mode="history" world={world} record={record} returnTo={returnTo}/>;}
