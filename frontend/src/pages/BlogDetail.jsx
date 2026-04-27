import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBlogPostBySlug } from "../utils/api";
import "./BlogDetail.css";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBlogPostBySlug(slug)
      .then((data) => {
        setPost(data);
        document.title = `${data.meta_title || data.title} | Steve Ongera`;
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container container--narrow" style={{ paddingTop: "calc(var(--nav-height) + 4rem)" }}>
        <div className="skeleton" style={{ height: "40px", width: "60%", borderRadius: "4px", marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: "300px", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "18px", borderRadius: "4px", marginBottom: "0.75rem", width: `${80 + Math.random() * 20}%` }} />
        ))}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container" style={{ paddingTop: "calc(var(--nav-height) + 4rem)", textAlign: "center" }}>
        <i className="bi bi-journal-x" style={{ fontSize: "3rem", color: "var(--text-muted)" }} />
        <h2>Article Not Found</h2>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="blog-detail" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="container container--narrow">
        {/* Breadcrumb */}
        <nav className="project-detail__breadcrumb mono">
          <Link to="/">Home</Link>
          <i className="bi bi-chevron-right" />
          <Link to="/blog">Blog</Link>
          <i className="bi bi-chevron-right" />
          <span>{post.title.slice(0, 40)}{post.title.length > 40 ? "..." : ""}</span>
        </nav>

        {/* Meta */}
        <div className="blog-detail__meta">
          {post.tags?.map((t) => (
            <span key={t.slug} className="badge" style={{ color: t.color, borderColor: `${t.color}50` }}>{t.name}</span>
          ))}
          <span className="mono blog-card__date">{formatDate(post.published_at)}</span>
          <span className="mono blog-card__read-time"><i className="bi bi-clock" /> {post.read_time} min read</span>
          <span className="mono blog-card__read-time"><i className="bi bi-eye" /> {post.views_count} views</span>
        </div>

        <h1 className="blog-detail__title">{post.title}</h1>
        <p className="blog-detail__excerpt">{post.excerpt}</p>

        {/* Cover image */}
        {post.cover_image && (
          <div className="blog-detail__cover">
            <img src={post.cover_image} alt={post.title} />
          </div>
        )}

        {/* Content */}
        <div
          className="blog-detail__content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author card */}
        <div className="blog-detail__author card">
          <div className="blog-detail__author-avatar">
            <i className="bi bi-person-circle" />
          </div>
          <div>
            <h4>Steve Ongera</h4>
            <p>Backend Engineer · Django · Python · Nairobi, Kenya</p>
            <div className="blog-detail__author-links">
              <Link to="/contact" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "0.5rem 1rem" }}>
                <i className="bi bi-envelope" /> Get in touch
              </Link>
              <Link to="/projects" className="btn btn-outline" style={{ fontSize: "0.82rem", padding: "0.5rem 1rem" }}>
                <i className="bi bi-grid" /> View Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="blog-detail__nav">
          <Link to="/blog" className="btn btn-ghost">
            <i className="bi bi-arrow-left" /> All Articles
          </Link>
        </div>
      </div>
    </article>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}