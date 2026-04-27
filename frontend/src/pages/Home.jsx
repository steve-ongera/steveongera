import React from "react";
import Hero from "../components/sections/Hero";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Testimonials from "../components/sections/Testimonials";
import Services from "../components/sections/Services";

export default function Home({ data }) {
  if (!data) return null;

  const {
    profile,
    skills,
    featured_projects,
    experiences,
    education,
    certifications,
    featured_testimonials,
    services,
    stats,
  } = data;

  return (
    <>
      <Hero profile={profile} stats={stats} />

      {/* Stats bar */}
      {stats?.length > 0 && (
        <div style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "2rem 0",
        }}>
          <div className="container" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "2rem" }}>
            {stats.map((stat) => (
              <div key={stat.id} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "var(--accent)" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Skills skillCategories={skills} />
      <Projects projects={featured_projects} />
      <Experience experiences={experiences} education={education} certifications={certifications} />
      <Testimonials testimonials={featured_testimonials} />
      <Services services={services} />
    </>
  );
}