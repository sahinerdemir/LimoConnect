# LimoConnect — Luxury Chauffeur & Transportation Services

A modern, high-performance, and responsive web experience for **LimoConnect**, a premier luxury chauffeur and transportation service provider.

## 🚀 Live Demo
- **URL**: [https://limoconnect.vercel.app](https://limoconnect.vercel.app) *(or generated deployment URL)*

## 🌟 Features
- **Semantic HTML5 & Modern CSS3**: 12-column responsive layout (`.grid-12`, max 1320px) adhering to pixel-perfect design specifications.
- **Hero Background Video**: Full-screen cinematic video with optimized overlay and accessible fallbacks.
- **Interactive Carousels**:
  - Full-bleed **Services Carousel** with dynamic progress bar and item counter.
  - Full-bleed **Client Testimonials Carousel** with business headshots and quotes.
- **Fleet Showcase**: High-resolution imagery of luxury fleet vehicles (Mercedes S-Class, Cadillac Escalade, Sprinter Executive).
- **Enterprise Corporate Solutions**: Dedicated B2B section highlighting centralized billing, account management, and discrete logistics.
- **Accordion FAQ**: Accessible interactive accordion with animated grid transitions.
- **Smooth Navigation & Scroll Reveal**: Smooth scrolling with header offset compensation and floating "Back to top" button.
- **SEO & Performance**:
  - Comprehensive Open Graph / Twitter Card meta tags.
  - Schema.org structured data (`ChauffeurService` / `FAQPage` JSON-LD).
  - Explicit image dimensions to avoid Cumulative Layout Shift (CLS).

## 🛠️ Project Structure
```
LimoConnect/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   ├── js/
│   │   └── main.js
│   └── videos/
│       └── hero_bg.mp4
├── index.html
├── favicon.ico
└── README.md
```

## 💻 Local Development
Simply open `index.html` in your browser or run a lightweight local server:
```bash
# Using Python
python3 -m http.server 8000

# Using npx serve
npx serve .
```

## 📦 Deployment
Configured for automated deployments on [Vercel](https://vercel.com).
