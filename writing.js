/* ==========================================================================
   WRITING PAGE INTERACTION & RENDER LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let allPosts = [];
  let selectedTag = 'All';
  let searchQuery = '';

  const featuredGrid = document.getElementById('featuredGrid');
  const blogsList = document.getElementById('blogsList');
  const tagPillsContainer = document.getElementById('tagPills');
  const searchInput = document.getElementById('searchInput');
  const resultsTitle = document.getElementById('resultsTitle');

  // Overlay Modal elements
  const overlayModal = document.getElementById('overlayModal');
  const overlayInner = document.getElementById('overlayInner');
  const closeOverlayBtn = document.getElementById('closeOverlayBtn');

  // Load Posts from index file
  fetch('posts.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch posts.json');
      }
      return response.json();
    })
    .then(data => {
      allPosts = data;

      // Render components
      renderFeatured(allPosts);
      renderTags(allPosts);
      renderList(allPosts);

      // Check if direct URL links to a post
      checkUrlParams();
    })
    .catch(error => {
      console.error('Error loading blog posts:', error);
      featuredGrid.innerHTML = `<div style="text-align: center; color: var(--accent); padding: 3rem 0; width: 100%;">Failed to load blog posts. Please ensure you are running a server.</div>`;
    });

  // Render top 3 featured blogs
  function renderFeatured(posts) {
    // Sort posts by date descending
    const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestThree = sorted.slice(0, 3);

    featuredGrid.innerHTML = latestThree.map(post => `
      <div class="featured-card glow-card" data-slug="${post.slug}">
        <div class="featured-card-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="featured-card-content">
          <div class="featured-card-meta">
            <span>${post.tags[0] || 'Reflections'}</span>
            <span class="featured-card-date">• ${formatDate(post.date)}</span>
          </div>
          <h3 class="featured-card-title">${post.title}</h3>
          <p class="featured-card-excerpt">${post.description}</p>
          <button class="featured-card-cta">
            Read More
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    // Add click event listeners
    featuredGrid.querySelectorAll('.featured-card').forEach(card => {
      card.addEventListener('click', () => {
        openArticle(card.getAttribute('data-slug'));
      });
    });
  }

  // Extract and render unique tag pills
  function renderTags(posts) {
    const tags = new Set(['All']);
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });

    tagPillsContainer.innerHTML = Array.from(tags).map(tag => `
      <button class="tag-pill ${tag === selectedTag ? 'active' : ''}" data-tag="${tag}">
        ${tag}
      </button>
    `).join('');

    // Add click listeners to tag pills
    tagPillsContainer.querySelectorAll('.tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        selectedTag = pill.getAttribute('data-tag');

        // Update active class
        tagPillsContainer.querySelectorAll('.tag-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        filterAndRenderList();
      });
    });
  }

  // Render list view of articles
  function renderList(posts) {
    if (posts.length === 0) {
      blogsList.innerHTML = `<div style="padding: 3rem 0; color: var(--text-secondary); font-style: italic;">No articles found matching the current criteria.</div>`;
      return;
    }

    blogsList.innerHTML = posts.map(post => `
      <div class="blog-list-item" data-slug="${post.slug}">
        <div class="blog-list-item-meta">
          <span>${post.readTime}</span>
          <span>• ${formatDate(post.date)}</span>
        </div>
        <h3 class="blog-list-item-title">${post.title}</h3>
        <p class="blog-list-item-excerpt">${post.description}</p>
        <div class="blog-list-item-tags">
          ${post.tags.map(t => `<span class="blog-list-item-tag" data-tag="${t}">${t}</span>`).join('')}
        </div>
        <button class="blog-list-item-cta">
          Read Article
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    `).join('');

    // Add click listeners to item clicks
    blogsList.querySelectorAll('.blog-list-item').forEach(item => {
      const slug = item.getAttribute('data-slug');

      // Click title or CTA opens article
      item.querySelector('.blog-list-item-title').addEventListener('click', (e) => {
        e.stopPropagation();
        openArticle(slug);
      });

      item.querySelector('.blog-list-item-cta').addEventListener('click', (e) => {
        e.stopPropagation();
        openArticle(slug);
      });

      // Click tag pill inside article list triggers filter
      item.querySelectorAll('.blog-list-item-tag').forEach(tagSpan => {
        tagSpan.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetTag = tagSpan.getAttribute('data-tag');
          selectedTag = targetTag;

          // Sync with tag pills
          tagPillsContainer.querySelectorAll('.tag-pill').forEach(p => {
            if (p.getAttribute('data-tag') === targetTag) {
              p.classList.add('active');
            } else {
              p.classList.remove('active');
            }
          });

          filterAndRenderList();
        });
      });
    });
  }

  // Filter list view based on search input and tag pill selection
  function filterAndRenderList() {
    const filtered = allPosts.filter(post => {
      const matchesTag = selectedTag === 'All' || (post.tags && post.tags.includes(selectedTag));
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery) ||
        post.description.toLowerCase().includes(searchQuery) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery)));

      return matchesTag && matchesSearch;
    });

    // Update Section Title
    if (searchQuery) {
      resultsTitle.textContent = `Search results for "${searchQuery}"`;
    } else if (selectedTag !== 'All') {
      resultsTitle.textContent = `Articles Tagged "${selectedTag}"`;
    } else {
      resultsTitle.textContent = "All Articles";
    }

    renderList(filtered);
  }

  // Search input typing listener
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterAndRenderList();
  });

  // Open an article in full view overlay modal
  function openArticle(slug) {
    const postMeta = allPosts.find(p => p.slug === slug);
    if (!postMeta) return;

    // Set Loading State
    overlayInner.innerHTML = `<div style="text-align: center; padding: 10rem 0; color: var(--text-secondary);">Loading article content...</div>`;
    overlayModal.classList.add('active');
    document.body.classList.add('modal-open');

    // Fetch Full Post Content Markdown File
    fetch(`posts/${encodeURIComponent(slug)}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load article content file: ${slug}.md`);
        }
        return response.text();
      })
      .then(mdText => {
        const { metadata, content } = parseFrontMatter(mdText);
        const parsedHtml = parseMarkdown(content);

        renderArticleModalContent(postMeta, parsedHtml);

        // Setup TOC Scroll spy observer
        setupTOC();

        // SEO Updates
        history.pushState({ slug }, '', `?post=${slug}`);
        updateMetaTags(postMeta);
        injectSchema(postMeta);
      })
      .catch(error => {
        console.error(error);
        overlayInner.innerHTML = `
          <div style="text-align: center; padding: 6rem 2rem; color: var(--text-primary);">
            <h2 class="serif-title" style="margin-bottom: 1.5rem;">Unable to display article</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">There was an issue fetching the full markdown source file for this essay.</p>
            <button class="btn btn-secondary" onclick="document.getElementById('closeOverlayBtn').click()">Go Back</button>
          </div>
        `;
      });
  }

  // Render article structure in Overlay
  function renderArticleModalContent(post, bodyHtml) {
    overlayInner.innerHTML = `
      <div style="max-width: 1000px; margin: 0 auto; padding-bottom: 2rem;">
        <span class="overlay-pretitle">${post.readTime} • ${formatDate(post.date)}</span>
        <h1 class="overlay-title" style="margin-bottom: 1.5rem; line-height: 1.15; font-size: clamp(2rem, 5vw, 3.5rem);">${post.title}</h1>
        
        <div class="project-tags" style="margin-bottom: 3rem;">
          ${post.tags.map(t => `<span class="project-tag">${t}</span>`).join(' ')}
        </div>
      </div>

      <div class="overlay-hero-image" style="max-width: 1000px; margin: 0 auto 3rem auto; aspect-ratio: 21/9; overflow: hidden; border-radius: 12px; border: 1px solid var(--border);">
        <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <div class="article-modal-layout">
        <!-- Left Sidebar: TOC -->
        <aside class="toc-sidebar">
          <h4 class="toc-title">Table of Contents</h4>
          <ul class="toc-list" id="tocList">
            <!-- Populated dynamically -->
          </ul>
        </aside>

        <!-- Right Content Body -->
        <article class="article-body-content" id="articleBody">
          ${bodyHtml}
        </article>
      </div>
    `;
  }

  // Setup dynamic Table of Contents scrollspy
  function setupTOC() {
    const articleBody = document.getElementById('articleBody');
    const tocList = document.getElementById('tocList');
    if (!articleBody || !tocList) return;

    const headings = Array.from(articleBody.querySelectorAll('h2, h3'));
    const layout = document.querySelector('.article-modal-layout');
    const tocSidebar = document.querySelector('.toc-sidebar');

    if (headings.length === 0) {
      if (tocSidebar) tocSidebar.style.display = 'none';
      if (layout) layout.classList.add('no-toc');
      return;
    } else {
      if (tocSidebar) tocSidebar.style.display = 'block';
      if (layout) layout.classList.remove('no-toc');
    }

    // Render TOC links
    tocList.innerHTML = headings.map(h => {
      const isSub = h.tagName.toLowerCase() === 'h3';
      return `
        <li class="toc-item" data-target="${h.id}" style="${isSub ? 'padding-left: 1rem; margin-top: 0.3rem;' : 'margin-top: 0.6rem;'}">
          <a href="#${h.id}">${h.textContent}</a>
        </li>
      `;
    }).join('');

    // Smooth scroll on click
    tocList.querySelectorAll('.toc-item a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 120;

          // Scroll modal overlay container
          const scrollContainer = document.querySelector('.overlay-modal');
          if (scrollContainer) {
            scrollContainer.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Setup intersection observer for scroll spy highlights
    const observerOptions = {
      root: document.querySelector('.overlay-modal'),
      rootMargin: '-10% 0px -75% 0px',
      threshold: 0
    };

    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;

          tocList.querySelectorAll('.toc-item').forEach(item => {
            if (item.getAttribute('data-target') === activeId) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    headings.forEach(h => tocObserver.observe(h));
  }

  // Front Matter Markdown parser
  function parseFrontMatter(mdText) {
    const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = mdText.match(frontMatterRegex);
    if (!match) {
      return { metadata: {}, content: mdText };
    }

    const yamlBlock = match[1];
    const content = match[2];
    const metadata = {};

    yamlBlock.split(/\r?\n/).forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.slice(0, colonIndex).trim();
        let val = line.slice(colonIndex + 1).trim();
        // Remove surrounding quotes if any
        val = val.replace(/^["']|["']$/g, '');

        if (val.startsWith('[') && val.endsWith(']')) {
          try {
            metadata[key] = JSON.parse(val);
          } catch (e) {
            metadata[key] = val;
          }
        } else {
          metadata[key] = val;
        }
      }
    });

    return { metadata, content };
  }

  // Custom minimalist markdown rendering helper
  function parseMarkdown(mdText) {
    const lines = mdText.split(/\r?\n/);
    let html = '';
    let inList = false;
    let listType = ''; // 'ul' or 'ol'
    let inBlockquote = false;
    let blockquoteText = '';
    let inParagraph = false;

    const closeParagraph = () => {
      if (inParagraph) {
        html += '</p>\n';
        inParagraph = false;
      }
    };

    const closeBlockquote = () => {
      if (inBlockquote) {
        html += `<blockquote>${parseInlineMarkdown(blockquoteText.trim())}</blockquote>\n`;
        inBlockquote = false;
        blockquoteText = '';
      }
    };

    const closeList = () => {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = '';
      }
    };

    const parseInlineMarkdown = (text) => {
      return text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        // Inline Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 1.5rem 0;">')
        // Inline Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Email formatting in text (e.g. connect\[at]sreepriya\[dot]xyz)
        .replace(/connect\\\[at\\\]sreepriya\\\[dot\\\]xyz/g, 'connect@sreepriya.xyz');
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Empty line
      if (trimmed === '') {
        closeParagraph();
        closeBlockquote();
        closeList();
        continue;
      }

      // Handle HTML figures/markup directly if they are written in markdown
      if (trimmed.startsWith('<figure') || trimmed.startsWith('<img') || trimmed.startsWith('<figcaption') || trimmed.startsWith('</figure>') || trimmed.startsWith('<br>')) {
        closeParagraph();
        closeBlockquote();
        closeList();
        html += line + '\n';
        continue;
      }

      // Headings
      // H1 (# Title)
      if (trimmed.startsWith('# ')) {
        closeParagraph();
        closeBlockquote();
        closeList();
        const content = trimmed.substring(2).trim();
        const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        html += `<h1 id="${id}">${parseInlineMarkdown(content)}</h1>\n`;
        continue;
      }

      // H2 (## Title)
      if (trimmed.startsWith('## ')) {
        closeParagraph();
        closeBlockquote();
        closeList();
        const content = trimmed.substring(3).trim();
        const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        html += `<h2 id="${id}">${parseInlineMarkdown(content)}</h2>\n`;
        continue;
      }

      // H3 (### Title)
      if (trimmed.startsWith('### ')) {
        closeParagraph();
        closeBlockquote();
        closeList();
        const content = trimmed.substring(4).trim();
        const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        html += `<h3 id="${id}">${parseInlineMarkdown(content)}</h3>\n`;
        continue;
      }

      // H4 (#### Title)
      if (trimmed.startsWith('#### ')) {
        closeParagraph();
        closeBlockquote();
        closeList();
        const content = trimmed.substring(5).trim();
        const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        html += `<h4 id="${id}">${parseInlineMarkdown(content)}</h4>\n`;
        continue;
      }

      // Blockquotes (> Quote)
      if (trimmed.startsWith('> ')) {
        closeParagraph();
        closeList();
        inBlockquote = true;
        blockquoteText += trimmed.substring(2) + ' ';
        continue;
      }

      // Unordered Lists (* item, - item)
      const ulMatch = trimmed.match(/^[*+-]\s+(.*)/);
      if (ulMatch) {
        closeParagraph();
        closeBlockquote();
        if (!inList || listType !== 'ul') {
          closeList();
          html += '<ul>\n';
          inList = true;
          listType = 'ul';
        }
        html += `<li>${parseInlineMarkdown(ulMatch[1])}</li>\n`;
        continue;
      }

      // Ordered Lists (1. item, 2. item)
      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (olMatch) {
        closeParagraph();
        closeBlockquote();
        if (!inList || listType !== 'ol') {
          closeList();
          html += '<ol>\n';
          inList = true;
          listType = 'ol';
        }
        html += `<li>${parseInlineMarkdown(olMatch[2])}</li>\n`;
        continue;
      }

      // Paragraph / continuation of paragraph
      if (!inBlockquote) {
        if (!inParagraph) {
          html += '<p>';
          inParagraph = true;
        } else {
          html += ' ';
        }
        html += parseInlineMarkdown(trimmed);
      } else {
        blockquoteText += trimmed + ' ';
      }
    }

    closeParagraph();
    closeBlockquote();
    closeList();
    return html;
  }

  // Format date nicely (e.g., 2026-07-15 -> July 15, 2026)
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr; // fallback to string if invalid
      return dateObj.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  }

  // Handle URL Query Params
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    if (postSlug) {
      openArticle(postSlug);
    }
  }

  // Close modal logic
  function closeModal() {
    overlayModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    overlayInner.innerHTML = '';

    // SEO URL reset
    history.pushState(null, '', 'writing');
    resetMetaTags();
  }

  closeOverlayBtn.addEventListener('click', closeModal);

  // Close modal when hitting ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlayModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle history navigation back/forward (Popstate)
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.slug) {
      openArticle(e.state.slug);
    } else {
      // Close modal if there's no slug in history state
      overlayModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      overlayInner.innerHTML = '';
      resetMetaTags();
    }
  });

  // Dynamic schema builder
  function injectSchema(post) {
    const existingSchema = document.getElementById('dynamic-schema');
    if (existingSchema) existingSchema.remove();

    const script = document.createElement('script');
    script.id = 'dynamic-schema';
    script.type = 'application/ld+json';

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": [post.image],
      "datePublished": post.date,
      "author": [{
        "@type": "Person",
        "name": "Sreepriya Radhakrishnan",
        "url": "https://beyondborn.in"
      }],
      "description": post.description
    };

    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  // Meta Tags updates for SEO/Social Previews
  function updateMetaTags(post) {
    document.title = `${post.title} | Sreepriya Radhakrishnan`;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', post.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', post.description);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', post.image);

    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', post.title);

    const twDesc = document.querySelector('meta[property="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', post.description);

    const twImg = document.querySelector('meta[property="twitter:image"]');
    if (twImg) twImg.setAttribute('content', post.image);
  }

  function resetMetaTags() {
    document.title = "Writing & Reflections | Sreepriya Radhakrishnan";

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', "Writing & Reflections | Sreepriya Radhakrishnan");

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', "Read Sreepriya Radhakrishnan's essays, articles, and frameworks.");

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', "assets/ece_future_cover.png");

    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', "Writing & Reflections | Sreepriya Radhakrishnan");

    const twDesc = document.querySelector('meta[property="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', "Read Sreepriya Radhakrishnan's essays, articles, and frameworks.");

    const twImg = document.querySelector('meta[property="twitter:image"]');
    if (twImg) twImg.setAttribute('content', "assets/ece_future_cover.png");

    const existingSchema = document.getElementById('dynamic-schema');
    if (existingSchema) existingSchema.remove();
  }
});
