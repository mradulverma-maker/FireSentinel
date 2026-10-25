import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FireSentinel — Wildfire Intelligence Dashboard",
  description: "FireSentinel: A student innovation project demonstrating a satellite-to-drone wildfire intelligence platform. All data is simulated for India forest regions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
