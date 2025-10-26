import { Suspense } from "react"
import InstitutionsContent from "./institutions-content"

export default function InstitutionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading Institutions...</div>
        </div>
      }
    >
      <InstitutionsContent />
    </Suspense>
  )
}
