import type { Metadata } from "next";
import localFont from "next/font/local";
import SplashScreen from "@/components/SplashScreen";
import "./globals.css";

// ... [Existing Font variables code untouched ideally, but I'll write the exactly identical block to replace perfectly]
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "المحطة المركزية - Dashboard",
  description: "BaaS Headless CMS Dashboard built for clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-coastal-darkest`}
      >
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
