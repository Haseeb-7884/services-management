import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Creator Hub",
  description: "Videos, images and articles from independent creators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <Providers>
          <div
            className="flex min-h-screen flex-col bg-[var(--brand-bg-start)] text-[var(--brand-text)]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, var(--brand-bg-end) 0%, var(--brand-bg-start) 45%, var(--brand-bg-end) 100%)",
              backgroundAttachment: "fixed",
              fontFamily: "var(--brand-font)",
            }}
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
