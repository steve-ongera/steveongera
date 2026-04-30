import { useEffect, useState } from "react";
import IndexPage from "./pages/IndexPage.jsx";

/**
 * App.jsx
 * Root component. Currently a single-page portfolio, but structured so you
 * can drop in React Router later (e.g. for /blog/:slug, /projects/:slug).
 */
export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Minimal client-side routing hook (no extra dependency needed)
  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Route matching — extend here when you add more pages
  switch (currentPath) {
    case "/":
    default:
      return <IndexPage />;
  }
}