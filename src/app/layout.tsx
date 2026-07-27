import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PriceChecker",
  description:
    "Compara preços de produtos e calcula o custo das tuas receitas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
