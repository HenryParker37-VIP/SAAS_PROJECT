import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Zap } from 'lucide-react';
import { Footer } from '@/components/Footer';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto mb-6">
            <Zap className="h-8 w-8" />
          </div>

          <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
