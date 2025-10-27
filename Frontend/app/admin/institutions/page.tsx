// app/admin/institutions/page.tsx
import { Suspense } from "react";
import InstitutionsContent from "./InstitutionsContent";

export const dynamic = 'force-dynamic';

export default function InstitutionsPage() {
  return (
    <Suspense fallback={<div>Loading institutions...</div>}>
      <InstitutionsContent />
    </Suspense>
  );
}
