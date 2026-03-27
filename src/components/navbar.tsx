"use client";

import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const navLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "/resume.pdf", external: true },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <a
          href="#"
          className="font-[family-name:var(--font-display)] text-sm uppercase tracking-widest font-bold"
        >
          parvez
        </a>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
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
        </div>

        {/* Right: LinkedIn + Theme Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/parvez-ahmed-b47680124/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            LinkedIn
          </a>
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="13" x2="15" y2="13" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://www.linkedin.com/in/parvez-ahmed-b47680124/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors sm:hidden"
            >
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
