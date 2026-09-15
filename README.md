# Nōta — Smart Pen for Real Thinking (Full-Stack Next.js & Strapi Project)

This project is a full-stack web application built for **Nōta**, featuring a dynamic landing page, smooth GSAP scroll-driven animations, and a headless CMS backend managed via Strapi.

---

## 🚀 Live Links & URLs

* **Live Frontend URL:** [https://nota-frontend-production.up.railway.app](https://nota-frontend-production.up.railway.app)
* **Strapi Admin Panel URL:** [https://nota-strapi-production.up.railway.app/admin](https://nota-strapi-production.up.railway.app/admin)

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router, React, TypeScript, Tailwind CSS, GSAP / ScrollTrigger)
* **Backend / CMS:** Strapi v5 (Headless CMS)
* **Database:** PostgreSQL (Hosted on Railway)
* **Media Storage:** Cloudinary
* **Deployment Platform:** Railway.app

---

## 🤔 Why We Chose These Frameworks

### 1. Next.js (Frontend)
* **Performance & SEO:** App Router with React Server Components allows optimal initial page loads and great SEO support for product storytelling pages.
* **Animation Capability:** Next.js paired with **GSAP (GreenSock Animation Platform) and ScrollTrigger** provides fluid, frame-accurate, scroll-pinned animations (like the curtain-reveal and hero video scrub) required for a modern high-end product launch site.
* **TypeScript & Tailwind CSS:** Ensures type safety, maintainability, and rapid UI styling.

### 2. Strapi v5 (Backend / Headless CMS)
* **Content Flexibility:** Strapi v5 offers a clean, modular REST/GraphQL API out of the box, allowing non-technical content editors to update product titles, descriptions, media, and features dynamically without touching code.
* **Relational Data Management:** Seamless handling of repeatable components and media assets.

---

## 📦 Content Model

The primary content structure is organized around the **Homepage** and related dynamic components:

* **Homepage (Single Type):**
  * `heroTitle` (Text)
  * `heroVideo` (Media - Video)
  * `heroMobileImage` (Media - Image)
  * `penImage` & `penMobileImage` (Media - Image)
  * `Feature` (Repeatable Component / Dynamic Zone containing `label`, `value`, and `category` such as *"Writing System"*, *"Capture Technology"*, and *"Digital Continuity"*).
* **Media Handling:** All media files (videos, product shots) are automatically offloaded and served via **Cloudinary** integration.

---

## 💻 How to Run Locally

### Prerequisites
* Node.js (v18+ or v20+)
* npm or yarn or pnpm
* PostgreSQL (or use SQLite for quick local testing in Strapi)

### 1. Clone the Repositories
```bash
git clone [https://github.com/sachinthabhagya18/nota-frontend.git](https://github.com/sachinthabhagya18/nota-frontend.git)
git clone [https://github.com/sachinthabhagya18/nota-strapi.git](https://github.com/sachinthabhagya18/nota-strapi.git)


⚖️ Key Trade-offs
Client-Side Heavy Animations vs. Performance:

Trade-off: Relying heavily on GSAP ScrollTrigger and DOM pinning (pin: true) creates a cinematic Apple-like experience, but requires careful device matching (gsap.matchMedia) to prevent performance bottlenecks or layout shifts on lower-end mobile devices.

Headless CMS Fetching vs. Static Generation:

Trade-off: Real-time data fetching from Strapi provides instant CMS updates, which means we balance between client-side fetching/ISR and initial load speed.

🔮 What We'd Improve with More Time
Incremental Static Regeneration (ISR) / Webhooks: Implement Strapi webhook triggers to automatically revalidate Next.js cache whenever a content editor publishes updates in Strapi.

Enhanced Loading & Fallbacks: Add more refined skeleton loaders and progressive image/video placeholders.

Automated E2E Testing: Integrate Playwright or Cypress to test GSAP scroll animations and responsive navigation across viewports.

🤖 AI Tools Used
Google Gemini: Used for debugging complex TypeScript errors, optimizing GSAP matchMedia responsive timelines, and structuring clean API fetch helpers.

Google AI Studio: Used for rapid prototyping of component logic, refining CSS Grid/Flexbox layouts, and writing comprehensive technical documentation.

🌐 Reference Websites with Scrolling Effects
Apple Product Landing Pages (e.g., iPad Pro / MacBook Pro): Used as the primary benchmark for scroll-driven video scrubbing, pinned sequence transitions, and curtain reveal effects.

Teenage Engineering: Referenced for minimalist industrial typography, modular grid specifications, and sharp layout hierarchy.

🔐 Strapi Admin Users (Credentials / Access)
Configured administrator accounts in the Strapi Admin Panel:

kavinda.kobbekaduwe@surge.global

kavisha@surge.global

samith@surge.global

👤 Developer / Author
Developer Name: Edirisinghe Arachchilage Sachintha Bhagya Edirisinghe

GitHub Repositories Shared With / Public: Shared with kavinda.kobbekaduwe@surge.global, kavisha@surge.global, and samith@surge.global (or public repository access).