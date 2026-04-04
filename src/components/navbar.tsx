"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

const navLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "/resume.pdf", external: true },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ─── Desktop navbar ─── */}
      <nav
        aria-label="Main navigation"
        className="hidden md:block fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#"
            className="font-[family-name:var(--font-display)] text-sm uppercase tracking-widest font-bold"
          >
            parvez
          </a>
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/parvez-ahmed-b47680124/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
            >
              LinkedIn
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ─── Mobile: single card that expands from pill ─── */}
      <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          layout
          transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
          className={`bg-[var(--color-bg)] border border-[var(--color-border)] shadow-lg w-[min(95vw,320px)] ${
            mobileOpen ? "rounded-3xl" : "rounded-full"
          }`}
        >
          {/* Header row — always visible */}
          <motion.div layout="position" className="flex items-center gap-3 p-1.5">
            {/* Profile pic */}
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[var(--color-border)] shrink-0">
              <Image
                src="/profile.jpg"
                alt="Parvez"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Available for work + green dot — visible when closed */}
            <div className="flex-1 min-w-0">
              {!mobileOpen && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[var(--color-fg)] text-sm font-medium whitespace-nowrap">
                    Available for work
                  </span>
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                </div>
              )}
            </div>

            {/* Toggle button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <motion.g
                  animate={{ rotate: mobileOpen ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ transformOrigin: "9px 9px" }}
                >
                  <motion.line
                    x1="4" x2="14"
                    animate={{ y1: mobileOpen ? 9 : 6, y2: mobileOpen ? 9 : 6 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  />
                </motion.g>
                <motion.line
                  x1="4" y1="9" x2="14" y2="9"
                  animate={{ opacity: mobileOpen ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.g
                  animate={{ rotate: mobileOpen ? -45 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ transformOrigin: "9px 9px" }}
                >
                  <motion.line
                    x1="4" x2="14"
                    animate={{ y1: mobileOpen ? 9 : 12, y2: mobileOpen ? 9 : 12 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  />
                </motion.g>
              </svg>
            </button>
          </motion.div>

          {/* Expandable nav content — slides down */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="mobile-nav-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <nav className="flex flex-col items-center gap-5 px-6 pt-4 pb-2">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      onClick={() => setMobileOpen(false)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.2 }}
                      className="text-[var(--color-fg)] text-lg font-medium tracking-wide hover:text-[var(--color-accent)] transition-colors"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>

                <motion.div
                  className="flex justify-center px-6 pt-4 pb-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.2 }}
                >
                  <a
                    href="#contact"
                    onClick={() => setMobileOpen(false)}
                    className="px-8 py-3 rounded-full bg-[var(--color-accent)] text-white text-base font-semibold tracking-wide hover:opacity-90 transition-opacity"
                  >
                    Contact
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
