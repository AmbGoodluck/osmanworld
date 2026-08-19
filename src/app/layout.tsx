
import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";
import GeminiChatbot from "./components/GeminiChatbot";
import ThreeWorld from "./components/ThreeWorld";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";
import LaserLight from "./components/LaserLight";
import BackgroundAudio from "./components/BackgroundAudio";
import { safeFetch, getSiteSettings } from "./lib/sanity";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/700.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Osman's World Portfolio",
  description: "A premium Next.js portfolio with 3D world navigation.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await safeFetch(getSiteSettings);

  return (
    <html lang="en">
      <body
        className="font-inter antialiased bg-[#101624] text-white min-h-screen"
        style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      >
        <SmoothScrollProvider>
          <BackgroundAudio />
          <LaserLight />
          <ThreeWorld />
          <Navigation siteSettings={siteSettings} />
          <div className="relative z-10 pt-16">
            <PageTransition>{children}</PageTransition>
            <Footer siteSettings={siteSettings} />
          </div>
          <GeminiChatbot />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
