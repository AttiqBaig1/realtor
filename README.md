# Realtor Demo Engine

Live: **https://attiqbaig1.github.io/realtor/**

A luxury real estate website that personalises itself from the link, plus agency tools for generating and publishing realtor pages.

## Agency tools (password protected)

Open `https://attiqbaig1.github.io/realtor/?agency=true` → **SEO Generator & Bulk CSV** → enter the admin password.

- **Publish to WordPress** — connect a WordPress site once (URL, username, Application Password), then publish a full realtor landing page for the single realtor or every realtor from the CSV. Each page gets a "keyword in City" H1, services, property types, process, reviews, FAQ with schema, call / WhatsApp / email buttons and a Google Map. Live URLs can be copied or exported as CSV. Pages can also be previewed and downloaded as `.html`.
- **Bulk CSV** — upload realtors (Name, Agent Name, Address, City, Phone, Email, WhatsApp, SEO Keyword, Sales Volume) and get a personalised demo link and short link for each.
- **Single demo generator**, **city presets** and **SEO audit**.

Short links are created with TinyURL or is.gd; if neither service answers, the full link is shown (no made-up short links).

## Admin password

Only a SHA-256 hash is stored, in `src/config/security.ts`. To change it, replace the hash:

```
node -e "console.log(require('crypto').createHash('sha256').update('NEW-PASSWORD').digest('hex'))"
```

This is a static site: the password keeps visitors out of the admin console and agency tools, but all data (listings, leads, WordPress credentials) lives in the browser that entered it.

## Develop

```
npm install
npm run dev
```

Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).
