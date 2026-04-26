import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/#projects", label: "Projects" },
  { to: "/#experience", label: "Experience" },
  { to: "/#services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleHashLink = (e, to) => {
    if (to.startsWith("/#")) {
      e.preventDefault();
      const id = to.slice(2);
      if (pathname !== "/") {
        window.location.href = to;
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--open" : ""}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-mark">S</span>
          <span className="navbar__logo-text">
            {profile?.full_name?.split(" ")[0] || "Steve"}
            <span className="dot-accent">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <a
              key={to}
              href={to}
              className={`navbar__link ${pathname === to ? "navbar__link--active" : ""}`}
              onClick={(e) => handleHashLink(e, to)}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="navbar__cta">
          {profile?.resume && (
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline navbar__resume"
            >
              <i className="bi bi-file-earmark-person" />
              Résumé
            </a>
          )}
          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}>
        <nav>
          {NAV_LINKS.map(({ to, label }) => (
            <a
              key={to}
              href={to}
              className="navbar__mobile-link"
              onClick={(e) => { handleHashLink(e, to); setMenuOpen(false); }}
            >
              {label}
            </a>
          ))}
          {profile?.resume && (
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              <i className="bi bi-download" /> Download Résumé
            </a>
          )}
        </nav>
        {/* Social links in mobile */}
        <div className="navbar__mobile-social">
          {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer"><i className="bi bi-github" /></a>}
          {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin" /></a>}
          {profile?.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"><i className="bi bi-twitter-x" /></a>}
        </div>
      </div>
    </header>
  );
}