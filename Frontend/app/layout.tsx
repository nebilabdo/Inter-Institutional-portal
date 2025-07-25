import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
