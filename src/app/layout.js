import { Roboto, Outfit } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Kenan's Portfolio",
  description: "A fast Next.js & Hono EDGE portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${outfit.className}`}>{children}</body>
    </html>
  );
}
