# Camille Abarientos | Business Data & Systems

A lightweight, responsive portfolio site for an IT graduate focused on business data analytics, business systems, workflow automation, and process improvement. Featured case study summaries are based on the supplied source documents. The alumni dashboard is described as a sample-data demonstration; no private records or employer-specific sensitive information are included. The site uses plain HTML, CSS, and JavaScript and is compatible with GitHub Pages.

## Preview locally

Open `index.html` directly in a browser, or start a simple local server from this directory:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000). If Python is not installed, opening `index.html` directly is sufficient for this static site.

## Customize

- Edit `index.html` to update case study descriptions or add approved public examples.
- Update `assets/css/styles.css` to adjust colors, typography, spacing, and responsive behavior.
- Update `assets/js/main.js` for the mobile navigation or other small interactions.

Keep the resume PDF named `Camille-Abarientos-Resume.pdf` in the project root, alongside `index.html`. The Resume & Contact section links to this relative path, so preserve the filename and location when updating the PDF for GitHub Pages. The site links to LinkedIn but does not display a phone number or email address. Case study figures retain the context reported by their source documents; no additional dates, reporting periods, or outcomes are inferred. Typography uses system fonts, so no external font service is required.

## GitHub Pages

The site is static and has no build step. Keep `index.html` at the published source root. The `.nojekyll` file disables GitHub Pages' Jekyll processing for this site.
