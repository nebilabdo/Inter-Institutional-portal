import dynamic from "next/dynamic";

// Dynamically import the client-only component
const SuccessPageClient = dynamic(
  () => import("./SuccessPageClient"),
  { ssr: false } // Disable server-side rendering
);

export default function SuccessPage() {
  return <SuccessPageClient />;
}
