import { RouterProvider, createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Reports from './pages/Reports';
import Officers from './pages/Officers';
import AppLayout from './components/layout/AppLayout';
import { isAuthenticated } from './state/authSession';

// Root route with layout for authenticated pages
const rootRoute = createRootRoute({
  component: () => {
    const path = window.location.pathname;
    if (path === '/' || path === '/splash') {
      return <Splash />;
    }
    if (path === '/login') {
      return <Login />;
    }
    return <AppLayout />;
  },
});

// Public routes
const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Splash,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

// Protected routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: Dashboard,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/map',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: Map,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: Reports,
});

const officersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/officers',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: Officers,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  loginRoute,
  dashboardRoute,
  mapRoute,
  reportsRoute,
  officersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
