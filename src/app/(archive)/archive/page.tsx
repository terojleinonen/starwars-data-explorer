import { permanentRedirect } from "next/navigation";

// Keep existing bookmarks working now that the overview belongs to the home page.
export default function ArchivePage() {
  permanentRedirect("/#archive");
}
