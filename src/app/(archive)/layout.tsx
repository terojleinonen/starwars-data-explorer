import Link from "next/link";
import HomeLink from "@/components/home-link";
import ArchiveNavigation from "@/components/archive/navigation";
import MobileArchiveNavigation from "@/components/archive/mobile-navigation";
import { OrbitMark, Arrow } from "@/components/icons";
import "./archive.css";
import "./archive-reading.css";
import "./memory-archive.css";

export default function ArchiveLayout({children}:{children:React.ReactNode}) {
  return <div className="archive-shell archive-reading">
    <header className="archive-header"><HomeLink className="wordmark" aria-label="The Galactic Memory home"><OrbitMark/><span><span className="wordmark-top">THE GALACTIC</span><span className="wordmark-bottom">MEMORY</span></span></HomeLink><span className="archive-header-label">THE GALACTIC MEMORY <span>/</span> ORIGIN UNKNOWN</span><div className="archive-header-actions"><HomeLink className="archive-home-link">Home <Arrow diagonal/></HomeLink><MobileArchiveNavigation/></div></header>
    <div className="archive-layout"><aside className="archive-sidebar"><ArchiveNavigation/></aside><main id="main" className="archive-main">{children}</main></div>
    <footer className="archive-footer"><span>THE GALACTIC MEMORY / AN INDEPENDENT STAR WARS ARCHIVE</span><Link href="/sources" prefetch={false}>Sources, attribution & collection notes <Arrow diagonal/></Link></footer>
  </div>;
}
