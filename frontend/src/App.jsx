import './styles/globals.css';
import React, { useState, useEffect, useCallback, Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/common/ScrollToTop';
import AuroraBackground from './components/AuroraBackground';

// Public Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const SkillsPage = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Experience = lazy(() => import('./pages/Experience'));
const Services = lazy(() => import('./pages/Services'));
const Testimonials = lazy(() => import('./pages/Placeholders').then((module) => ({ default: module.Testimonials })));
const NotFound = lazy(() => import('./pages/Placeholders').then((module) => ({ default: module.NotFound })));

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AdminProjects from './pages/Admin/Projects';
import AdminBlogs from './pages/Admin/Blogs';
import Messages from './pages/Admin/Messages';
import AdminSkills from './pages/Admin/Skills';
import Settings from './pages/Admin/Settings';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Uncaught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#0d1117', color: '#f0f6fc', fontFamily: 'sans-serif', minHeight: '100vh' }}>
          <h1 style={{ color: '#f85149', fontSize: 24 }}>App Runtime Error Caught</h1>
          <p style={{ margin: '16px 0', color: '#8b949e' }}>An unexpected error occurred while rendering the page:</p>
          <pre style={{ background: '#161b22', padding: 20, borderRadius: 8, overflowX: 'auto', color: '#ff7b72', border: '1px solid #30363d' }}>
            {this.state.error && this.state.error.toString()}
            {'\n'}
            {this.state.error && this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {/* Fixed aurora canvas — renders behind everything, persists across routes */}
      {!isAdminRoute && <AuroraBackground />}
      <div
        className="min-h-screen flex flex-col"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {!isAdminRoute && <Navbar />}
        <main className="flex-grow">
          <Suspense fallback={<LoadingScreen onLoadingComplete={() => {}} />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="messages" element={<Messages />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

function App() {
  // Show loader on every true page load (including refresh).
  // Use a runtime flag set by the loader on completion — cleared on each hard navigation.
  // sessionStorage persists across SPA navigations but resets on tab close / new tab.
  // We additionally check performance entries to detect hard reloads vs SPA nav.
  const [needsLoader] = useState(() => {
    // If this is a hard navigation (first load or refresh), always show loader.
    const entries = performance.getEntriesByType?.('navigation') ?? [];
    const navType  = entries[0]?.type ?? 'navigate';
    // navType: 'navigate' = fresh load, 'reload' = F5, 'back_forward' = history
    // For navigate + reload we always show loader.
    // For back_forward we skip (user hit back button — don't re-play).
    if (navType === 'back_forward') {
      return false;
    }
    // For genuine page loads, clear stale flag and show loader.
    sessionStorage.removeItem('hasSeenLoader');
    return true;
  });

  const handleLoadingComplete = useCallback(() => {
    sessionStorage.setItem('hasSeenLoader', 'true');
  }, []);

  return (
    <AppErrorBoundary>
      <Router>
        {/* LoadingScreen self-unmounts when done — App never force-removes it */}
        {needsLoader && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}
        <AppContent />
      </Router>
    </AppErrorBoundary>
  );
}

export default App;
