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
  title: "Utopians | CTF Team",
  description: "Official website of Utopians, a CTF team from the University of Calcutta. We compete in Capture The Flag competitions worldwide.",
  keywords: ["CTF", "Capture The Flag", "Cybersecurity", "Hacking", "Utopians", "University of Calcutta", "CTFtime"],
  authors: [{ name: "Utopians Team" }],
  openGraph: {
    title: "Utopians | CTF Team",
    description: "Official website of Utopians CTF team from University of Calcutta",
    url: "https://utopians.team",
    siteName: "Utopians",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utopians | CTF Team",
    description: "Official website of Utopians CTF team from University of Calcutta",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <main className="grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
