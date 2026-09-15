/* ==========================================================================
   RESOURCE LIBRARY ENGINE - SREEPRIYA RADHAKRISHNAN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let allResources = [];
  let selectedAudience = 'All';
  let selectedCategory = 'All';
  let selectedFormat = 'All';
  let searchQuery = '';

  const featuredGrid = document.getElementById('featuredResourcesGrid');
  const mainGrid = document.getElementById('resourcesGrid');
  const audiencePills = document.getElementById('audiencePills');
  const categoryPills = document.getElementById('categoryPills');
  const formatPills = document.getElementById('formatPills');
  const searchInput = document.getElementById('searchInput');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const resourcesCountText = document.getElementById('resourcesCountText');

  // Load Resources Data
  fetch('resources.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch resources.json');
      return response.json();
    })
    .then(data => {
      allResources = data;

      // Populate filter option lists dynamically from data
      initFilters(allResources);

      // Render Initial Collections
      renderFeatured(allResources);
      renderGrid();

      // Check URL search parameters or hashes
      checkUrlParams();
    })
    .catch(err => {
      console.error('Error loading resources catalog:', err);
      if (mainGrid) {
        mainGrid.innerHTML = `
          <div class="resources-empty-state">
            <h3 class="resources-empty-title">Unable to load resources</h3>
            <p class="resources-empty-text">Please ensure you are viewing this page on a web server.</p>
          </div>
        `;
      }
    });

  /* --------------------------------------------------------------------------
     FILTER INITIALIZATION
     -------------------------------------------------------------------------- */
  const AUDIENCE_OPTIONS = [
    'All',
    'Organizations',
    'Educators',
    'Parents'
  ];

  const CATEGORY_OPTIONS = [
    'All',
    'Organizational Psychology',
    'HR & People',
    'Leadership',
    'Teacher Development',
    'Classroom Practice',
    'Early Childhood',
    'Child Development',
    'Parent Resources',
    'Communication',
    'Assessment',
    'Planning',
    'Wellbeing',
    'Professional Development'
  ];

  const FORMAT_OPTIONS = [
    'All',
    'PDF',
    'DOCX',
    'XLSX',
    'PPTX',
    'Checklist',
    'Template',
    'Guide',
    'Worksheet',
    'Toolkit'
  ];

  function initFilters(resources) {
    // Audience Pills
    if (audiencePills) {
      renderPills(audiencePills, AUDIENCE_OPTIONS, selectedAudience, (val) => {
        selectedAudience = val;
        renderGrid();
      });
    }

    // Category Pills
    if (categoryPills) {
      renderPills(categoryPills, CATEGORY_OPTIONS, selectedCategory, (val) => {
        selectedCategory = val;
        renderGrid();
      });
    }

    // Format Pills
    if (formatPills) {
      renderPills(formatPills, FORMAT_OPTIONS, selectedFormat, (val) => {
        selectedFormat = val;
        renderGrid();
      });
    }

    // Search Input Listener
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderGrid();
      });
    }

    // Clear Filters Button
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', resetFilters);
    }

    // Hero Audience Shortcut Cards
    document.querySelectorAll('.shortcut-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const targetAudience = card.getAttribute('data-audience');
        if (targetAudience) {
          selectedAudience = targetAudience;
          updatePillsActiveState(audiencePills, selectedAudience);
          renderGrid();

          // Scroll smoothly to filter container
          const filterSection = document.getElementById('resourcesSection');
          if (filterSection) {
            filterSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  function renderPills(container, options, activeValue, onSelect) {
    container.innerHTML = options.map(opt => `
      <button class="filter-pill ${opt === activeValue ? 'active' : ''}" data-value="${opt}">
        ${opt}
      </button>
    `).join('');

    container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-value');
        updatePillsActiveState(container, val);
        onSelect(val);
      });
    });
  }

  function updatePillsActiveState(container, activeValue) {
    if (!container) return;
    container.querySelectorAll('.filter-pill').forEach(pill => {
      if (pill.getAttribute('data-value') === activeValue) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function resetFilters() {
    selectedAudience = 'All';
    selectedCategory = 'All';
    selectedFormat = 'All';
    searchQuery = '';

    if (searchInput) searchInput.value = '';
    if (audiencePills) updatePillsActiveState(audiencePills, 'All');
    if (categoryPills) updatePillsActiveState(categoryPills, 'All');
    if (formatPills) updatePillsActiveState(formatPills, 'All');

    renderGrid();
  }

  /* --------------------------------------------------------------------------
     FEATURED RESOURCES RENDER
     -------------------------------------------------------------------------- */
  function renderFeatured(resources) {
    if (!featuredGrid) return;
    const featuredItems = resources.filter(r => r.featured);

    if (featuredItems.length === 0) {
      featuredGrid.style.display = 'none';
      return;
    }

    featuredGrid.innerHTML = featuredItems.map(resource => createResourceCardHTML(resource, true)).join('');
    bindCardEvents(featuredGrid);
  }

  /* --------------------------------------------------------------------------
     MAIN GRID FILTER & RENDER
     -------------------------------------------------------------------------- */
  function renderGrid() {
    if (!mainGrid) return;

    const filtered = allResources.filter(r => {
      // Search match
      const matchesSearch = !searchQuery || 
        r.title.toLowerCase().includes(searchQuery) ||
        r.description.toLowerCase().includes(searchQuery) ||
        r.category.toLowerCase().includes(searchQuery) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes(searchQuery)));

      // Audience match
      const matchesAudience = selectedAudience === 'All' || 
        r.audience.toLowerCase().includes(selectedAudience.toLowerCase()) ||
        selectedAudience.toLowerCase().includes(r.audience.toLowerCase());

      // Category match
      const matchesCategory = selectedCategory === 'All' || 
        r.category.toLowerCase() === selectedCategory.toLowerCase();

      // Format match
      const matchesFormat = selectedFormat === 'All' || 
        r.format.toLowerCase() === selectedFormat.toLowerCase();

      return matchesSearch && matchesAudience && matchesCategory && matchesFormat;
    });

    // Update Counter
    if (resourcesCountText) {
      resourcesCountText.innerHTML = `Showing <span>${filtered.length}</span> of <span>${allResources.length}</span> resources`;
    }

    if (filtered.length === 0) {
      mainGrid.innerHTML = `
        <div class="resources-empty-state">
          <h3 class="resources-empty-title">No resources found</h3>
          <p class="resources-empty-text">Try changing your search terms or clearing your current filters.</p>
          <button class="btn btn-secondary" id="emptyStateResetBtn">Clear All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('emptyStateResetBtn');
      if (resetBtn) resetBtn.addEventListener('click', resetFilters);
      return;
    }

    mainGrid.innerHTML = filtered.map(resource => createResourceCardHTML(resource, false)).join('');
    bindCardEvents(mainGrid);
  }

  /* --------------------------------------------------------------------------
     CARD HTML BUILDER
     -------------------------------------------------------------------------- */
  function createResourceCardHTML(resource, isFeatured = false) {
    let badgeClass = 'badge-coming-soon';
    let badgeLabel = 'COMING SOON';
    let btnClass = 'resource-btn-disabled';
    let btnText = 'Coming Soon';
    let btnAttr = 'disabled';

    if (resource.status === 'free') {
      badgeClass = 'badge-free';
      badgeLabel = 'FREE';
      btnClass = 'resource-btn-download';
      btnText = 'Download';
      btnAttr = resource.file ? `href="${resource.file}" download` : 'data-action="download-sample"';
    } else if (resource.status === 'premium') {
      badgeClass = 'badge-premium';
      badgeLabel = 'PREMIUM';
      btnClass = 'resource-btn-download';
      btnText = 'View Resource';
      btnAttr = 'data-action="premium-info"';
    } else {
      // coming_soon
      badgeClass = 'badge-coming-soon';
      badgeLabel = 'COMING SOON';
      btnClass = 'resource-btn-disabled';
      btnText = 'Sample / Soon';
      btnAttr = 'data-action="coming-soon"';
    }

    return `
      <div class="resource-card glow-card" data-id="${resource.id}">
        <div class="resource-card-top">
          <div class="resource-card-header">
            <div class="resource-meta-badge">
              <span class="resource-badge ${badgeClass}">${badgeLabel}</span>
              <span class="resource-format-tag">• ${resource.format}</span>
            </div>
            <span class="resource-category-label">${resource.audience}</span>
          </div>

          <h3 class="resource-card-title">${resource.title}</h3>
          <p class="resource-card-desc">${resource.description}</p>
        </div>

        <div class="resource-card-footer">
          <span class="resource-category-label">${resource.category}</span>
          ${resource.status === 'free' && resource.file ? `
            <a href="${resource.file}" download class="resource-btn ${btnClass}">
              ${btnText}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </a>
          ` : `
            <button class="resource-btn ${btnClass}" ${btnAttr}>
              ${btnText}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15V3M7 10l5 5 5-5M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              </svg>
            </button>
          `}
        </div>
      </div>
    `;
  }

  function bindCardEvents(container) {
    container.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.getAttribute('data-action');
        if (action === 'coming-soon') {
          showToast('This resource template is currently being finalized. Full file download will be available soon!');
        } else if (action === 'download-sample') {
          showToast('Sample resource file will be linked shortly. Contact connect@sreepriya.xyz for advance access.');
        } else if (action === 'premium-info') {
          showToast('Premium toolkits and frameworks are coming soon.');
        }
      });
    });
  }

  function showToast(message) {
    let toast = document.getElementById('resourceToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'resourceToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--accent);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-size: 0.9rem;
        max-width: 380px;
        transition: opacity 0.3s ease, transform 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 4000);
  }

  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const audienceParam = params.get('audience');
    if (audienceParam && AUDIENCE_OPTIONS.some(a => a.toLowerCase() === audienceParam.toLowerCase())) {
      const matched = AUDIENCE_OPTIONS.find(a => a.toLowerCase() === audienceParam.toLowerCase());
      if (matched) {
        selectedAudience = matched;
        if (audiencePills) updatePillsActiveState(audiencePills, selectedAudience);
        renderGrid();
      }
    }
  }
});
