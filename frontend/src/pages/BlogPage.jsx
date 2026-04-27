import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchBlogPosts, fetchTags } from "../utils/api";
import "./BlogPage.css";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => {
    document.title = "Blog | Steve Ongera";
    fetchTags().then((d) => setTags(d.results || d)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBlogPosts({ search, "tags__slug": tagFilter })
      .then((d) => setPosts(d.results || d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, tagFilter]);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="blog-page" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="container">
        {/* Header */}
        <div className="blog-page__header">
          <span className="section-label">Writing</span>
          <h1>Blog</h1>
          <p>Thoughts on backend engineering, Django, Python, and building software in Africa.</p>
        </div>

        {/* Search + Tags */}
        <div className="blog-page__controls">
          <div className="projects-page__search">
            <i className="bi bi-search" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="projects-page__search-input"
            />
          </div>
          <div className="projects-page__tags" style={{ marginBottom: 0 }}>
            <button
              className={`skills-tab ${!tagFilter ? "skills-tab--active" : ""}`}
              onClick={() => setTagFilter("")}
            >All</button>
            {tags.map((tag) => (
              <button
                key={tag.slug}
                className={`skills-tab ${tagFilter === tag.slug ? "skills-tab--active" : ""}`}
                onClick={() => setTagFilter(tag.slug === tagFilter ? "" : tag.slug)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="blog-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "300px", borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="projects-page__empty">
            <i className="bi bi-journal-x" />
            <h3>No articles found</h3>
            <p>Try a different search or tag.</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && !search && !tagFilter && (
              <Link to={`/blog/${featured.slug}`} className="blog-featured card">
                {featured.cover_image && (
                  <div className="blog-featured__img">
                    <img src={featured.cover_image} alt={featured.title} />
                  </div>
                )}
                <div className="blog-featured__body">
                  <div className="blog-featured__meta">
                    <span className="badge">Latest</span>
                    {featured.tags?.slice(0, 2).map((t) => (
                      <span key={t.slug} className="badge" style={{ color: t.color, borderColor: `${t.color}50` }}>{t.name}</span>
                    ))}
                    <span className="mono blog-card__read-time"><i className="bi bi-clock" /> {featured.read_time} min read</span>
                  </div>
                  <h2 className="blog-featured__title">{featured.title}</h2>
                  <p className="blog-featured__excerpt">{featured.excerpt}</p>
                  <div className="blog-card__footer">
                    <span className="mono blog-card__date">{formatDate(featured.published_at)}</span>
                    <span className="blog-card__more">Read Article <i className="bi bi-arrow-right" /></span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="blog-grid">
              {(search || tagFilter ? posts : rest).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="blog-card card">
      {post.cover_image && (
        <div className="blog-card__img">
          <img src={post.cover_image} alt={post.title} loading="lazy" />
        </div>
      )}
      <div className="blog-card__body">
        <div className="blog-card__tags">
          {post.tags?.slice(0, 2).map((t) => (
            <span key={t.slug} className="badge" style={{ color: t.color, borderColor: `${t.color}50` }}>{t.name}</span>
          ))}
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <div className="blog-card__footer">
          <span className="mono blog-card__date">{formatDate(post.published_at)}</span>
          <span className="mono blog-card__read-time"><i className="bi bi-clock" /> {post.read_time}m</span>
        </div>
      </div>
    </Link>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}