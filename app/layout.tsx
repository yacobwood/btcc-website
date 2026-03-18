import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://btcc-website.vercel.app"),
  title: "BTCC — British Touring Car Championship",
  description:
    "The official home of the British Touring Car Championship. Latest news, race results, driver standings, and the 2026 season calendar.",
  openGraph: {
    title: "BTCC — British Touring Car Championship",
    description: "The official home of the British Touring Car Championship.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}
        style={{ fontFamily: "var(--font-barlow), Arial, sans-serif", background: "#080912", color: "#fff" }}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
