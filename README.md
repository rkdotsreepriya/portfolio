# Sreepriya Radhakrishnan — Personal Site

A static personal site: landing page, work, blog, and contact. No build step —
plain HTML/CSS/JS, ready for GitHub Pages.

## Structure

```
index.html      Landing page
work.html       Project grid — edit the `projects` array inside the file
blog.html       Blog post list (reads posts/posts.json)
post.html       Renders a single post's Markdown
contact.html    Contact links
style.css       Shared styles (green color system)
script.js       Nav highlighting
blog.js         Loads posts.json and post content
posts/          Markdown posts + posts.json manifest
```

## Before you publish

Search each HTML file for these placeholders and swap in your own info:

- `Sreepriya Radhakrishnan` — your actual name (appears in nav, titles, footer)
- `[your role]`, `[YOUR CITY]` — hero copy on `index.html`
- Project entries in `work.html`
- Email and social links in `contact.html`
- Replace `posts/welcome.md` with a real first post, or keep it as-is

## Adding a new blog post

1. Add a Markdown file to `posts/`, e.g. `posts/my-post.md`.
2. Add an entry to `posts/posts.json`:
   ```json
   {
     "slug": "my-post",
     "title": "My Post Title",
     "date": "2026-08-01",
     "file": "my-post.md",
     "tags": ["notes"]
   }
   ```
3. Commit and push — no build step needed.

## Publishing to GitHub Pages

1. Create a new repository on GitHub (e.g. `your-username.github.io` for a
   root domain site, or any name for a project site).
2. From this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
5. GitHub will give you a URL (usually `https://your-username.github.io/your-repo/`
   or `https://your-username.github.io/` if you used the special repo name).
   It can take a minute or two to go live.

## Running locally

Any static server works, e.g. from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly as a file
may block the `fetch()` calls used to load blog posts — use a local server
instead.)
