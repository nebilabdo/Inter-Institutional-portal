"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Requests", href: "/requests" },
  { name: "Institutions", href: "/institutions" },
  { name: "Analytics", href: "/analytics" },
  { name: "Notifications", href: "/notifications" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-6 px-6 py-4 bg-white border-b items-center">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`font-medium transition-colors duration-150 ${
            pathname === item.href
              ? "text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
