import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Clario — Understand Your Medical Bill",
    template: "%s | Clario",
  },
  icons: {
    icon: "/logo.svg",
  },
  description:
    "Clario helps patients understand hospital bills in plain English, spot potential overcharges, and generate dispute letters — powered by AI.",
  keywords: [
    "medical bill help",
    "hospital bill review",
    "medical billing dispute",
    "understand medical bill",
    "healthcare billing AI",
    "bill negotiation",
  ],
  openGraph: {
    title: "Clario — Your Medical Bill, Decoded",
    description:
      "Upload your hospital bill and get a plain-English breakdown in minutes. Spot overcharges, find savings, and generate dispute letters.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
