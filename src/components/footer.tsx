export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
        <p>Designed &amp; Developed by Parvez</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Sero01"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/parvez-ahmed-b47680124/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors"
          >
            LinkedIn
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} &middot; All Rights Reserved</p>
      </div>
    </footer>
  );
}
