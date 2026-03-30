import { Geist, Geist_Mono, Noto_Sans_Hebrew, Noto_Sans_Symbols_2 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600"],
});

const notoSymbols = Noto_Sans_Symbols_2({
  variable: "--font-noto-symbols",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Astrohacking — Árbol de la vida",
  description: "Asignación de signos a planetas y correspondencias cabalísticas.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${notoHebrew.variable} ${notoSymbols.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
