// utils/api.js — Centralised API layer for Steve Ongera Portfolio

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// ─────────────────────────────────────────────
// CORE FETCH WRAPPER
// ─────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }
    const error = new Error(errorData.detail || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function buildQuery(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return query ? `?${query}` : "";
}

// ─────────────────────────────────────────────
// PORTFOLIO SUMMARY (single-call for home page)
// ─────────────────────────────────────────────
export async function fetchPortfolioSummary() {
  return request("/portfolio/");
}

// ─────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────
export async function fetchProfile() {
  return request("/profile/");
}

// ─────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────
export async function fetchSkillCategories() {
  return request("/skill-categories/");
}

export async function fetchSkills(params = {}) {
  return request(`/skills/${buildQuery(params)}`);
}

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
export async function fetchProjects(params = {}) {
  return request(`/projects/${buildQuery(params)}`);
}

export async function fetchFeaturedProjects() {
  return request("/projects/featured/");
}

export async function fetchProjectBySlug(slug) {
  return request(`/projects/${slug}/`);
}

// ─────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────
export async function fetchExperiences(params = {}) {
  return request(`/experiences/${buildQuery(params)}`);
}

// ─────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────
export async function fetchEducation() {
  return request("/education/");
}

// ─────────────────────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────────────────────
export async function fetchCertifications(params = {}) {
  return request(`/certifications/${buildQuery(params)}`);
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
export async function fetchTestimonials(params = {}) {
  return request(`/testimonials/${buildQuery(params)}`);
}

export async function fetchFeaturedTestimonials() {
  return request("/testimonials/featured/");
}

// ─────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────
export async function fetchBlogPosts(params = {}) {
  return request(`/blog/${buildQuery(params)}`);
}

export async function fetchBlogPostBySlug(slug) {
  return request(`/blog/${slug}/`);
}

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────
export async function fetchServices(params = {}) {
  return request(`/services/${buildQuery(params)}`);
}

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────
export async function fetchStats() {
  return request("/stats/");
}

// ─────────────────────────────────────────────
// TAGS
// ─────────────────────────────────────────────
export async function fetchTags() {
  return request("/tags/");
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────
export async function sendContactMessage(formData) {
  return request("/contact/", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}