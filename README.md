Lab website

Rebuild the site
- Edit `index.template.html` (keep the `team:grid` and `team:details` markers in the Team section).
- Update language strings in `i18n/en.yaml` and `i18n/ko.yaml`.
- Add or update team members under `team/en/<member>/` and `team/ko/<member>/` with a `profile.md` (front matter + HTML body). Avatars can live next to either language and are built into `static/team/`.
- Generate the rendered pages (requires ImageMagick to optimize avatars into `static/team/`):

```bash
node scripts/build-team.mjs
```

This writes `index.en.html` and `index.ko.html` from `index.template.html`.
