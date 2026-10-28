import { Sora, Unbounded } from "next/font/google";

export const font = Sora({ subsets: ["latin"], variable: "--font-lowband", display: "swap", preload: false, adjustFontFallback: false });
export const display = Unbounded({ subsets: ["latin"], variable: "--font-lowband-display", display: "swap", preload: false, adjustFontFallback: false });
