// FILE: index.tsx
// App entrypoint for super-premium SWAPI app

import React, { useState } from "react";
import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

export default function Home() {
  const [theme] = useState<"light" | "dark">("dark");
  return <App theme={theme} />;
}