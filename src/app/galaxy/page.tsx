import AtlasPage from "@/components/atlas-page";
export const metadata={title:"Galactic Atlas — The Galactic Memory"};
export default async function Page({searchParams}:{searchParams:Promise<{world?:string}>}){const {world}=await searchParams;return <AtlasPage mode="galaxy" world={world}/>;}
