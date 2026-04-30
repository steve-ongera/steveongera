# Steve Ongera Portfolio — React Frontend

A React 18 + Vite frontend for the Django REST portfolio backend.
Matches the original Bootstrap/Boxicons template exactly, with full API integration.

## Project Structure

```
portfolio-react/
├── index.html                  # Entry HTML (SEO meta, vendor CSS/JS links)
├── package.json
├── vite.config.js              # Dev proxy → Django :8000
├── .env.example                # Copy to .env.local
│
├── public/
│   └── assets/                 # ← COPY your entire existing /assets/ folder here
│       ├── css/style.css
│       ├── img/
│       ├── vendor/
│       └── js/
│
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Route switcher
    ├── styles/
    │   └── main.css            # Append to style.css OR link after it
    ├── utils/
    │   └── api.js              # All Django REST API calls
    └── pages/
        └── IndexPage.jsx       # Full portfolio single page
```

## Quick Start

### 1. Copy your static assets

```bash
cp -r /path/to/django/staticfiles/assets  public/assets
```

The `index.html` expects them at `/assets/...`.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API base URL

```bash
cp .env.example .env.local
# Edit VITE_API_BASE if your Django server is on a different port/host
```

### 4. Start Django backend

```bash
cd your-django-project
python manage.py runserver
```

### 5. Start React dev server

```bash
npm run dev
# Visit http://localhost:5173
```

Vite will proxy `/api/*` requests to `http://127.0.0.1:8000`.

## Django Backend Requirements

Add the following to Django `settings.py`:

```python
# Allow requests from Vite dev server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Install django-cors-headers if not already:
# pip install django-cors-headers
INSTALLED_APPS = [..., "corsheaders"]
MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware", ...]

# API lives at /api/v1/
# Your urls.py already includes router.urls under this prefix
```

## Fix the serializers.py bug

In `serializers.py` the `ExperienceSerializer` has a typo in the `fields` list:
```python
# WRONG:
"company of kenya ",
# CORRECT:
"company",
```

## Styles / CSS

For the CSS, do one of:

**Option A** — Append `src/styles/main.css` to the bottom of `public/assets/css/style.css`

**Option B** — Add a second link in `index.html`:
```html
<link rel="stylesheet" href="/assets/css/style.css" />
<link rel="stylesheet" href="/src/styles/main.css" />
```

## Production Build

```bash
npm run build
# Outputs to /dist — serve with Nginx, or Django's WhiteNoise, etc.
```

## API Endpoints Used

| Section        | Endpoint                     |
|---------------|------------------------------|
| Everything    | `GET /api/v1/portfolio/`     |
| Contact form  | `POST /api/v1/contact/`      |

All other endpoints (`/api/v1/projects/`, `/api/v1/blog/`, etc.) are available
in `src/utils/api.js` for future pages.