# Mirdita Lab Website

## Table of contents

- [Adding yourself to the lab website](#adding-yourself-to-the-lab-website)
- [Rebuilding the site](#rebuilding-the-site)

---

## Adding yourself to the lab website

### 1. Create your profile directories

```
team/en/<yourname>/
team/ko/<yourname>/
```

Use a lowercase, no-spaces version of your name (e.g., `janekim`).

### 2. Add your profile files

Create `profile.md` in **both** directories using TOML front matter:

```toml
+++
name = "Your Full Name"
role = "Your Position"
alumni = false
organizations = [ { name = "SKKU School of Medicine", url = "https://www.skkumed.ac.kr" } ]
bio = ""
email = "you@example.com"

[[education.courses]]
  course = "Ph.D. in ..."
  institution = "University Name"
  year = 2024

[[social]]
  icon = "envelope"
  icon_pack = "fas"
  link = "mailto:you@example.com"

[[social]]
  icon = "github"
  icon_pack = "fab"
  link = "https://github.com/yourusername"

[[social]]
  icon = "graduation-cap"
  icon_pack = "fas"
  link = "https://scholar.google.com/citations?user=..."
  alt = "Google Scholar"
+++
```

**Icon packs:** `fas` (Font Awesome Solid), `fab` (Font Awesome Brands), `ai` (Academicons — for `orcid`, `cv`, etc.)

In `team/ko/<yourname>/profile.md`, translate the `role` and `organizations.name` fields into Korean. Everything else can stay the same.

### 3. Add your photo

Place `avatar.jpg` (or `.png` / `.jpeg`) in both language directories. It will be auto-cropped to **336×336 px** — a square image works best.

### 4. Open a pull request

Commit your changes and open a pull request on GitHub. The PI will review and merge it.

---

## Rebuilding the site

- Edit `index.template.html` (keep the `team:grid` and `team:details` markers in the Team section).
- Update language strings in `i18n/en.yaml` and `i18n/ko.yaml`.
- Add or update team members under `team/en/<member>/` and `team/ko/<member>/` with a `profile.md` (front matter + HTML body). Avatars can live next to either language and are built into `static/team/`.
- Generate the rendered pages (requires ImageMagick to optimize avatars into `static/team/`):

```bash
node scripts/build-team.mjs
```

This writes `index.en.html` and `index.ko.html` from `index.template.html`.
