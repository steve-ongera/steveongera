import React, { useState } from "react";
import "./Experience.css";

export default function Experience({ experiences, education, certifications }) {
  const [tab, setTab] = useState("work");

  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <span className="section-label">Background</span>
        <h2>Experience & Education</h2>

        {/* Tab switcher */}
        <div className="exp-tabs">
          <button className={`exp-tab ${tab === "work" ? "exp-tab--active" : ""}`} onClick={() => setTab("work")}>
            <i className="bi bi-briefcase-fill" /> Work
          </button>
          <button className={`exp-tab ${tab === "education" ? "exp-tab--active" : ""}`} onClick={() => setTab("education")}>
            <i className="bi bi-mortarboard-fill" /> Education
          </button>
          {certifications?.length > 0 && (
            <button className={`exp-tab ${tab === "certs" ? "exp-tab--active" : ""}`} onClick={() => setTab("certs")}>
              <i className="bi bi-patch-check-fill" /> Certifications
            </button>
          )}
        </div>

        {/* Work timeline */}
        {tab === "work" && (
          <div className="timeline">
            {experiences?.map((exp, i) => (
              <div key={exp.id} className={`timeline-item ${exp.is_current ? "timeline-item--current" : ""}`}>
                <div className="timeline-dot" />
                <div className="timeline-card card">
                  <div className="timeline-card__header">
                    {exp.company_logo ? (
                      <img src={exp.company_logo} alt={exp.company} className="timeline-card__logo" />
                    ) : (
                      <div className="timeline-card__logo-placeholder">
                        <i className="bi bi-building" />
                      </div>
                    )}
                    <div className="timeline-card__info">
                      <h3 className="timeline-card__role">{exp.role}</h3>
                      <div className="timeline-card__company">
                        {exp.company_url ? (
                          <a href={exp.company_url} target="_blank" rel="noopener noreferrer">{exp.company}</a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                        {exp.is_remote && <span className="badge">Remote</span>}
                        <span className={`badge timeline-badge--type`}>{exp.employment_type_label}</span>
                      </div>
                      <div className="timeline-card__meta mono">
                        <span>
                          <i className="bi bi-calendar3" />
                          {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </span>
                        <span className="timeline-card__duration">· {exp.duration}</span>
                        {exp.location && (
                          <span><i className="bi bi-geo-alt" /> {exp.location}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="timeline-card__desc">{exp.description}</p>

                  {exp.achievements?.length > 0 && (
                    <ul className="timeline-card__achievements">
                      {exp.achievements.map((a, idx) => (
                        <li key={idx}><i className="bi bi-arrow-right-short" /> {a}</li>
                      ))}
                    </ul>
                  )}

                  {exp.skills_used?.length > 0 && (
                    <div className="timeline-card__skills">
                      {exp.skills_used.map((s) => (
                        <span key={s.slug} className="project-card__tech">{s.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {tab === "education" && (
          <div className="timeline">
            {education?.map((edu) => (
              <div key={edu.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-card card">
                  <div className="timeline-card__header">
                    {edu.institution_logo ? (
                      <img src={edu.institution_logo} alt={edu.institution} className="timeline-card__logo" />
                    ) : (
                      <div className="timeline-card__logo-placeholder">
                        <i className="bi bi-mortarboard-fill" />
                      </div>
                    )}
                    <div className="timeline-card__info">
                      <h3 className="timeline-card__role">{edu.degree}</h3>
                      <div className="timeline-card__company">
                        {edu.institution_url ? (
                          <a href={edu.institution_url} target="_blank" rel="noopener noreferrer">{edu.institution}</a>
                        ) : (
                          <span>{edu.institution}</span>
                        )}
                      </div>
                      <p className="timeline-card__field">{edu.field_of_study}</p>
                      <div className="timeline-card__meta mono">
                        <i className="bi bi-calendar3" />
                        {formatDate(edu.start_date)} — {edu.is_current ? "Present" : formatDate(edu.end_date)}
                        {edu.grade && <span>· Grade: {edu.grade}</span>}
                      </div>
                    </div>
                  </div>
                  {edu.description && <p className="timeline-card__desc">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {tab === "certs" && (
          <div className="certs-grid">
            {certifications?.map((cert) => (
              <div key={cert.id} className="cert-card card">
                {cert.badge_image ? (
                  <img src={cert.badge_image} alt={cert.title} className="cert-card__badge" />
                ) : (
                  <div className="cert-card__badge-placeholder">
                    <i className="bi bi-patch-check-fill" />
                  </div>
                )}
                <div className="cert-card__body">
                  <h4 className="cert-card__title">{cert.title}</h4>
                  <p className="cert-card__org">{cert.issuing_organization}</p>
                  <p className="cert-card__date mono">{formatDate(cert.issue_date)}</p>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="cert-card__verify">
                      <i className="bi bi-shield-check" /> Verify
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}