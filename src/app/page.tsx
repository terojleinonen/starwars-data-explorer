import { getRecords, getStats, getRecord, getRelated } from "@/lib/archive/database";
import GalacticPortal from "@/components/galactic-portal";
import "./portal.css";

export default function HomePage() {
 const vader = getRecord("people", "darth-vader");
 return <GalacticPortal records={getRecords()} stats={getStats()} connections={vader ? getRelated(vader.id) : []}/>;
}
