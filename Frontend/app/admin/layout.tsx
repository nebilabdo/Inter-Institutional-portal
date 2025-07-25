import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { NotificationsProvider } from "@/components/NotificationsContext";

export const metadata = {
  title: "Data Exchange Portal",
  description: "A modern data sharing dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NotificationsProvider>
      <Header />
      {children}
    </NotificationsProvider>
  );
}
