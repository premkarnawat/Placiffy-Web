import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"] 
});

export const metadata: Metadata = {
  title: "Placify | Verified Talent. Faster Hiring. Reduced Risk.",
  description: "Verified Hiring Operating System for Modern Enterprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
