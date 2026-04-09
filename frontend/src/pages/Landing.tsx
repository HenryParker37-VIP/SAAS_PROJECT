import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import {
  Zap,
  BarChart3,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  LineChart,
  Users,
  Download,
  Bell,
  Moon,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Interactive charts and metrics that update live via WebSocket. Track revenue, products, and regional data instantly.',
  },
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'JWT-based login with encrypted passwords, rate limiting, and role-based access control for admin features.',
  },
  {
    icon: Globe,
    title: 'Multi-Region Insights',
    description: 'Break down your data by North America, Europe, and Asia. Understand where your revenue comes from.',
  },
  {
    icon: Download,
    title: 'Export to CSV',
    description: 'Download filtered transaction data as CSV with one click. Perfect for reports and spreadsheet analysis.',
  },
  {
    icon: Bell,
    title: 'Login Notifications',
    description: 'Get email alerts whenever a user logs into the platform. Stay informed about account activity.',
  },
  {
    icon: Moon,
    title: 'Dark & Light Mode',
    description: 'Beautiful UI with full dark mode support. Comfortable viewing in any lighting condition.',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '< 200ms', label: 'Response Time' },
  { value: '5+', label: 'Chart Types' },
  { value: '24/7', label: 'Monitoring' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-foreground">SaaS Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            Analytics Platform for Modern Businesses
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Your Business Data,{' '}
            <span className="text-primary">Visualized</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A powerful SaaS dashboard with real-time charts, transaction tracking,
            advanced filtering, and CSV export. Everything you need to understand your business at a glance.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-base"
            >
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors text-base"
            >
              Sign In to Demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Demo account available — no signup required
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground">saas-mydashboard.netlify.app</span>
            </div>
            <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: '$49,292', icon: LineChart, color: 'text-primary' },
                { label: 'Transactions', value: '149', icon: BarChart3, color: 'text-green-500' },
                { label: 'Active Users', value: '8', icon: Users, color: 'text-purple-500' },
                { label: 'Regions', value: '3', icon: Globe, color: 'text-orange-500' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-background p-4 h-40 flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-10 w-10 text-primary mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">Monthly Revenue Chart</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4 h-40 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-green-500 mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">Product Sales Chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-y border-border bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Everything You Need</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Built with modern technologies for speed, security, and a great user experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-card-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="border-y border-border bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">Built With Modern Tech</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Recharts', 'JWT Auth', 'Vite'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Try the demo with sample data or create your own account — it's free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-1">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Works on desktop &amp; mobile</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
