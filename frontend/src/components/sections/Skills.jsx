import React, { useState } from "react";
import "./Skills.css";

const PROFICIENCY_LABELS = ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];

export default function Skills({ skillCategories }) {
  const [activeCategory, setActiveCategory] = useState("all");

  if (!skillCategories?.length) return null;

  const allSkills = skillCategories.flatMap((c) => c.skills || []);
  const displaySkills =
    activeCategory === "all"
      ? allSkills
      : skillCategories.find((c) => c.slug === activeCategory)?.skills || [];

  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <span className="section-label">Technical Skills</span>
        <h2>What I Build With</h2>
        <p className="skills-section__sub">
          A curated set of tools and technologies I use to ship production-grade software.
        </p>

        {/* Category filter tabs */}
        <div className="skills-section__tabs" role="tablist">
          <button
            className={`skills-tab ${activeCategory === "all" ? "skills-tab--active" : ""}`}
            onClick={() => setActiveCategory("all")}
            role="tab"
            aria-selected={activeCategory === "all"}
          >
            All ({allSkills.length})
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.slug}
              className={`skills-tab ${activeCategory === cat.slug ? "skills-tab--active" : ""}`}
              onClick={() => setActiveCategory(cat.slug)}
              role="tab"
              aria-selected={activeCategory === cat.slug}
            >
              {cat.icon && <i className={`bi ${cat.icon}`} />}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="skills-grid">
          {displaySkills.map((skill) => (
            <div key={skill.slug} className="skill-card">
              <div className="skill-card__header">
                {skill.icon_url ? (
                  <img src={skill.icon_url} alt={skill.name} className="skill-card__icon" />
                ) : skill.icon_class ? (
                  <div className="skill-card__icon-placeholder">
                    <i className={`bi ${skill.icon_class}`} />
                  </div>
                ) : (
                  <div className="skill-card__icon-text">{skill.name.slice(0, 2).toUpperCase()}</div>
                )}
                <div>
                  <h4 className="skill-card__name">{skill.name}</h4>
                  <span className="skill-card__years mono">{skill.years}+ yrs</span>
                </div>
              </div>

              {/* Proficiency bar */}
              <div className="skill-card__bar-wrap">
                <div
                  className="skill-card__bar"
                  style={{ "--w": `${(skill.proficiency / 5) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={skill.proficiency * 20}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${skill.name}: ${skill.proficiency_label}`}
                />
              </div>
              <div className="skill-card__proficiency">
                {PROFICIENCY_LABELS[skill.proficiency] || skill.proficiency_label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}