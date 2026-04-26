import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { fetchPortfolioSummary } from "./utils/api";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ui/ScrollToTop";
import LoadingScreen from "./components/ui/LoadingScreen";
import Toast from "./components/ui/Toast";

// Pages
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetail";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

// ─────────────────────────────────────────────
// GLOBAL CONTEXT
// ─────────────────────────────────────────────
export const PortfolioContext = createContext(null);

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return ctx;
}

// ─────────────────────────────────────────────
// SCROLL RESTORATION
// ─────────────────────────────────────────────
function ScrollRestoration() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPortfolioSummary();
        setPortfolioData(data);
      } catch (err) {
        setError("Failed to load portfolio data. Please refresh.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <PortfolioContext.Provider value={{ portfolioData, showToast }}>
      <Router>
        <ScrollRestoration />
        <div className="app-wrapper">
          <Navbar profile={portfolioData?.profile} />
          <main className="main-content">
            {error && (
              <div className="error-banner">
                <i className="bi bi-exclamation-triangle-fill" />
                {error}
              </div>
            )}
            <Routes>
              <Route path="/" element={<Home data={portfolioData} />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer profile={portfolioData?.profile} />
          <ScrollToTop />
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </Router>
    </PortfolioContext.Provider>
  );
}