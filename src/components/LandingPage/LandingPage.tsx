"use client";

import { useState } from "react";
import TerminalIntro from "@/components/landing/TerminalIntro";
import RealLandingContent from "@/components/landing/RealLandingContent";
import PageWrapper from "../layout/PageWrapper";

export default function LandingPage() {  
  const [ready, setReady] = useState(false);
  
  return (
      <PageWrapper>
        {!ready && <TerminalIntro onDone={() => setReady(true)} />}
          {ready && <RealLandingContent />}
      </PageWrapper>
  );
}