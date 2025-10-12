"use client";

import dynamic from "next/dynamic";

// Dynamically import the client component
const SuccessPageClient = dynamic(() => import("./SuccessPageClient"), {
  ssr: false, // disable server-side rendering
});

export default function SuccessPage() {
  return <SuccessPageClient />;
}

