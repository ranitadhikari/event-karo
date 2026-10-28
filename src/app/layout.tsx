
import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { Toaster } from "@/components/ui/sonner";
import { FloatingBanner } from "@/components/FloatingBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventKaro - Centralized College Events Platform",
  description: "Discover and manage events across colleges across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LocationProvider>
            {children}
            <FloatingBanner />
            <Toaster />
          </LocationProvider>
        </AuthProvider>

        {/* Chatling AI Chatbot */}
        <Script id="chatling-config" strategy="afterInteractive">
          {`window.chtlConfig = { chatbotId: "1223231346" };`}
        </Script>

        <Script
          id="chatling-embed"
          src="https://chatling.ai/js/embed.js"
          data-id="1223231346"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
