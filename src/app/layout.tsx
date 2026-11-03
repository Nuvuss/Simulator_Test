import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simulasi Tes Booking Manager - RevoU",
  description: "Simulasi tes untuk calon Booking Manager (Admission Executive) RevoU",
  icons: {
    icon: [
      { url: "/revou-logo.png", type: "image/png" },
    ],
    shortcut: "/revou-logo.png",
    apple: "/revou-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
