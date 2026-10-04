import type { Metadata } from "next";

import "./globals.css";
import { leageSpartan } from "@/lib/fonts";


export const metadata: Metadata = {
  title: "Nexio",
  description: "Connect instantly with friends and family using our secure, fast, and feature-rich chat app. Enjoy real-time messaging, crystal-clear calls, and file sharing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leageSpartan.className} $ h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
