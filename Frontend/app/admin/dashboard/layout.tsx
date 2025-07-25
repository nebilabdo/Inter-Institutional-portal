import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // If no token, redirect immediately on the server
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar component can go here */}
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}
