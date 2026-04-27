import React from "react";
import "./Hero.css";

export default function Hero({ profile, stats }) {
  if (!profile) return null;

  const socials = [
    { icon: "bi-github", url: profile.github_url },
    { icon: "bi-linkedin", url: profile.linkedin_url },
    { icon: "bi-twitter-x", url: profile.twitter_url },
    { icon: "bi-patch-check-fill", url: profile.upwork_url, label: "Upwork" },
  ].filter((s) => s.url);

  return (
    <section className="hero section" id="home">
      {/* Glow blobs */}
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          {/* Status badge */}
          <div className={`hero__badge availability-badge availability-badge--${profile.availability}`}>
            <span className="pulse" />
            <span>{profile.availability_label || "Available for Work"}</span>
          </div>

          {/* Heading */}
          <h1 className="hero__name reveal">
            {profile.full_name}
            <span className="dot-accent">.</span>
          </h1>

          <h2 className="hero__title reveal reveal-delay-1">{profile.title}</h2>

          <p className="hero__bio reveal reveal-delay-2">
            {profile.bio_short || profile.bio}
          </p>

          {/* Location / remote badge */}
          <div className="hero__meta reveal reveal-delay-3">
            <span className="hero__meta-item">
              <i className="bi bi-geo-alt-fill" />
              {profile.location}
            </span>
            {profile.open_to_remote && (
              <span className="hero__meta-item hero__meta-item--accent">
                <i className="bi bi-globe2" />
                Open to Remote Worldwide
              </span>
            )}
            <span className="hero__meta-item">
              <i className="bi bi-briefcase-fill" />
              {profile.years_experience}+ yrs experience
            </span>
          </div>

          {/* CTAs */}
          <div className="hero__cta reveal reveal-delay-4">
            <a href="/contact" className="btn btn-primary hero__cta-primary">
              <i className="bi bi-send-fill" />
              Hire Me
            </a>
            <a href="/#projects" className="btn btn-outline">
              <i className="bi bi-grid-3x3-gap-fill" />
              View Work
            </a>
            {profile.resume && (
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <i className="bi bi-download" />
                Résumé
              </a>
            )}
          </div>

          {/* Social links */}
          <div className="hero__socials reveal reveal-delay-4">
            {socials.map(({ icon, url, label }) => (
              <a key={icon} href={url} target="_blank" rel="noopener noreferrer" className="hero__social" aria-label={label}>
                <i className={`bi ${icon}`} />
              </a>
            ))}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="hero__social" aria-label="Email">
                <i className="bi bi-envelope-fill" />
              </a>
            )}
          </div>
        </div>

        {/* Right column — avatar + stats */}
        <div className="hero__visual reveal reveal-delay-2">
          <div className="hero__avatar-wrap">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.full_name} className="hero__avatar" />
            ) : (
              <div className="hero__avatar-placeholder">
                <i className="bi bi-person-fill" />
              </div>
            )}
            <div className="hero__avatar-ring" aria-hidden="true" />
          </div>

          {/* Floating stats */}
          {stats && stats.slice(0, 4).map((stat, i) => (
            <div key={stat.id} className={`hero__stat hero__stat--${i + 1}`}>
              <span className="hero__stat-value mono">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint">
        <span className="mono">scroll</span>
        <i className="bi bi-arrow-down" />
      </div>
    </section>
  );
}