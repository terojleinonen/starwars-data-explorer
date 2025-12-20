// FILE: app/[category]/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import DetailsPage from "@/components/DetailsPage";

export default function Details() {
  const params = useParams<{ category: string; id: string }>();

  if (!params?.category || !params?.id) {
    return <p className="opacity-60">Invalid route</p>;
  }

  return (
    <DetailsPage
      theme="dark"
      type={params.category}
      id={params.id}
    />
  );
}
// FILE: DetailsPage.tsx