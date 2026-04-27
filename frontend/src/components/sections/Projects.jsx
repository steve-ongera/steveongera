import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Projects.css";

export default function Projects({ projects }) {
  const [filter, setFilter] = useState("all");

  if (!projects?.length) return null;

  const types = ["all", ...new Set(projects.map((p) => p.project_type))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.project_type === filter);

  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <span className="section-label">Portfolio</span>
        <div className="projects-section__header">
          <h2>Featured Work</h2>
          <Link to="/projects" className="btn btn-ghost">
            All Projects <i className="bi bi-arrow-right" />
          </Link>
        </div>

        {/* Filter */}
        <div className="projects-section__filters">
          {types.map((t) => (
            <button
              key={t}
              className={`skills-tab ${filter === t ? "skills-tab--active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t === "all" ? "All" : t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="projects-grid">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} featured={i === 0 && filter === "all"} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectCard({ project, featured = false }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`project-card card ${featured ? "project-card--featured" : ""}`}
    >
      {/* Thumbnail */}
      <div className="project-card__thumb">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} loading="lazy" />
        ) : (
          <div className="project-card__thumb-placeholder">
            <i className="bi bi-code-slash" />
          </div>
        )}
        {/* Hover overlay */}
        <div className="project-card__overlay">
          <span className="btn btn-primary">View Project <i className="bi bi-arrow-up-right" /></span>
        </div>
        {/* Badges */}
        <div className="project-card__badges">
          {project.is_featured && <span className="badge">⭐ Featured</span>}
          <span className="badge">{project.type_label}</span>
        </div>
      </div>

      {/* Body */}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.short_description}</p>

        {/* Tech stack chips */}
        {project.tech_stack?.length > 0 && (
          <div className="project-card__stack">
            {project.tech_stack.slice(0, 4).map((s) => (
              <span key={s.slug} className="project-card__tech">{s.name}</span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="project-card__tech project-card__tech--more">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Links row */}
        <div className="project-card__links" onClick={(e) => e.preventDefault()}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-card__link">
              <i className="bi bi-github" /> Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="project-card__link">
              <i className="bi bi-box-arrow-up-right" /> Live
            </a>
          )}
          <span className={`project-card__status status--${project.status}`}>{project.status_label}</span>
        </div>
      </div>
    </Link>
  );
}