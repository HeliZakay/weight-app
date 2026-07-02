import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import RegisterSW from "@/components/RegisterSW";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weight & Movement Companion",
  description:
    "A calm daily companion for weight trends, movement, and meals — with one honest check-in a day.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Companion",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EEE4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${hanken.variable} h-full`}
    >
      <body className="bg-canvas flex min-h-full items-center justify-center sm:p-6">
        {/* Phone frame: full viewport on mobile, centered 402px shell on desktop */}
        <div className="bg-paper relative flex h-[100dvh] w-full max-w-[402px] flex-col overflow-hidden sm:h-[874px] sm:rounded-[44px] sm:shadow-[var(--shadow-phone)]">
          <main className="no-scrollbar flex-1 overflow-x-hidden overflow-y-auto pt-[env(safe-area-inset-top)]">
            {children}
          </main>
          <BottomNav />
        </div>
        <RegisterSW />
      </body>
    </html>
  );
}
