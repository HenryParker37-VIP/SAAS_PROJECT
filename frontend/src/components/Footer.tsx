export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">SaaS Dashboard</p>
            <p className="text-xs text-muted-foreground">Analytics Platform for Modern Businesses</p>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SaaS Dashboard. All rights reserved.
          </p>
        </div>
        <hr className="my-4 border-primary/30" />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm text-muted-foreground">
            Built &amp; maintained by{' '}
            <span className="font-semibold text-foreground">
              Nguyen Manh Tuan Hung (Henry Parker)
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Found a bug or issue?{' '}
            <a
              href="mailto:henryparker0307@gmail.com"
              className="text-primary hover:underline"
            >
              Contact me at henryparker0307@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
