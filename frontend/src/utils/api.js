/**
 * utils/api.js
 * All API helpers for the Django REST portfolio backend.
 * Base URL is read from the Vite env var VITE_API_BASE (falls back to /api/v1).
 */

const BASE = import.meta.env.VITE_API_BASE || "/api/v1";

// ─── Generic fetch wrapper ────────────────────────────────────────────────────

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw Object.assign(new Error(errorBody.detail || `HTTP ${res.status}`), {
      status: res.status,
      body: errorBody,
    });
  }

  return res.json();
}

// ─── Portfolio (single-call, ideal for initial page load) ────────────────────

/**
 * GET /api/v1/portfolio/
 * Returns profile, skills, featured projects, experiences, education,
 * certifications, featured testimonials, services, and stats in one call.
 */
export const getPortfolioSummary = () => request("/portfolio/");

// ─── Profile ─────────────────────────────────────────────────────────────────

/** GET /api/v1/profile/ */
export const getProfile = () => request("/profile/");

// ─── Skills ──────────────────────────────────────────────────────────────────

/** GET /api/v1/skill-categories/?... */
export const getSkillCategories = (params = {}) =>
  request(`/skill-categories/?${new URLSearchParams(params)}`);

/** GET /api/v1/skill-categories/:slug/ */
export const getSkillCategory = (slug) => request(`/skill-categories/${slug}/`);

/** GET /api/v1/skills/?category__slug=...&is_featured=... */
export const getSkills = (params = {}) =>
  request(`/skills/?${new URLSearchParams(params)}`);

/** GET /api/v1/skills/:slug/ */
export const getSkill = (slug) => request(`/skills/${slug}/`);

// ─── Projects ────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/projects/?project_type=&status=&is_featured=&tags__slug=&search=&ordering=
 */
export const getProjects = (params = {}) =>
  request(`/projects/?${new URLSearchParams(params)}`);

/** GET /api/v1/projects/:slug/ (also increments views_count) */
export const getProject = (slug) => request(`/projects/${slug}/`);

/** GET /api/v1/projects/featured/ */
export const getFeaturedProjects = () => request("/projects/featured/");

// ─── Experiences ─────────────────────────────────────────────────────────────

/** GET /api/v1/experiences/?is_current=&is_featured=&employment_type= */
export const getExperiences = (params = {}) =>
  request(`/experiences/?${new URLSearchParams(params)}`);

/** GET /api/v1/experiences/:slug/ */
export const getExperience = (slug) => request(`/experiences/${slug}/`);

// ─── Education ───────────────────────────────────────────────────────────────

/** GET /api/v1/education/ */
export const getEducation = () => request("/education/");

/** GET /api/v1/education/:slug/ */
export const getEducationItem = (slug) => request(`/education/${slug}/`);

// ─── Certifications ──────────────────────────────────────────────────────────

/** GET /api/v1/certifications/?is_featured= */
export const getCertifications = (params = {}) =>
  request(`/certifications/?${new URLSearchParams(params)}`);

/** GET /api/v1/certifications/:slug/ */
export const getCertification = (slug) => request(`/certifications/${slug}/`);

// ─── Testimonials ─────────────────────────────────────────────────────────────

/** GET /api/v1/testimonials/?is_featured=&rating= */
export const getTestimonials = (params = {}) =>
  request(`/testimonials/?${new URLSearchParams(params)}`);

/** GET /api/v1/testimonials/featured/ */
export const getFeaturedTestimonials = () => request("/testimonials/featured/");

// ─── Blog ─────────────────────────────────────────────────────────────────────

/** GET /api/v1/blog/?tags__slug=&status=&search=&ordering= */
export const getBlogPosts = (params = {}) =>
  request(`/blog/?${new URLSearchParams(params)}`);

/** GET /api/v1/blog/:slug/ (also increments views_count) */
export const getBlogPost = (slug) => request(`/blog/${slug}/`);

// ─── Services ────────────────────────────────────────────────────────────────

/** GET /api/v1/services/?is_featured= */
export const getServices = (params = {}) =>
  request(`/services/?${new URLSearchParams(params)}`);

/** GET /api/v1/services/:slug/ */
export const getService = (slug) => request(`/services/${slug}/`);

// ─── Stats ───────────────────────────────────────────────────────────────────

/** GET /api/v1/stats/ */
export const getStats = () => request("/stats/");

// ─── Tags ────────────────────────────────────────────────────────────────────

/** GET /api/v1/tags/ */
export const getTags = () => request("/tags/");

/** GET /api/v1/tags/:slug/ */
export const getTag = (slug) => request(`/tags/${slug}/`);

// ─── Contact ─────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/contact/
 * @param {{ name, email, company?, phone?, subject, message, budget?, service? }} data
 */
export const sendContactMessage = (data) =>
  request("/contact/", {
    method: "POST",
    body: JSON.stringify(data),
  });