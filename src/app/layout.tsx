import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SureBets Odds - Football Predictions, Live Odds & Arbitrage",
  description: "Advanced football predictions, live odds comparison, and arbitrage detection for informed betting decisions.",
  keywords: "football predictions, live odds, arbitrage betting, soccer stats, poisson model, betting tips",
  openGraph: {
    title: "SureBets Odds - Football Predictions & Arbitrage",
    description: "Your ultimate tool for data-driven football betting.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} antialiased flex flex-col min-h-full bg-gray-50 text-gray-900`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
