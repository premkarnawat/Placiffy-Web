import os

layout_content = """\
import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/lib/auth-context";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"], weight: ["400"], style: ["normal","italic"], variable: "--font-serif",
});
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"], weight: ["300","400","500","600","700","800"], variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Placify | Verified Talent. Faster Hiring. Reduced Risk.",
  description: "AI-powered verified hiring operating system for modern enterprises.",
  keywords: "hiring, recruitment, ATS, talent, verified candidates, AI hiring",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} ${instrumentSerif.variable} font-sans`}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
"""

with open(r"app\layout.tsx", "w", encoding="utf-8") as f:
    f.write(layout_content)
