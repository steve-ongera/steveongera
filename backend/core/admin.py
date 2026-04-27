from django.contrib import admin
from .models import (
    Profile, SkillCategory, Skill, Tag, Project, ProjectImage,
    Experience, Education, Certification, Testimonial, BlogPost,
    Service, ContactMessage, Stat,
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["full_name", "title", "location", "availability", "is_active"]
    list_filter = ["availability", "is_active", "open_to_remote"]
    prepopulated_fields = {"slug": ("full_name",)}


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1
    prepopulated_fields = {"slug": ("name",)}


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "icon", "order"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [SkillInline]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "proficiency", "years", "is_featured", "order"]
    list_filter = ["category", "proficiency", "is_featured"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "color"]
    prepopulated_fields = {"slug": ("name",)}


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "project_type", "status", "is_featured", "is_published", "views_count", "order"]
    list_filter = ["project_type", "status", "is_featured", "is_published"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["tech_stack", "tags"]
    inlines = [ProjectImageInline]
    readonly_fields = ["views_count"]
    fieldsets = (
        ("Core", {"fields": ("title", "slug", "short_description", "description", "project_type", "status")}),
        ("Media", {"fields": ("thumbnail", "featured_image")}),
        ("Links", {"fields": ("github_url", "live_url", "case_study_url")}),
        ("Relations", {"fields": ("tech_stack", "tags")}),
        ("Timeline", {"fields": ("start_date", "end_date")}),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
        ("Visibility", {"fields": ("is_featured", "is_published", "order", "views_count")}),
    )


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["role", "company", "employment_type", "start_date", "is_current", "is_featured"]
    list_filter = ["employment_type", "is_current", "is_featured", "is_remote"]
    prepopulated_fields = {"slug": ("company", "role")}
    filter_horizontal = ["skills_used"]


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ["degree", "institution", "field_of_study", "start_date", "is_current"]
    prepopulated_fields = {"slug": ("institution", "degree")}


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ["title", "issuing_organization", "issue_date", "is_featured"]
    list_filter = ["issuing_organization", "is_featured"]
    prepopulated_fields = {"slug": ("title", "issuing_organization")}


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["author_name", "author_company", "rating", "is_featured", "is_published", "order"]
    list_filter = ["rating", "is_featured", "is_published"]


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ["title", "status", "published_at", "read_time", "views_count"]
    list_filter = ["status", "tags"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["tags"]
    readonly_fields = ["views_count"]


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title", "price_from", "currency", "delivery_days", "is_featured", "is_available", "order"]
    list_filter = ["is_featured", "is_available"]
    prepopulated_fields = {"slug": ("title",)}


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "status", "created_at"]
    list_filter = ["status", "budget"]
    readonly_fields = ["id", "ip_address", "user_agent", "created_at"]
    search_fields = ["name", "email", "subject", "message"]

    def has_add_permission(self, request):
        return False


@admin.register(Stat)
class StatAdmin(admin.ModelAdmin):
    list_display = ["label", "value", "icon_class", "order"]