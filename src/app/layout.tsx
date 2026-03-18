import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { Toaster } from "@/components/ui/sonner";
import { FloatingBanner } from "@/components/FloatingBanner";

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
      </body>
    </html>
  );
}
