import type { Metadata } from "next";
import * as fonts from "../font";
import { lowband as meta } from "../meta";
import { phoneScript } from "../phone";
import "./globals.css";

export const metadata: Metadata = {
  title: `${meta.name} · ${meta.industry}`,
  description: meta.tagline,
};

// Every font the product declares (text, display, mono) becomes a CSS variable class.
const fontClasses = Object.values(fonts)
  .map((font) => (font as { variable: string }).variable)
  .join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClasses}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: phoneScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
