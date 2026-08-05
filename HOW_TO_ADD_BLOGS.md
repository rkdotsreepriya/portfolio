# Guide: How to Add Blog Posts

This guide outlines Sreepriya's dynamic, markdown-based writing system, detailing the folder structures, data requirements, and publishing steps for new essays.

---

## 📂 File Structure and Locations

The blog system relies on a split structure combining raw content markdown files and a centralized JSON index:

```
P-W/
├── posts/                      # Directory for raw article content
│   ├── ece-future.md           # Example markdown post
│   ├── ai-schools.md
│   └── learning-communities.md
├── posts.json                  # Centralized index file listing post metadata
├── assets/                     # Media files directory
│   ├── ece_future_cover.png    # Featured image cover
│   └── ...
├── writing.html                # Standalone writing section web interface
└── writing.js                  # Frontend engine loading and rendering blogs
```

---

## ✍️ Creating a New Blog Post

### Step 1: Create the Markdown File
Create a new file in the `posts/` directory. The filename must end with `.md` (e.g., `posts/my-new-essay.md`).

### Step 2: Add Front Matter
Every blog post must begin with a **Front Matter** block enclosed by three hyphens (`---`). This front matter holds key metadata.

Here is the exact structure:
```markdown
---
title: "The Title of Your Blog"
date: "YYYY-MM-DD"
tags: ["Category 1", "Category 2"]
description: "A short 2-3 line summary that acts as the excerpt on the list and card views."
image: "assets/your_cover_image.png"
slug: "my-new-essay"
readTime: "X Min Read"
---
```

> [!IMPORTANT]
> The `slug` value **must** match the filename of the markdown file (excluding `.md`). For example, if the file is `posts/my-new-essay.md`, the slug must be `"my-new-essay"`.

### Step 3: Write the Content
Below the trailing `---` block, write your article using standard Markdown elements.

*   Use `##` for main sections (e.g. `## Section Title`). These headings are automatically captured and linked in the dynamic **Table of Contents** sidebar.
*   Use `###` for subsections.
*   Use `> Quote` for blockquotes.
*   Use `**bold**` or `__bold__` to bold text.

---

## 🎨 Featured Images and Tags

### Adding Featured Images
1. Copy your cover image (PNG, JPG, or WebP) into the `assets/` folder.
2. Reference the path relative to the root in the front matter: `image: "assets/your_image.png"`.
3. High-quality landscape images with a **16:9** or **16:10** aspect ratio look best.

### Tags System
*   Tags are defined as a JSON array inside the front matter: `tags: ["Education", "Technology"]`.
*   **Creation & Reuse**: The system automatically extracts all unique tags from `posts.json` at runtime and generates filter buttons. You do not need to register tags anywhere else; simply naming a tag inside any post registers it. Clicking a tag immediately filters all matching list items.

---

## 🚀 Publishing the Post

To make your new post live on the site, you need to register its metadata in the central index.

1. Open `posts.json` in the root directory.
2. Add your post's metadata object to the top of the array:
```json
[
  {
    "slug": "my-new-essay",
    "title": "The Title of Your Blog",
    "date": "2026-08-05",
    "tags": ["Category 1", "Category 2"],
    "description": "A short 2-3 line summary that acts as the excerpt on the list and card views.",
    "image": "assets/your_cover_image.png",
    "readTime": "7 Min Read"
  },
  ...
]
```

> [!TIP]
> The **latest three posts** are automatically selected for the **Featured Articles** grid cards based on the `date` key. Keep dates formatted as `YYYY-MM-DD` so they sort accurately.

---

## 📄 Article Template
You can copy this template to kickstart future posts:

```markdown
---
title: "Empowering Next-Gen Learners"
date: "2026-08-05"
tags: ["Pedagogy", "Education Innovation"]
description: "An inquiry into scaffolded discovery architectures that support student agency in community learning models."
image: "assets/ece_future_cover.png"
slug: "empowering-next-gen"
readTime: "5 Min Read"
---

## Re-imagining Learning Environments

Enter article text here. Use clean paragraphs to separate your ideas.

## The Role of Educators

*   Point 1
*   Point 2

> "This is a highlighted callout blockquote for key ideas or quotes from the article."

## Designing Community Scales

Enter remaining article details here.
```
