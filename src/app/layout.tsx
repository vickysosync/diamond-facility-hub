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
    "Security guard deployment, pest control, water tank cleaning, and painting services in Pune for commercial, residential, industrial, and institutional facilities.",
  keywords: [
    "facility management pune",
    "security services pune",
    "pest control pune",
    "water tank cleaning pune",
    "commercial painting pune",
    "integrated facility services",
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
      "One trusted partner for security, pest control, tank cleaning and painting across Pune and Pimpri-Chinchwad.",
    type: "website",
    locale: "en_IN",
    siteName: "Diamond Integrated Facility Services",
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
