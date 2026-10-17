import type { Metadata } from "next";

import "./globals.css";
import { leageSpartan } from "@/lib/fonts";
import { Toaster } from "sonner";



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
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast: "!font-sans !rounded-xl !shadow-xl !border !border-primary5/30 !bg-white !text-slate-800 !backdrop-blur-md",
                            title: "!font-semibold !text-slate-900",
                            description: "!text-slate-500",
                            actionButton: "!bg-primary9 !text-white hover:!bg-primary5",
                            cancelButton: "!bg-slate-100 !text-slate-600",
                            closeButton: "!bg-white !border-slate-200 !text-slate-500 hover:!bg-slate-100",
                            success: "!border-emerald-200",
                            error: "!border-red-200",
                            warning: "!border-amber-200",
                            info: "!border-primary5/40",
                        },
                    }}
                />
      </body>
      
    </html>
  );
}
