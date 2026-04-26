from django.db import models
from django.utils.text import slugify
from django.utils import timezone
import uuid


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ─────────────────────────────────────────────
# PROFILE
# ─────────────────────────────────────────────
class Profile(TimeStampedModel):
    AVAILABILITY_CHOICES = [
        ("available", "Available for Work"),
        ("busy", "Currently Busy"),
        ("open", "Open to Opportunities"),
    ]

    full_name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=200, help_text="e.g. Senior Backend Engineer")
    tagline = models.CharField(max_length=300, help_text="Short punchy headline")
    bio = models.TextField()
    bio_short = models.CharField(max_length=500, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=150, default="Nairobi, Kenya")
    avatar = models.ImageField(upload_to="profile/avatars/", blank=True, null=True)
    resume = models.FileField(upload_to="profile/resumes/", blank=True, null=True)
    availability = models.CharField(
        max_length=20, choices=AVAILABILITY_CHOICES, default="available"
    )
    years_experience = models.PositiveIntegerField(default=0)
    open_to_remote = models.BooleanField(default=True)
    open_to_relocation = models.BooleanField(default=False)
    meta_description = models.CharField(max_length=160, blank=True, help_text="SEO meta description")
    is_active = models.BooleanField(default=True)

    # Social Links
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)
    upwork_url = models.URLField(blank=True)
    fiverr_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.full_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name


# ─────────────────────────────────────────────
# SKILL
# ─────────────────────────────────────────────
class SkillCategory(TimeStampedModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.CharField(max_length=100, blank=True, help_text="Bootstrap icon class e.g. bi-code-slash")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Skill Categories"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Skill(TimeStampedModel):
    PROFICIENCY_CHOICES = [
        (1, "Beginner"),
        (2, "Elementary"),
        (3, "Intermediate"),
        (4, "Advanced"),
        (5, "Expert"),
    ]

    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    proficiency = models.PositiveSmallIntegerField(choices=PROFICIENCY_CHOICES, default=3)
    years = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    icon_url = models.URLField(blank=True, help_text="URL to skill logo/icon")
    icon_class = models.CharField(max_length=100, blank=True, help_text="Bootstrap icon class")
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.get_proficiency_display()})"


# ─────────────────────────────────────────────
# PROJECT
# ─────────────────────────────────────────────
class Tag(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(unique=True, blank=True)
    color = models.CharField(max_length=7, default="#2563EB", help_text="Hex color code")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(TimeStampedModel):
    STATUS_CHOICES = [
        ("completed", "Completed"),
        ("in_progress", "In Progress"),
        ("maintained", "Maintained"),
        ("archived", "Archived"),
    ]
    TYPE_CHOICES = [
        ("personal", "Personal Project"),
        ("client", "Client Project"),
        ("open_source", "Open Source"),
        ("freelance", "Freelance"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    tech_stack = models.ManyToManyField(Skill, blank=True, related_name="projects")
    tags = models.ManyToManyField(Tag, blank=True, related_name="projects")
    thumbnail = models.ImageField(upload_to="projects/thumbnails/", blank=True, null=True)
    featured_image = models.ImageField(upload_to="projects/featured/", blank=True, null=True)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    case_study_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="completed")
    project_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="personal")
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    # SEO
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    # Stats
    views_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title
        if not self.meta_description:
            self.meta_description = self.short_description[:160]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="projects/gallery/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title} - Image {self.order}"


# ─────────────────────────────────────────────
# EXPERIENCE
# ─────────────────────────────────────────────
class Experience(TimeStampedModel):
    EMPLOYMENT_TYPES = [
        ("full_time", "Full-time"),
        ("part_time", "Part-time"),
        ("contract", "Contract"),
        ("freelance", "Freelance"),
        ("internship", "Internship"),
        ("remote", "Remote"),
    ]

    company = models.CharField(max_length=200)
    company_url = models.URLField(blank=True)
    company_logo = models.ImageField(upload_to="experience/logos/", blank=True, null=True)
    role = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, default="full_time")
    location = models.CharField(max_length=150, blank=True)
    is_remote = models.BooleanField(default=False)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True, help_text="Leave blank if current")
    is_current = models.BooleanField(default=False)
    description = models.TextField()
    achievements = models.JSONField(default=list, blank=True, help_text='List of bullet achievements e.g. ["Built API...", "Led team of 5..."]')
    skills_used = models.ManyToManyField(Skill, blank=True, related_name="experiences")
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-start_date", "order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = f"{self.company}-{self.role}"
            self.slug = slugify(base)
        super().save(*args, **kwargs)

    @property
    def duration(self):
        end = self.end_date or timezone.now().date()
        months = (end.year - self.start_date.year) * 12 + (end.month - self.start_date.month)
        years, months = divmod(months, 12)
        parts = []
        if years:
            parts.append(f"{years}yr{'s' if years > 1 else ''}")
        if months:
            parts.append(f"{months}mo")
        return " ".join(parts) or "< 1mo"

    def __str__(self):
        return f"{self.role} @ {self.company}"


# ─────────────────────────────────────────────
# EDUCATION
# ─────────────────────────────────────────────
class Education(TimeStampedModel):
    institution = models.CharField(max_length=200)
    institution_url = models.URLField(blank=True)
    institution_logo = models.ImageField(upload_to="education/logos/", blank=True, null=True)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    grade = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-start_date", "order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = f"{self.institution}-{self.degree}"
            self.slug = slugify(base)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.degree} — {self.institution}"


# ─────────────────────────────────────────────
# CERTIFICATION
# ─────────────────────────────────────────────
class Certification(TimeStampedModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    issuing_organization = models.CharField(max_length=200)
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    credential_id = models.CharField(max_length=200, blank=True)
    credential_url = models.URLField(blank=True)
    badge_image = models.ImageField(upload_to="certifications/badges/", blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-issue_date", "order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.issuing_organization}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} — {self.issuing_organization}"


# ─────────────────────────────────────────────
# TESTIMONIAL
# ─────────────────────────────────────────────
class Testimonial(TimeStampedModel):
    author_name = models.CharField(max_length=150)
    author_title = models.CharField(max_length=200)
    author_company = models.CharField(max_length=200, blank=True)
    author_avatar = models.ImageField(upload_to="testimonials/avatars/", blank=True, null=True)
    author_linkedin = models.URLField(blank=True)
    relationship = models.CharField(max_length=200, blank=True, help_text="e.g. Managed Steve at Andela")
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5, choices=[(i, i) for i in range(1, 6)])
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="testimonials")
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.author_name} — {self.author_company}"


# ─────────────────────────────────────────────
# BLOG / ARTICLES
# ─────────────────────────────────────────────
class BlogPost(TimeStampedModel):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True, blank=True, max_length=350)
    excerpt = models.CharField(max_length=500)
    content = models.TextField()
    cover_image = models.ImageField(upload_to="blog/covers/", blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="blog_posts")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")
    published_at = models.DateTimeField(blank=True, null=True)
    read_time = models.PositiveIntegerField(default=5, help_text="Estimated read time in minutes")
    views_count = models.PositiveIntegerField(default=0)
    # SEO
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    canonical_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == "published" and not self.published_at:
            self.published_at = timezone.now()
        if not self.meta_title:
            self.meta_title = self.title[:70]
        if not self.meta_description:
            self.meta_description = self.excerpt[:160]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# ─────────────────────────────────────────────
# SERVICE / OFFERING
# ─────────────────────────────────────────────
class Service(TimeStampedModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    icon_class = models.CharField(max_length=100, blank=True, help_text="Bootstrap icon class")
    price_from = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=5, default="USD")
    delivery_days = models.PositiveIntegerField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# ─────────────────────────────────────────────
# CONTACT / ENQUIRY
# ─────────────────────────────────────────────
class ContactMessage(TimeStampedModel):
    STATUS_CHOICES = [
        ("new", "New"),
        ("read", "Read"),
        ("replied", "Replied"),
        ("closed", "Closed"),
    ]
    BUDGET_CHOICES = [
        ("under_500", "Under $500"),
        ("500_2000", "$500 – $2,000"),
        ("2000_5000", "$2,000 – $5,000"),
        ("5000_10000", "$5,000 – $10,000"),
        ("over_10000", "Over $10,000"),
        ("discuss", "Let's Discuss"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    email = models.EmailField()
    company = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    subject = models.CharField(max_length=300)
    message = models.TextField()
    budget = models.CharField(max_length=20, choices=BUDGET_CHOICES, blank=True)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name="enquiries")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="new")
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.subject[:50]}"


# ─────────────────────────────────────────────
# STATS / METRICS
# ─────────────────────────────────────────────
class Stat(TimeStampedModel):
    label = models.CharField(max_length=100, help_text="e.g. Projects Delivered")
    value = models.CharField(max_length=50, help_text="e.g. 40+ or 98%")
    icon_class = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.value} {self.label}"