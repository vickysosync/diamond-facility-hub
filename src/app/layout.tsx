import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/store/AppStore";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Diamond Integrated Facility Services LLP | Facility Management Pune",
    template: "%s | Diamond Integrated Facility Services LLP",
  },
  description:
    "Integrated facility management partner in Pune headed by Director Umesh Patil. Screened Security Guards, Housekeeping, Property Management, Pest Control, Manpower Supply, Tank Cleaning & Gardening, CCTV, and Civil Maintenance.",
  keywords: [
    "facility management pune",
    "security guard services pune",
    "housekeeping services pune",
    "property management pune",
    "pest control pune",
    "bouncer services pune",
    "man power supply pune",
    "tank cleaning pune",
    "cctv installation pune",
    "painting and waterproofing pune",
    "diamond integrated facility services llp",
    "umesh patil diamond facility",
  ],
  authors: [{ name: "Diamond Integrated Facility Services LLP" }],
  icons: {
    icon: "/images/logo-icon.png",
    shortcut: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
  openGraph: {
    title: "Diamond Integrated Facility Services LLP | Pune",
    description:
      "One trusted partner for 11 core facility management services across Pune, PCMC and Maharashtra.",
    type: "website",
    locale: "en_IN",
    siteName: "Diamond Integrated Facility Services LLP",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d2333",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
