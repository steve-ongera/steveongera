import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer({ profile }) {
  const year = new Date().getFullYear();

  const socials = [
    { icon: "bi-github", url: profile?.github_url, label: "GitHub" },
    { icon: "bi-linkedin", url: profile?.linkedin_url, label: "LinkedIn" },
    { icon: "bi-twitter-x", url: profile?.twitter_url, label: "Twitter" },
    { icon: "bi-patch-check-fill", url: profile?.upwork_url, label: "Upwork" },
  ].filter((s) => s.url);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-mark">S</span>
            <span className="footer__logo-text">Steve Ongera<span className="dot-accent">.</span></span>
          </Link>
          <p className="footer__tagline">
            {profile?.title || "Backend Engineer · Django · Python"}
          </p>
          <p className="footer__location">
            <i className="bi bi-geo-alt-fill" />
            {profile?.location || "Nairobi, Kenya"} &mdash; Open to Remote
          </p>
        </div>

        {/* Links */}
        <nav className="footer__nav">
          <h4>Navigation</h4>
          <Link to="/">Home</Link>
          <a href="/#projects">Projects</a>
          <a href="/#experience">Experience</a>
          <a href="/#services">Services</a>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <nav className="footer__nav">
          <h4>Connect</h4>
          {socials.map(({ icon, url, label }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer">
              <i className={`bi ${icon}`} /> {label}
            </a>
          ))}
          {profile?.email && (
            <a href={`mailto:${profile.email}`}>
              <i className="bi bi-envelope-fill" /> Email
            </a>
          )}
        </nav>

        {/* Availability badge */}
        <div className="footer__availability">
          <div className={`availability-badge availability-badge--${profile?.availability || "available"}`}>
            <span className="pulse" />
            <span>{profile?.availability === "available" ? "Available for Work" : profile?.availability_label || "Available"}</span>
          </div>
          <p>Based in East Africa, working globally.</p>
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="btn btn-primary footer__hire-btn">
              <i className="bi bi-send-fill" /> Hire Me
            </a>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="mono">© {year} Steve Ongera. Built with Django + React.</p>
          <p>Made with <i className="bi bi-heart-fill" style={{ color: "var(--error)" }} /> in Nairobi, Kenya 🇰🇪</p>
        </div>
      </div>
    </footer>
  );
}