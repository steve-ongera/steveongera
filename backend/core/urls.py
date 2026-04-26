from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
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

router = DefaultRouter()
router.register(r"skill-categories", SkillCategoryViewSet, basename="skill-categories")
router.register(r"skills", SkillViewSet, basename="skills")
router.register(r"projects", ProjectViewSet, basename="projects")
router.register(r"experiences", ExperienceViewSet, basename="experiences")
router.register(r"education", EducationViewSet, basename="education")
router.register(r"certifications", CertificationViewSet, basename="certifications")
router.register(r"testimonials", TestimonialViewSet, basename="testimonials")
router.register(r"blog", BlogPostViewSet, basename="blog")
router.register(r"services", ServiceViewSet, basename="services")
router.register(r"stats", StatViewSet, basename="stats")
router.register(r"tags", TagViewSet, basename="tags")

urlpatterns = [
    # Router-generated endpoints
    path("", include(router.urls)),

    # Single-call portfolio summary
    path("portfolio/", PortfolioSummaryView.as_view(), name="portfolio-summary"),

    # Profile (singleton)
    path("profile/", ProfileView.as_view(), name="profile"),

    # Contact form
    path("contact/", ContactMessageCreateView.as_view(), name="contact"),
]