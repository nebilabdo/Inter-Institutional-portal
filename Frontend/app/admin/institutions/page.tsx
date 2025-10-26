"use client"

import { Suspense } from "react"
import InstitutionsContent from "./InstitutionsContentInner"

export default function InstitutionsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>}>
      <InstitutionsContent />
    </Suspense>
  )
}
