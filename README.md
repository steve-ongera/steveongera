# Steve Ongera Portfolio — Full-Stack (Django + React)

A professional, SEO-optimised portfolio website for Steve Ongera, Backend Engineer based in Nairobi, Kenya.  
Built to attract clients and employers **globally** and across **East Africa**.

---

## 🗂 Project Structure

```
steve_portfolio/
├── backend/                   # Django REST API
│   ├── portfolio/             # Main app
│   │   ├── models.py          # 11 models with slugs for SEO
│   │   ├── serializers.py     # DRF serializers (list + detail)
│   │   ├── views.py           # ViewSets + summary endpoint
│   │   ├── urls.py            # App-level URL config
│   │   └── admin.py           # Django admin
│   ├── steve_portfolio/
│   │   ├── settings.py        # Full settings with security, CORS, Redis, email
│   │   └── urls.py            # Root URL config
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                  # React + Vite
    ├── index.html             # Bootstrap Icons, Google Fonts, SEO meta
    └── src/
        ├── main.jsx           # Entry point
        ├── App.jsx            # Router + global context + state
        ├── index.css          # Design tokens (dark theme, accent green)
        ├── utils/api.js       # All API helpers
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx + .css
        │   │   └── Footer.jsx + .css
        │   ├── sections/
        │   │   ├── Hero.jsx + .css
        │   │   ├── Skills.jsx + .css
        │   │   ├── Projects.jsx + .css
        │   │   ├── Experience.jsx + .css
        │   │   ├── Testimonials.jsx + .css
        │   │   └── Services.jsx + .css
        │   └── ui/
        │       ├── ScrollToTop.jsx
        │       ├── LoadingScreen.jsx
        │       └── Toast.jsx
        └── pages/
            ├── Home.jsx
            ├── ProjectsPage.jsx + .css
            ├── ProjectDetail.jsx + .css
            ├── BlogPage.jsx + .css
            ├── BlogDetail.jsx + .css
            ├── ContactPage.jsx + .css
            └── NotFound.jsx
```

---

## 🚀 Quick Start

### Backend (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and email settings

# Create database
createdb steve_portfolio_db  # or via pgAdmin

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start dev server
python manage.py runserver
# API available at: http://localhost:8000/api/v1/
# Admin at: http://localhost:8000/admin/
```

### Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000/api/v1

# Start dev server
npm run dev
# Available at: http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/portfolio/` | **Full portfolio summary** (use this for home page) |
| GET | `/api/v1/profile/` | Active profile |
| GET | `/api/v1/projects/` | All projects (filterable) |
| GET | `/api/v1/projects/{slug}/` | Project detail |
| GET | `/api/v1/projects/featured/` | Featured projects |
| GET | `/api/v1/skill-categories/` | Skills by category |
| GET | `/api/v1/experiences/` | Work experience |
| GET | `/api/v1/education/` | Education |
| GET | `/api/v1/certifications/` | Certifications |
| GET | `/api/v1/testimonials/` | Testimonials |
| GET | `/api/v1/blog/` | Blog posts |
| GET | `/api/v1/blog/{slug}/` | Blog post detail |
| GET | `/api/v1/services/` | Services offered |
| GET | `/api/v1/stats/` | Portfolio stats |
| POST | `/api/v1/contact/` | Submit contact form |

### Query Params (Projects)
- `?search=django` — full-text search
- `?project_type=freelance` — filter by type
- `?status=completed` — filter by status
- `?tags__slug=python` — filter by tag
- `?is_featured=true` — featured only

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#080810` (near-black) |
| Accent | `#00ff88` (electric green) |
| Font Display | Syne (headings) |
| Font Body | Instrument Sans |
| Font Mono | DM Mono |

---

## 🌍 SEO Features

- Slug-based URLs for all models (`/projects/my-project-slug/`)
- `meta_title` + `meta_description` fields on projects and blog posts
- Open Graph + Twitter Card meta in `index.html`
- JSON-LD `Person` schema markup
- Canonical URL support on blog posts
- Sitemap-ready with `django.contrib.sitemaps`

---

## 🔐 Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Change `DJANGO_SECRET_KEY`
- [ ] Configure PostgreSQL credentials
- [ ] Set `ALLOWED_HOSTS` to your domain
- [ ] Configure Gmail SMTP or SendGrid
- [ ] Set `CORS_ALLOWED_ORIGINS` to frontend domain
- [ ] Run `python manage.py collectstatic`
- [ ] Configure Redis for caching
- [ ] Use `gunicorn` for WSGI server
- [ ] Set up Nginx as reverse proxy
- [ ] Enable HTTPS (Let's Encrypt)

---

## 🇰🇪 Built for East Africa, Deployed for the World

- Timezone: **Africa/Nairobi (EAT, UTC+3)**
- Currency defaults: **USD** (globally competitive pricing)
- Remote-work signals built into profile model
- Contact form captures budget ranges aligned with global freelance markets