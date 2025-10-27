import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the entire content with no SSR
const InstitutionsContent = dynamic(() => import("./InstitutionsContent"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      Loading institutions...
    </div>
  ),
});

export default function InstitutionsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        Loading institutions...
      </div>
    }>
      <InstitutionsContent />
    </Suspense>
  );
}
