import React, { useEffect } from "react";

const ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-x-circle-fill",
  info: "bi-info-circle-fill",
  warning: "bi-exclamation-triangle-fill",
};

const COLORS = {
  success: "var(--accent)",
  error: "var(--error)",
  info: "var(--info)",
  warning: "var(--warning)",
};

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--bg-elevated)",
        border: `1px solid ${COLORS[type]}40`,
        borderRadius: "var(--radius-md)",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        zIndex: 9999,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
        animation: "fadeUp 0.3s var(--ease) both",
        maxWidth: "90vw",
        minWidth: "280px",
      }}
    >
      <i
        className={`bi ${ICONS[type]}`}
        style={{ color: COLORS[type], fontSize: "1.2rem", flexShrink: 0 }}
      />
      <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", flex: 1 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          fontSize: "1rem",
          padding: "0 0.25rem",
        }}
        aria-label="Close"
      >
        <i className="bi bi-x" />
      </button>
    </div>
  );
}