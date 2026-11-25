import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utopians — CTF team, University of Calcutta",
  description:
    "Utopians is a Capture The Flag team at the University of Calcutta. 105 events played, best placement #21, 31 top-100 finishes.",
  keywords: [
    "CTF",
    "Capture The Flag",
    "cybersecurity",
    "Utopians",
    "University of Calcutta",
    "CTFtime",
  ],
  authors: [{ name: "Utopians" }],
  openGraph: {
    title: "Utopians — CTF team, University of Calcutta",
    description:
      "Capture The Flag team at the University of Calcutta. 105 events played, best placement #21.",
    url: "https://utopians.vercel.app",
    siteName: "Utopians",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utopians — CTF team, University of Calcutta",
    description:
      "Capture The Flag team at the University of Calcutta. 105 events played, best placement #21.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
