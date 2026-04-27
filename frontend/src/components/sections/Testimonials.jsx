import React, { useState, useRef } from "react";
import "./Testimonials.css";

export default function Testimonials({ testimonials }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);

  if (!testimonials?.length) return null;

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  const t = testimonials[active];

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <span className="section-label">Social Proof</span>
        <h2>What Clients Say</h2>

        <div className="testimonials-inner">
          {/* Quote */}
          <div className="testimonials-quote-wrap">
            <i className="bi bi-quote testimonials-quote-icon" aria-hidden="true" />
            <blockquote className="testimonials-quote" key={active}>
              {t.content}
            </blockquote>
          </div>

          {/* Author */}
          <div className="testimonials-author">
            {t.author_avatar ? (
              <img src={t.author_avatar} alt={t.author_name} className="testimonials-avatar" />
            ) : (
              <div className="testimonials-avatar-placeholder">
                {t.author_name.slice(0, 1)}
              </div>
            )}
            <div>
              <div className="testimonials-name">
                {t.author_linkedin ? (
                  <a href={t.author_linkedin} target="_blank" rel="noopener noreferrer">{t.author_name}</a>
                ) : (
                  t.author_name
                )}
              </div>
              <div className="testimonials-role">{t.author_title}{t.author_company && ` · ${t.author_company}`}</div>
              {t.relationship && <div className="testimonials-relationship mono">{t.relationship}</div>}
            </div>
            {/* Stars */}
            <div className="testimonials-stars">
              {Array.from({ length: t.rating }).map((_, i) => (
                <i key={i} className="bi bi-star-fill" />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="testimonials-controls">
            <button onClick={prev} className="testimonials-btn" aria-label="Previous testimonial">
              <i className="bi bi-arrow-left" />
            </button>
            <div className="testimonials-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testimonials-dot ${i === active ? "testimonials-dot--active" : ""}`}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} className="testimonials-btn" aria-label="Next testimonial">
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        </div>

        {/* Thumbnails row */}
        <div className="testimonials-thumbs">
          {testimonials.map((tt, i) => (
            <button
              key={tt.id}
              className={`testimonials-thumb ${i === active ? "testimonials-thumb--active" : ""}`}
              onClick={() => setActive(i)}
              title={tt.author_name}
            >
              {tt.author_avatar ? (
                <img src={tt.author_avatar} alt={tt.author_name} />
              ) : (
                <span>{tt.author_name.slice(0, 1)}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}