import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wavefront Studio",
  description: "Visualize premium stone floor designs on your room photos in real time.",
  icons: {
    icon: "/Wavefront.svg",
    shortcut: "/Wavefront.svg",
    apple: "/Wavefront.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
