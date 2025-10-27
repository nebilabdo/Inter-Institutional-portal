"use client";

import { Suspense } from 'react';
import InstitutionsContent from './InstitutionsContent';

export default function InstitutionsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading Institutions...</div>
      </div>
    }>
      <InstitutionsContent />
    </Suspense>
  );
}
