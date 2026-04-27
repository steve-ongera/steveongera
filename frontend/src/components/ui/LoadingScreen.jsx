import React from "react";

export default function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: "60px",
          height: "60px",
          background: "var(--accent)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "1.8rem",
          color: "var(--bg-base)",
          animation: "pulse-logo 1.2s ease-in-out infinite",
        }}
      >
        S
      </div>

      {/* Spinner bar */}
      <div
        style={{
          width: "160px",
          height: "3px",
          background: "var(--bg-elevated)",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "var(--accent)",
            borderRadius: "99px",
            animation: "loading-bar 1.4s ease-in-out infinite",
          }}
        />
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          letterSpacing: "0.15em",
        }}
      >
        Loading portfolio...
      </p>

      <style>{`
        @keyframes pulse-logo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.95); }
        }
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 70%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}