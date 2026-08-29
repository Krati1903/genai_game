// Root layout wrapping all pages
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GenAI Dashboard",
  description: "Recursive video generation dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
