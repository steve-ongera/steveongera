from rest_framework import serializers
from .models import (
    Profile, SkillCategory, Skill, Tag, Project, ProjectImage,
    Experience, Education, Certification, Testimonial, BlogPost,
    Service, ContactMessage, Stat,
)


# ─────────────────────────────────────────────
# TAG
# ─────────────────────────────────────────────
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug", "color"]


# ─────────────────────────────────────────────
# SKILL
# ─────────────────────────────────────────────
class SkillSerializer(serializers.ModelSerializer):
    proficiency_label = serializers.CharField(source="get_proficiency_display", read_only=True)

    class Meta:
        model = Skill
        fields = [
            "id", "name", "slug", "proficiency", "proficiency_label",
            "years", "icon_url", "icon_class", "is_featured", "order",
        ]


class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = SkillCategory
        fields = ["id", "name", "slug", "icon", "order", "skills"]


class SkillCategoryListSerializer(serializers.ModelSerializer):
    """Lightweight version without nested skills."""
    class Meta:
        model = SkillCategory
        fields = ["id", "name", "slug", "icon", "order"]


# ─────────────────────────────────────────────
# PROJECT
# ─────────────────────────────────────────────
class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "caption", "order"]


class ProjectListSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tech_stack = SkillSerializer(many=True, read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)
    type_label = serializers.CharField(source="get_project_type_display", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "short_description", "thumbnail",
            "tags", "tech_stack", "status", "status_label", "project_type",
            "type_label", "is_featured", "live_url", "github_url",
            "start_date", "end_date", "order",
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tech_stack = SkillSerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)
    type_label = serializers.CharField(source="get_project_type_display", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "short_description", "description",
            "tech_stack", "tags", "thumbnail", "featured_image", "images",
            "github_url", "live_url", "case_study_url",
            "status", "status_label", "project_type", "type_label",
            "is_featured", "start_date", "end_date",
            "meta_title", "meta_description", "views_count",
        ]


# ─────────────────────────────────────────────
# EXPERIENCE
# ─────────────────────────────────────────────
class ExperienceSerializer(serializers.ModelSerializer):
    skills_used = SkillSerializer(many=True, read_only=True)
    employment_type_label = serializers.CharField(source="get_employment_type_display", read_only=True)
    duration = serializers.ReadOnlyField()

    class Meta:
        model = Experience
        fields = [
            "id", "company of kenya ", "company_url", "company_logo", "role", "slug",
            "employment_type", "employment_type_label", "location", "is_remote",
            "start_date", "end_date", "is_current", "description",
            "achievements", "skills_used", "is_featured", "duration", "order",
        ]


# ─────────────────────────────────────────────
# EDUCATION
# ─────────────────────────────────────────────
class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            "id", "institution", "institution_url", "institution_logo",
            "degree", "field_of_study", "slug", "start_date", "end_date",
            "is_current", "grade", "description", "order",
        ]


# ─────────────────────────────────────────────
# CERTIFICATION
# ─────────────────────────────────────────────
class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = [
            "id", "title", "slug", "issuing_organization",
            "issue_date", "expiry_date", "credential_id",
            "credential_url", "badge_image", "is_featured", "order",
        ]


# ─────────────────────────────────────────────
# TESTIMONIAL
# ─────────────────────────────────────────────
class TestimonialSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="project.title", read_only=True, default=None)

    class Meta:
        model = Testimonial
        fields = [
            "id", "author_name", "author_title", "author_company",
            "author_avatar", "author_linkedin", "relationship",
            "content", "rating", "project_title", "is_featured", "order",
        ]


# ─────────────────────────────────────────────
# BLOG
# ─────────────────────────────────────────────
class BlogPostListSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "excerpt", "cover_image",
            "tags", "status", "status_label", "published_at",
            "read_time", "views_count",
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "excerpt", "content", "cover_image",
            "tags", "status", "published_at", "read_time", "views_count",
            "meta_title", "meta_description", "canonical_url",
        ]


# ─────────────────────────────────────────────
# PROFILE
# ─────────────────────────────────────────────
class ProfileSerializer(serializers.ModelSerializer):
    availability_label = serializers.CharField(source="get_availability_display", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id", "full_name", "slug", "title", "tagline", "bio",
            "bio_short", "email", "phone", "location", "avatar",
            "resume", "availability", "availability_label",
            "years_experience", "open_to_remote", "open_to_relocation",
            "github_url", "linkedin_url", "twitter_url",
            "website_url", "upwork_url", "fiverr_url",
            "meta_description",
        ]


# ─────────────────────────────────────────────
# SERVICE
# ─────────────────────────────────────────────
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id", "title", "slug", "short_description", "description",
            "icon_class", "price_from", "currency", "delivery_days",
            "is_featured", "is_available", "order",
        ]


# ─────────────────────────────────────────────
# STAT
# ─────────────────────────────────────────────
class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = ["id", "label", "value", "icon_class", "description", "order"]


# ─────────────────────────────────────────────
# CONTACT MESSAGE
# ─────────────────────────────────────────────
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id", "name", "email", "company", "phone",
            "subject", "message", "budget", "service",
        ]
        read_only_fields = ["id"]

    def validate_message(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError("Message must be at least 20 characters.")
        return value


# ─────────────────────────────────────────────
# FULL PORTFOLIO (single endpoint for SSR/SEO)
# ─────────────────────────────────────────────
class PortfolioSummarySerializer(serializers.Serializer):
    profile = ProfileSerializer()
    skills = SkillCategorySerializer(many=True)
    featured_projects = ProjectListSerializer(many=True)
    experiences = ExperienceSerializer(many=True)
    education = EducationSerializer(many=True)
    certifications = CertificationSerializer(many=True)
    featured_testimonials = TestimonialSerializer(many=True)
    services = ServiceSerializer(many=True)
    stats = StatSerializer(many=True)