import type { Metadata } from "next";
import localFont from "next/font/local";
import { PagePaperTexture } from "@/components/ui/PagePaperTexture";
import "./globals.css";

const exposure = localFont({
  src: [
    {
      path: "../../public/205TF_Exposure_Trial/ExposureTrialVAR.ttf",
      style: "normal",
    },
    {
      path: "../../public/205TF_Exposure_Trial/ExposureTrialVAR-Italic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-exposure",
  display: "swap",
});

export const metadata: Metadata = {
  title: "chocolates for you",
  description: "Build a box of chocolates for someone special",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${exposure.variable} h-full antialiased`}>
      <body className="relative min-h-full flex flex-col font-sans text-ink">
        <PagePaperTexture />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
