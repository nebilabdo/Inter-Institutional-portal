// app/admin/institutions/page.tsx
import { Suspense } from "react";
import InstitutionsContent from "./InstitutionsContent";

export default function InstitutionsPage() {
  return (
    <Suspense fallback={<div>Loading institutions...</div>}>
      <InstitutionsContent />
    </Suspense>
  );
}
