import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(6rem, 15vw, 12rem)",
          fontWeight: 800,
          lineHeight: 1,
          background: "linear-gradient(135deg, var(--accent) 0%, transparent 80%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>
        Page Not Found
      </h2>

      <p style={{ color: "var(--text-secondary)", maxWidth: "400px", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
        The route you're looking for doesn't exist. Maybe it was moved or the URL has a typo.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house-fill" /> Go Home
        </Link>
        <Link to="/projects" className="btn btn-outline">
          <i className="bi bi-grid-3x3-gap" /> Browse Projects
        </Link>
        <Link to="/contact" className="btn btn-ghost">
          <i className="bi bi-chat" /> Contact Me
        </Link>
      </div>
    </div>
  );
}