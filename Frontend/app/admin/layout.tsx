import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { NotificationsProvider } from "@/components/NotificationsContext";

export const metadata: Metadata = {
  title: "Data Exchange Portal",
  description: "A modern data sharing dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationsProvider>
          <Header />
          {children}
        </NotificationsProvider>
      </body>
    </html>
  );
}
