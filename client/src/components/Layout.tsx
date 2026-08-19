import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout() {
  return (
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
      {/* No max-width/padding here on purpose - pages (feed, channel banner,
          dashboard sidebar, etc.) manage their own width and full-bleed
          sections individually, same as the Figma reference screens. */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
