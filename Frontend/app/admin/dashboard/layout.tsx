import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Check role for admin
    if (payload.role !== "admin") {
      redirect("/login");
    }
  } catch (err) {
    redirect("/login");
  }

  return <>{children}</>;
}
