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
      <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
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
  // Show loader only on the very first visit of the session.
  // sessionStorage is cleared when the tab is closed, so opening a new tab
  // or a brand-new browser session will always show the loader again.
  const [isLoading, setIsLoading] = useState(
    () => !sessionStorage.getItem('hasSeenLoader')
  );

  const handleLoadingComplete = useCallback(() => {
    // Mark that the loader has been seen for this session
    sessionStorage.setItem('hasSeenLoader', 'true');
    setIsLoading(false);
  }, []);

  return (
    <AppErrorBoundary>
      <Router>
        {isLoading && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}
        <AppContent />
      </Router>
    </AppErrorBoundary>
  );
}

export default App;
