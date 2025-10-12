"use client"; // Make the page a client component

import dynamic from "next/dynamic";

const SuccessPageClient = dynamic(() => import("./SuccessPageClient"), {
  ssr: false,
});

export default function SuccessPage() {
  return <SuccessPageClient />;
}
