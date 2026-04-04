import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ParticleField } from "@/components/particle-field";
import { CursorCircle } from "@/components/cursor-circle";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Parvez — Creative Designer",
  description: "Portfolio of Parvez, a Full-Stack Developer building modern web applications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ParticleField />
          <CursorCircle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
