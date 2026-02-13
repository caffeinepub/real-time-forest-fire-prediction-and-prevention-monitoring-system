import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, Map, FileText, Users, LogOut, Flame } from 'lucide-react';
import { logout } from '../../state/authSession';
import { SiCaffeine } from 'react-icons/si';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/officers', label: 'Officers', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-800/30 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Flame className="h-6 w-6 text-orange-500" />
            <h1 className="text-xl font-bold text-emerald-50">Forest Fire Monitor</h1>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  onClick={() => navigate({ to: item.path })}
                  className={isActive(item.path) ? 'bg-emerald-700 hover:bg-emerald-600' : ''}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="border-b border-emerald-800/30 bg-slate-900/60 md:hidden">
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate({ to: item.path })}
                className={isActive(item.path) ? 'bg-emerald-700 hover:bg-emerald-600' : ''}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-800/30 bg-slate-900/60 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()} Forest Fire Monitoring System. Built with{' '}
            <SiCaffeine className="h-4 w-4 text-orange-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
