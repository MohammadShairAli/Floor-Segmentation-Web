import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Floor Studio",
  description: "Apply stone designs to floor images with SAM masking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
