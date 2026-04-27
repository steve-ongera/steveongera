import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProjectBySlug } from "../utils/api";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchProjectBySlug(slug)
      .then((data) => {
        setProject(data);
        document.title = `${data.title} | Steve Ongera`;
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "calc(var(--nav-height) + 4rem)", paddingBottom: "4rem" }}>
        <div className="skeleton" style={{ height: "400px", borderRadius: "var(--radius-lg)", marginBottom: "2rem" }} />
        <div className="skeleton" style={{ height: "200px", borderRadius: "var(--radius-md)" }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ paddingTop: "calc(var(--nav-height) + 4rem)", textAlign: "center" }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: "3rem", color: "var(--text-muted)" }} />
        <h2>Project Not Found</h2>
        <Link to="/projects" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>Back to Projects</Link>
      </div>
    );
  }

  const allImages = [
    project.featured_image || project.thumbnail,
    ...(project.images?.map((i) => i.image) || []),
  ].filter(Boolean);

  return (
    <article className="project-detail" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="project-detail__breadcrumb mono">
          <Link to="/">Home</Link>
          <i className="bi bi-chevron-right" />
          <Link to="/projects">Projects</Link>
          <i className="bi bi-chevron-right" />
          <span>{project.title}</span>
        </nav>

        {/* Hero image */}
        {allImages.length > 0 && (
          <div className="project-detail__gallery">
            <div className="project-detail__main-img">
              <img src={allImages[activeImg]} alt={project.title} />
            </div>
            {allImages.length > 1 && (
              <div className="project-detail__thumbs">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`project-detail__thumb ${i === activeImg ? "project-detail__thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content grid */}
        <div className="project-detail__grid">
          {/* Main */}
          <div className="project-detail__main">
            <div className="project-detail__badges">
              <span className={`project-card__status status--${project.status}`}>{project.status_label}</span>
              <span className="badge">{project.type_label}</span>
              {project.is_featured && <span className="badge">⭐ Featured</span>}
            </div>

            <h1 className="project-detail__title">{project.title}</h1>
            <p className="project-detail__excerpt">{project.short_description}</p>

            {/* Description */}
            <div className="project-detail__description">
              {project.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Tech stack */}
            {project.tech_stack?.length > 0 && (
              <div className="project-detail__section">
                <h3><i className="bi bi-stack" /> Tech Stack</h3>
                <div className="project-detail__stack">
                  {project.tech_stack.map((s) => (
                    <span key={s.slug} className="project-detail__tech">
                      {s.icon_url && <img src={s.icon_url} alt={s.name} />}
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags?.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                {project.tags.map((tag) => (
                  <span key={tag.slug} className="badge" style={{ borderColor: `${tag.color}50`, color: tag.color }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="project-detail__sidebar">
            <div className="project-detail__info-card card">
              <h4><i className="bi bi-info-circle" /> Project Info</h4>

              {project.start_date && (
                <div className="project-detail__info-row">
                  <span className="project-detail__info-label"><i className="bi bi-calendar3" /> Timeline</span>
                  <span>{formatDate(project.start_date)} – {project.end_date ? formatDate(project.end_date) : "Ongoing"}</span>
                </div>
              )}

              <div className="project-detail__info-row">
                <span className="project-detail__info-label"><i className="bi bi-tag" /> Type</span>
                <span>{project.type_label}</span>
              </div>

              <div className="project-detail__info-row">
                <span className="project-detail__info-label"><i className="bi bi-activity" /> Status</span>
                <span className={`project-card__status status--${project.status}`}>{project.status_label}</span>
              </div>

              <div className="project-detail__info-row">
                <span className="project-detail__info-label"><i className="bi bi-eye" /> Views</span>
                <span className="mono">{project.views_count?.toLocaleString()}</span>
              </div>

              <div className="project-detail__links">
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <i className="bi bi-box-arrow-up-right" /> Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    <i className="bi bi-github" /> Source Code
                  </a>
                )}
                {project.case_study_url && (
                  <a href={project.case_study_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <i className="bi bi-file-text" /> Case Study
                  </a>
                )}
              </div>
            </div>

            <Link to="/contact" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              <i className="bi bi-chat-dots-fill" /> Hire Me for Similar Work
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}