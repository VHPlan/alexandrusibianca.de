import type { Metadata, Viewport } from "next";
import { Alex_Brush, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alexandrusibianca.de"),
  title: "The Wedding · Alex & Bianca",
  description:
    "Invitație de nuntă — Alex & Bianca, 15 octombrie 2027, Lavin Events, Bruchsal. Vă așteptăm cu drag alături de noi!",
  openGraph: {
    title: "The Wedding · Alex & Bianca",
    description: "Vă invităm să fiți alături de noi în cea mai frumoasă zi din viața noastră.",
    images: ["/images/wedding/hero-ballroom.jpg"],
    locale: "ro_RO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a120d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${alexBrush.variable} ${inter.variable} antialiased`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
