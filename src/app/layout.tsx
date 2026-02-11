import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "LoveU - School Activities Tracker",
  description: "Track school activities, exams, projects, and events",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="min-h-screen antialiased flex flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
