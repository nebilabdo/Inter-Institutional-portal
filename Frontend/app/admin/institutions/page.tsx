"use client";

import dynamic from "next/dynamic";

const InstitutionsContent = dynamic(() => import("./InstitutionsContent"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      Loading institutions...
    </div>
  ),
});

export default function InstitutionsPage() {
  return <InstitutionsContent />;
}
