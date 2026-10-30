import Link from "next/link";
import ArchiveNavigation from "@/components/archive/navigation";
import { OrbitMark, Arrow } from "@/components/icons";
import "./archive.css";
import "./archive-reading.css";

export default function ArchiveLayout({children}:{children:React.ReactNode}) {
  return <div className="archive-shell archive-reading">
    <header className="archive-header"><Link href="/" prefetch={false} className="wordmark" aria-label="Star Wars Universe home"><OrbitMark/><span><span className="wordmark-top">STAR WARS</span><span className="wordmark-bottom">UNIVERSE</span></span></Link><span className="archive-header-label">THE INDEPENDENT COLLECTION <span>/</span> VOLUME 01</span><Link href="/" prefetch={false} className="archive-home-link">Home <Arrow diagonal/></Link></header>
    <div className="archive-layout"><aside className="archive-sidebar"><ArchiveNavigation/></aside><main id="main" className="archive-main">{children}</main></div>
    <footer className="archive-footer"><span>STAR WARS UNIVERSE / AN INDEPENDENT FAN ARCHIVE</span><Link href="/sources" prefetch={false}>Sources, attribution & collection notes <Arrow diagonal/></Link></footer>
  </div>;
}
