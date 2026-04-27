import React, { useState, useEffect } from "react";
import { fetchProjects, fetchTags } from "../utils/api";
import { ProjectCard } from "../components/sections/Projects";
import "./ProjectsPage.css";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "personal", label: "Personal" },
  { value: "client", label: "Client" },
  { value: "freelance", label: "Freelance" },
  { value: "open_source", label: "Open Source" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "in_progress", label: "In Progress" },
  { value: "maintained", label: "Maintained" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    document.title = "Projects | Steve Ongera";
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {
      search,
      project_type: typeFilter,
      status: statusFilter,
      "tags__slug": tagFilter,
      page,
    };
    fetchProjects(params)
      .then((data) => {
        setProjects(data.results || data);
        setTotalCount(data.count || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, typeFilter, statusFilter, tagFilter, page]);

  useEffect(() => {
    fetchTags().then((data) => setTags(data.results || data)).catch(() => {});
  }, []);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const clearFilters = () => { setSearch(""); setTypeFilter(""); setStatusFilter(""); setTagFilter(""); setPage(1); };

  return (
    <div className="projects-page" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="container">
        {/* Header */}
        <div className="projects-page__header">
          <span className="section-label">Portfolio</span>
          <h1>All Projects</h1>
          <p>A complete collection of work I've built — from side projects to enterprise systems.</p>
        </div>

        {/* Filters */}
        <div className="projects-page__filters">
          {/* Search */}
          <div className="projects-page__search">
            <i className="bi bi-search" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={handleSearch}
              className="projects-page__search-input"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} className="projects-page__clear-btn">
                <i className="bi bi-x" />
              </button>
            )}
          </div>

          {/* Dropdowns */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="projects-page__select"
          >
            {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="projects-page__select"
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {(search || typeFilter || statusFilter || tagFilter) && (
            <button onClick={clearFilters} className="btn btn-ghost">
              <i className="bi bi-x-circle" /> Clear
            </button>
          )}
        </div>

        {/* Tag pills */}
        {tags.length > 0 && (
          <div className="projects-page__tags">
            <button
              className={`skills-tab ${!tagFilter ? "skills-tab--active" : ""}`}
              onClick={() => { setTagFilter(""); setPage(1); }}
            >All</button>
            {tags.map((tag) => (
              <button
                key={tag.slug}
                className={`skills-tab ${tagFilter === tag.slug ? "skills-tab--active" : ""}`}
                onClick={() => { setTagFilter(tag.slug === tagFilter ? "" : tag.slug); setPage(1); }}
                style={tagFilter === tag.slug ? { borderColor: tag.color, color: tag.color } : {}}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {/* Results info */}
        <div className="projects-page__info mono">
          {loading ? "Loading..." : `${projects.length} project${projects.length !== 1 ? "s" : ""} found`}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="projects-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "360px", borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-page__empty">
            <i className="bi bi-inbox" />
            <h3>No projects found</h3>
            <p>Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalCount > 12 && (
          <div className="projects-page__pagination">
            <button
              className="btn btn-outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <i className="bi bi-chevron-left" /> Prev
            </button>
            <span className="mono">Page {page}</span>
            <button
              className="btn btn-outline"
              disabled={projects.length < 12}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <i className="bi bi-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}