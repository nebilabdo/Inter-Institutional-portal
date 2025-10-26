"use client";
import DashboardPage from "./dashboard/page";

export default function Page() {
  return <Suspense fallback={<div>Loading Dashboard...</div>}><DashboardPage/></Suspense>;
}
