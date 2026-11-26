# SSG exercise

Two pages from my portfolio, Home and About, rebuilt with Astro, where both pages share one footer component.

## Commands

Run these from this folder (`ssg-exercise/`).

| Step | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Build the site into `dist/` | `npm run build` |
| Preview the built site locally | `npm run preview` |

After `npm run preview`, open both pages:

- Home: <http://localhost:4321/>
- About: <http://localhost:4321/about.html>

(`npm run dev` also works for live editing.)

## How the shared section works

```
src/
├── components/Footer.astro   ← the shared footer, written once
├── layouts/BaseLayout.astro  ← <head>, nav, <slot/> for page content, <Footer />
└── pages/
    ├── index.astro           → dist/index.html  (Home)
    └── about.astro           → dist/about.html  (About)
public/                       ← copied as-is: styles.css, theme.js, fact-panel.js, images/
```

Each page wraps its own main content in `BaseLayout`, and the layout renders `Footer`.
