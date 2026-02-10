import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoveU - School Activities Tracker",
  description: "Track school activities, exams, projects, and events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
