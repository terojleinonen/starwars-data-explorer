import AtlasPage from "@/components/atlas-page";
export const metadata={title:"Rebel War Map — The Galactic Memory"};
export default async function Page({searchParams}:{searchParams:Promise<{world?:string}>}){const {world}=await searchParams;return <AtlasPage mode="war" world={world}/>;}
