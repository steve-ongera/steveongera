from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, generics, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Profile, SkillCategory, Skill, Project, Experience, Education,
    Certification, Testimonial, BlogPost, Service, ContactMessage, Stat, Tag,
)
from .serializers import (
    ProfileSerializer, SkillCategorySerializer, SkillSerializer,
    ProjectListSerializer, ProjectDetailSerializer,
    ExperienceSerializer, EducationSerializer, CertificationSerializer,
    TestimonialSerializer, BlogPostListSerializer, BlogPostDetailSerializer,
    ServiceSerializer, ContactMessageSerializer, StatSerializer,
    TagSerializer, PortfolioSummarySerializer,
)


# ─────────────────────────────────────────────
# PROFILE
# ─────────────────────────────────────────────
class ProfileView(generics.RetrieveAPIView):
    """Return the active portfolio owner profile."""
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return get_object_or_404(Profile, is_active=True)


# ─────────────────────────────────────────────
# SKILL
# ─────────────────────────────────────────────
class SkillCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SkillCategory.objects.prefetch_related("skills").order_by("order")
    serializer_class = SkillCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.select_related("category").order_by("order", "name")
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category__slug", "is_featured"]


# ─────────────────────────────────────────────
# PROJECT
# ─────────────────────────────────────────────
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["project_type", "status", "is_featured", "tags__slug"]
    search_fields = ["title", "short_description", "description"]
    ordering_fields = ["order", "created_at", "views_count"]

    def get_queryset(self):
        return (
            Project.objects
            .filter(is_published=True)
            .prefetch_related("tech_stack", "tags", "images")
            .order_by("order", "-created_at")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjectDetailSerializer
        return ProjectListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Project.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)
        serializer = ProjectListSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


# ─────────────────────────────────────────────
# EXPERIENCE
# ─────────────────────────────────────────────
class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Experience.objects
        .prefetch_related("skills_used")
        .order_by("-start_date")
    )
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_current", "is_featured", "employment_type"]


# ─────────────────────────────────────────────
# EDUCATION
# ─────────────────────────────────────────────
class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Education.objects.order_by("-start_date")
    serializer_class = EducationSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


# ─────────────────────────────────────────────
# CERTIFICATION
# ─────────────────────────────────────────────
class CertificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Certification.objects.order_by("-issue_date")
    serializer_class = CertificationSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_featured"]


# ─────────────────────────────────────────────
# TESTIMONIAL
# ─────────────────────────────────────────────
class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_published=True).select_related("project").order_by("order", "-created_at")
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_featured", "rating"]

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# BLOG
# ─────────────────────────────────────────────
class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["tags__slug", "status"]
    search_fields = ["title", "excerpt", "content"]
    ordering_fields = ["published_at", "views_count", "read_time"]

    def get_queryset(self):
        return (
            BlogPost.objects
            .filter(status="published")
            .prefetch_related("tags")
            .order_by("-published_at")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        BlogPost.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# SERVICE
# ─────────────────────────────────────────────
class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_available=True).order_by("order")
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_featured"]


# ─────────────────────────────────────────────
# STAT
# ─────────────────────────────────────────────
class StatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stat.objects.order_by("order")
    serializer_class = StatSerializer
    permission_classes = [AllowAny]


# ─────────────────────────────────────────────
# TAG
# ─────────────────────────────────────────────
class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


# ─────────────────────────────────────────────
# CONTACT
# ─────────────────────────────────────────────
class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        ip = self.request.META.get("REMOTE_ADDR")
        ua = self.request.META.get("HTTP_USER_AGENT", "")
        instance = serializer.save(ip_address=ip, user_agent=ua)

        # Send notification email
        try:
            send_mail(
                subject=f"[Portfolio] New message from {instance.name}",
                message=(
                    f"Name: {instance.name}\n"
                    f"Email: {instance.email}\n"
                    f"Company: {instance.company or 'N/A'}\n"
                    f"Budget: {instance.get_budget_display() if instance.budget else 'N/A'}\n\n"
                    f"Subject: {instance.subject}\n\n"
                    f"Message:\n{instance.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"detail": "Message received! I'll get back to you within 24 hours."},
            status=status.HTTP_201_CREATED,
        )


# ─────────────────────────────────────────────
# PORTFOLIO SUMMARY (single-call endpoint)
# ─────────────────────────────────────────────
class PortfolioSummaryView(APIView):
    """
    Single endpoint returning all portfolio data for initial page load.
    Ideal for SSR or reducing round-trips on first visit.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        profile = get_object_or_404(Profile, is_active=True)
        skills = SkillCategory.objects.prefetch_related("skills").order_by("order")
        featured_projects = (
            Project.objects.filter(is_published=True, is_featured=True)
            .prefetch_related("tech_stack", "tags", "images")
            .order_by("order")[:6]
        )
        experiences = (
            Experience.objects.prefetch_related("skills_used").order_by("-start_date")
        )
        education = Education.objects.order_by("-start_date")
        certifications = Certification.objects.order_by("-issue_date")
        featured_testimonials = (
            Testimonial.objects.filter(is_published=True, is_featured=True)
            .select_related("project").order_by("order")[:6]
        )
        services = Service.objects.filter(is_available=True).order_by("order")
        stats = Stat.objects.order_by("order")

        data = {
            "profile": ProfileSerializer(profile, context={"request": request}).data,
            "skills": SkillCategorySerializer(skills, many=True, context={"request": request}).data,
            "featured_projects": ProjectListSerializer(featured_projects, many=True, context={"request": request}).data,
            "experiences": ExperienceSerializer(experiences, many=True, context={"request": request}).data,
            "education": EducationSerializer(education, many=True, context={"request": request}).data,
            "certifications": CertificationSerializer(certifications, many=True, context={"request": request}).data,
            "featured_testimonials": TestimonialSerializer(featured_testimonials, many=True, context={"request": request}).data,
            "services": ServiceSerializer(services, many=True, context={"request": request}).data,
            "stats": StatSerializer(stats, many=True, context={"request": request}).data,
        }
        return Response(data)