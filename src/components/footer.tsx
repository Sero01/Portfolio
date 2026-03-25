export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
        <p>&copy; {new Date().getFullYear()} Parvez. All rights reserved.</p>
        <p>Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
