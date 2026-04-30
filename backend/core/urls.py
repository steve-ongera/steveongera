from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import (
    ProfileView,
    SkillCategoryViewSet,
    SkillViewSet,
    ProjectViewSet,
    ExperienceViewSet,
    EducationViewSet,
    CertificationViewSet,
    TestimonialViewSet,
    BlogPostViewSet,
    ServiceViewSet,
    StatViewSet,
    TagViewSet,
    ContactMessageCreateView,
    PortfolioSummaryView,
)

# ── SimpleRouter: no catch-all API root, so custom paths below are reachable ──
router = SimpleRouter()
router.register(r"skill-categories", SkillCategoryViewSet, basename="skill-categories")
router.register(r"skills",           SkillViewSet,          basename="skills")
router.register(r"projects",         ProjectViewSet,        basename="projects")
router.register(r"experiences",      ExperienceViewSet,     basename="experiences")
router.register(r"education",        EducationViewSet,      basename="education")
router.register(r"certifications",   CertificationViewSet,  basename="certifications")
router.register(r"testimonials",     TestimonialViewSet,    basename="testimonials")
router.register(r"blog",             BlogPostViewSet,       basename="blog")
router.register(r"services",         ServiceViewSet,        basename="services")
router.register(r"stats",            StatViewSet,           basename="stats")
router.register(r"tags",             TagViewSet,            basename="tags")

urlpatterns = [
    # ── IMPORTANT: custom paths BEFORE include(router.urls) ─────────────────
    # /api/v1/portfolio/  →  full portfolio data in one call (home page)
    path("portfolio/", PortfolioSummaryView.as_view(), name="portfolio-summary"),
    # /api/v1/profile/    →  single active profile
    path("profile/",   ProfileView.as_view(),           name="profile"),
    # /api/v1/contact/    →  POST contact form
    path("contact/",   ContactMessageCreateView.as_view(), name="contact"),

    # ── Router-generated endpoints (list + detail for every model) ───────────
    path("", include(router.urls)),
]