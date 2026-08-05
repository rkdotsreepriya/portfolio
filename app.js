/* ==========================================================================
   INTERACTIVE SCRIPTS - SREEPRIYA RADHAKRISHNAN PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initDynamicMedia();
  initIntersectionObserver();
  initMouseGlow();
  initCounters();
  initModals();
  initContactForm();
});

/* ==========================================================================
   THEME SWITCHING (LIGHT / DARK MODE)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Retrieve theme preference from localStorage, default to dark if not set (looks premium by default)
  const storedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', storedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==========================================================================
   NAVIGATION INTERACTIONS (MOBILE TOGGLE & ACTIVE HIGHLIGHTS)
   ========================================================================== */
function initNav() {
  const header = document.querySelector('header');
  const mobileToggle = document.getElementById('mobileNavToggle');
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Change header appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Dynamic active links on scroll
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile navigation drawer toggle
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      mobileToggle.innerHTML = isOpen
        ? `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        mobileToggle.innerHTML = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !mobileToggle.contains(e.target)) {
        nav.classList.remove('open');
        mobileToggle.innerHTML = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      }
    });
  }
}

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to run animation once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/* ==========================================================================
   MOUSE GLOW HIGHLIGHT EFFECT FOR CARDS
   ========================================================================== */
function initMouseGlow() {
  const glowCards = document.querySelectorAll('.glow-card');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   ANIMATED COUNTERS (IMPACT SECTION)
   ========================================================================== */
function initCounters() {
  const counterSection = document.getElementById('impact');
  if (!counterSection) return;

  const counters = document.querySelectorAll('.counter');
  let started = false;

  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const speed = 200; // The higher the slower
    const increment = target / speed;
    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.ceil(count) + suffix;
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target + suffix;
      }
    };

    updateCount();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        counters.forEach(counter => countUp(counter));
        started = true;
        observer.unobserve(counterSection);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(counterSection);
}

/* ==========================================================================
   CASE STUDIES & BLOG DYNAMIC DATA & OVERLAYS
   ========================================================================== */
const projectsData = {
  'beyondborn': {
    title: 'Beyond Born Early Education Centre',
    role: 'Founder & Managing Director',
    client: 'Beyond Born Early Education Centre, Kochi',
    year: '2019 - Present',
    tags: ['Business Strategy', 'Operations', 'Curriculum', 'Learning Environment Design'],
    heroImage: 'assets/bb-logo.png', // Fallback to premium mockup
    challenge: 'Early childhood education in India is often reduced to either rote learning or unguided daycare. In Kochi, parents were looking for a premium, child-centric space that integrated authentic, research-backed early pedagogy with active learning environments, but existing solutions were scarce, fragmented, and lacked operational scale.',
    approach: 'We designed a holistic early learning environment from the ground up, infusing progressive child development principles (inspired by Reggio Emilia and Montessori) into every touchpoint. I built a physical space optimized for discovery, designed an original activity-based curriculum, and developed a strong parent engagement and operational framework.',
    execution: 'I co-founded and built two premium preschool centers in Kochi. Managed the full lifecycle including legal filings, real estate acquisition, spatial architecture design, vendor negotiation, and marketing. We created custom teacher-development modules to maintain high instructional standards, and established operational protocols to scale admissions, parent communications, and student care.',
    impact: 'Successfully launched and operate 2 premium centers in Kochi, serving over 1,000 children and their families. Established Beyond Born as a benchmark for high-quality preschooling in Kerala. Achieved 95%+ parent satisfaction rating and stable enrollment year-over-year.',
    lessons: 'Operations are the execution engine of empathy. You can have the most beautiful curriculum in the world, but if your morning drop-off is chaotic, or teacher feedback systems are broken, the educational experience collapses. Standardizing operational protocols while keeping child welfare at the center is the key to scaling any educational institution.',
    testimonial: `Choosing Beyond Born was the best decision we made for our child’s early years. Sreepriya is so much more than a founder—she is a true partner in parenting. From day one, her warm presence, expertise, and personalized guidance helped us navigate every milestone and challenge with confidence. Thanks to Sreepriya's dedicated leadership, our child has blossomed into a confident, curious, and kind individual. She didn't just provide top-tier early education; she created a safe, nurturing second home for our family. If you are looking for an early educator who genuinely cares about your child’s holistic growth, look no further than Sreepriya.`,
    author: 'Krishnapriya, Parent & Community Collaborator',
    metrics: [
      { num: '2', label: 'Premium Centers Built' },
      { num: '500+', label: 'Children Impacted' },
      { num: '95%', label: 'Parent Satisfaction Rate' }
    ]
  },
  'pehia': {
    title: 'PEHIA Foundation',
    role: 'Co-Founder & Program Designer',
    client: 'PEHIA Foundation, Kerala',
    year: '2018 - Present',
    tags: ['Community Building', 'Program Design', 'Strategic Partnerships', 'Women In Tech'],
    heroImage: 'assets/pehia.png',
    challenge: 'Kerala possesses high female literacy but suffers from a significant gender gap in tech industry participation and technology leadership. Women developers, students, and aspiring coders lacked accessible networking channels, tech-centric mentorship, and confidence-building platforms.',
    approach: 'We established PEHIA Foundation as a leading women-in-tech non-profit. The goal was to build a sustainable tech community that offers open, non-intimidating mentorship, active coding bootcamps, and career growth opportunities for girls and women, using a distributed volunteer model.',
    execution: 'Led community operations, volunteer management, and program design. Partnered with major educational institutions, incubators, and corporate tech companies to host workshops, hackathons, and panels. Coordinated sponsorships and designed mentoring structures connecting early-career developers with senior industry architects.',
    impact: 'Engaged thousands of women across Kerala. Created a resilient peer-to-peer learning network that helped dozens of members secure internships, tech roles, and fellowships. PEHIA has been recognized as a prominent grassroots gender-inclusion driver in the region.',
    lessons: 'Ecosystems require organic momentum over top-down structures. High-impact programs are built by empowering local volunteers to take ownership of regional chapters, giving them the tools and confidence to curate localized tech meetups.',
    testimonial: `"Sreepriya is one of the best Women-in-tech person that I know. Her dedication and passion in finding and helping young woman to become the best in technology is amazing. Her ideologies on learning and teaching is unique and had a great impact in transforming the lives of many young minds. She is among the most inspiring people I've ever met."`,
    author: 'Yadav Jayachandran, PEHIA Patron',
    metrics: [
      { num: '5000+', label: 'Community Members' },
      { num: '100+', label: 'Tech Workshops Done' },
      { num: '120+', label: 'Mentors Onboarded' }
    ]
  },
  'workbooks': {
    title: 'Educational Workbook Series',
    role: 'Lead Curriculum Designer',
    client: 'Early Childhood Publications',
    year: '2021 - 2023',
    tags: ['Curriculum Design', 'Activity-Based Learning', 'Graphic Layouts'],
    heroImage: 'assets/workbook_mockups.png',
    challenge: 'Preschool workbooks are commonly dry, black-and-white printouts focused on tracing letters repetitively, which disengages early learners and fails to develop broader motor and critical thinking skills.',
    approach: 'Designed an original, visually engaging series of workbooks for Pre-KG, LKG, and UKG levels. The series integrates physical, hands-on tasks with printed guides, using gamified themes that focus on cognitive milestones, fine motor skills, numeracy, and emergent literacy.',
    execution: 'Researched early cognitive development frameworks and structured a progressive learning arc. Directed page layouts, illustration briefs, and tactile integration plans. Tested initial modules directly within preschool focus groups to refine layout spacing, typeface sizing, and interactive tasks.',
    impact: 'Launched comprehensive workbook packages covering Literacy, Numeracy, and Theme-based Discovery. Deployed across multiple early childhood education networks in South India, serving as the core foundation for thousands of preschool students.',
    lessons: 'Typography and white space are as educational as content. For a four-year-old, a cluttered page causes cognitive overload. Premium layouts, soft colors, and generous spacing guide the child\'s visual attention naturally and turn workbook exercises into discovery games.',
    metrics: [
      { num: 'PREK-UKG', label: 'Core Grade Levels Covered' },
      { num: '500+', label: 'Original Learning Templates' },
      { num: '300+', label: 'Copies Distributed' }
    ]
  },
  'events': {
    title: 'Program Management & Wedding Coordination',
    role: 'Program Coordinator',
    client: 'Make My Events & Weddings',
    year: '2016 - 2018',
    tags: ['Execution & Logistics', 'Operations', 'Risk Management', 'Stakeholder Management'],
    heroImage: 'assets/workbook_mockups.png',
    challenge: 'Managing large-scale, high-budget hospitality events requires flawless coordination under high emotional pressure. A single vendor delay, budget error, or timeline misalignment can jeopardize the entire project delivery, requiring absolute precision in execution.',
    approach: 'I treated event coordination as an agile engineering project. Developed standard operational playbooks, centralized vendor management, created transparent budget trackers, and designed multi-layer contingency protocols to mitigate risk in real-time.',
    execution: 'Orchestrated logistics, timelines, vendor contracts, and client experience for events hosting up to 2,000 guests. Directed cross-functional teams of decorators, caterers, security, and technical staff. Managed budget allocation, crisis mitigation, and contract negotiations under compressed timelines.',
    impact: 'Successfully executed dozens of major high-profile events with zero critical failures. Maintained client retention rates and established a reputation for calm, execution-focused leadership in high-stress, multi-stakeholder scenarios.',
    lessons: 'Transferable program management skills are industry-agnostic. Managing a complex 2,000-person event uses the same core operational principles as coordinating a state-wide education project: clear communications, structured timelines, vendor accountability, and proactive risk planning.',
    testimonial: `"Sreepriya is an execution powerhouse. She manages complex timelines and multi-partner networks with incredible poise, making sure everything executes beautifully."`,
    author: 'Vipin Das, Director of Operations, Make My Events',
    metrics: [
      { num: '40+', label: 'Large Events Coordinated' },
      { num: '100%', label: 'On-Time Execution' },
      { num: '15+', label: 'Vendor Partners Managed' }
    ]
  }
};


const pressData = [
  {
    title: "An Inspiration to Women Techies",
    publication: "The New Indian Express",
    description: "A profile highlighting Sreepriya Radhakrishnan and Enfa George's work in founding Pehia, aiming for a gender-equal IT ecosystem.",
    link: "https://www.newindianexpress.com/amp/story/cities/kochi/2019/sep/05/an-inspiration-to-women-techies-2029154.html",
    date: "Sep 2019",
    tags: ["Profile", "Women in Tech"]
  },
  {
    title: "Helping Hands Restore Classrooms, School Park",
    publication: "The Hindu",
    description: "Detailing the collaborative post-flood restoration efforts where professionals, students, and teachers worked together to rebuild playgrounds and classrooms.",
    link: "https://www.thehindu.com/todays-paper/tp-national/tp-kerala/helping-hands-restore-classrooms-school-park/article24859806.ece",
    date: "Sep 2018",
    tags: ["Flood Relief", "Community"]
  }
];

const videosData = [
  {
    title: "ഓരോ നിമിഷവും ഒരു പുതിയ തുടക്കമാണ് | Sreepriya Radhakrishnan | Josh Talks Malayalam",
    description: "Sreepriya sharing her inspiring journey of building Pehia Foundation, working towards gender equality in tech, and finding new beginnings.",
    youtubeId: "ZG-gXuDPNtA",
    date: "Dec 2022"
  },
  {
    title: "Bridging the Gender Gap in the Tech Industry — Pehia Foundation",
    description: "A talk on Sreepriya Radhakrishnan's journey starting a community in 2017 to bridge the gender gap in tech.",
    youtubeId: "y-XU7AjNfXc",
    date: "2021"
  },
  {
    title: "Pehia Organisation | SthreeShakthi Award 2018 contestant Science and technology",
    description: "Pehia Foundation was honored with a nomination for the Stree Sakthi Award, recognizing its contribution to empowering women through technology, education, and community leadership.",
    youtubeId: "ZSQW-4vvwJc",
    date: "March 2018"
  },
  {
    title: "24 STHREE | 13 FEBRUARY 2019 | 24 Special",
    description: "Pehia Foundation featuring in 24 News Channel.",
    youtubeId: "T0RbdbC_fHk",
    date: "Feb 2019"
  },
  {
    title: "Enfa Rose George and Sreepriya Radhakrishnan | Pehia Foundation | Smart Lady | Ladies Hour",
    description: "An interview with Sreepriya Radhakrishnan and Enfa Rose George about Pehia Foundation's initiatives.",
    youtubeId: "KkdLsRCnC_M",
    date: "2018"
  },
  {
    title: "Sthree Sakthi Awards 2018 — Science Feature",
    description: "Asianet News feature covering Sreepriya Radhakrishnan's nomination for the Sthree Sakthi Awards 2018 in the science and technology category.",
    youtubeId: "yyI36aIcEAo",
    date: "2018"
  },
  {
    title: "Sreepriya Radhakrishnan — Live on Clarify",
    description: "A live conversation on Sreepriya's exciting journey creating Pehia.org, a non-profit working towards tech inclusion.",
    youtubeId: "XYO471i72-o",
    date: "2020"
  },
  {
    title: "Live Talk With Sreepriya — Founder of Pehia.org",
    description: "A live session detailing the objectives of Pehia Foundation in eliminating the gender gap in technology.",
    youtubeId: "SH6u9rqPOrM",
    date: "2020"
  }
];

function initModals() {
  const overlay = document.getElementById('overlayModal');
  const closeBtn = document.getElementById('closeOverlayBtn');
  const overlayInner = document.getElementById('overlayInner');

  if (!overlay || !closeBtn || !overlayInner) return;

  // Click on a project card to open case study
  document.querySelectorAll('[data-project-id]').forEach(card => {
    card.addEventListener('click', () => {
      const projId = card.getAttribute('data-project-id');
      const data = projectsData[projId];
      if (data) {
        renderCaseStudy(data);
        openOverlay();
      }
    });
  });


  // Click on a video card to play in modal
  document.addEventListener('click', (e) => {
    const videoCard = e.target.closest('[data-video-id]');
    if (videoCard) {
      const videoIndex = videoCard.getAttribute('data-video-id');
      const data = videosData[videoIndex];
      if (data) {
        renderVideoModal(data);
        openOverlay();
      }
    }
  });

  closeBtn.addEventListener('click', closeOverlay);

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeOverlay();
    }
  });

  function openOverlay() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function closeOverlay() {
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    overlayInner.innerHTML = ''; // Stop video playback by clearing content
  }

  function renderVideoModal(data) {
    overlayInner.innerHTML = `
      <span class="overlay-pretitle">${data.date} — Video Feature</span>
      <h1 class="overlay-title" style="margin-bottom: 2rem;">${data.title}</h1>
      
      <div class="overlay-hero-image" style="aspect-ratio: 16/9; height: auto; max-height: 500px; padding: 0;">
        <iframe 
          src="https://www.youtube.com/embed/${data.youtubeId}?autoplay=1" 
          title="${data.title}" 
          style="width: 100%; height: 100%; border: none;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>

      <div class="case-study-section-content" style="max-width: 760px; margin: 0 auto; font-size: 1.15rem; line-height: 1.8; font-weight: 300;">
        <p>${data.description}</p>
      </div>
    `;
  }

  function renderCaseStudy(data) {
    let metricsHtml = '';
    if (data.metrics && data.metrics.length > 0) {
      metricsHtml = `
        <div class="case-study-meta-grid">
          ${data.metrics.map(m => `
            <div class="case-study-meta-item">
              <span class="case-study-meta-label">${m.label}</span>
              <span class="case-study-meta-val" style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 700; color: var(--accent);">${m.num}</span>
            </div>
          `).join('')}
          <div class="case-study-meta-item">
            <span class="case-study-meta-label">Client / Network</span>
            <span class="case-study-meta-val">${data.client}</span>
          </div>
        </div>
      `;
    }

    let tagsHtml = data.tags.map(t => `<span class="project-tag">${t}</span>`).join(' ');

    let testimonialHtml = '';
    if (data.testimonial) {
      testimonialHtml = `
        <div class="case-study-testimonial">
          <p class="case-study-testimonial-quote">${data.testimonial}</p>
          <span class="case-study-testimonial-author">— ${data.author}</span>
        </div>
      `;
    }

    overlayInner.innerHTML = `
      <span class="overlay-pretitle">${data.role}</span>
      <h1 class="overlay-title">${data.title}</h1>
      
      <div class="project-tags" style="margin-bottom: 2.5rem;">
        ${tagsHtml}
      </div>

      <div class="overlay-hero-image">
        <img src="${data.heroImage}" alt="${data.title}">
      </div>

      ${metricsHtml}

      <div class="case-study-sections">
        <div class="case-study-section">
          <span class="case-study-section-title">The Challenge</span>
          <div class="case-study-section-content"><p>${data.challenge}</p></div>
        </div>
        
        <div class="case-study-section">
          <span class="case-study-section-title">The Approach</span>
          <div class="case-study-section-content"><p>${data.approach}</p></div>
        </div>
        
        <div class="case-study-section">
          <span class="case-study-section-title">Execution & Strategy</span>
          <div class="case-study-section-content"><p>${data.execution}</p></div>
        </div>
        
        <div class="case-study-section">
          <span class="case-study-section-title">Impact</span>
          <div class="case-study-section-content"><p>${data.impact}</p></div>
        </div>

        <div class="case-study-section">
          <span class="case-study-section-title">Lessons Learned</span>
          <div class="case-study-section-content"><p>${data.lessons}</p></div>
        </div>
      </div>

      ${testimonialHtml}
    `;
  }
}

/* ==========================================================================
   CONTACT FORM (PREMIUM INTERACTIVE VALIDATION & RESPONSE)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.innerText = "Please fill in all fields.";
      status.className = "form-status error";
      return;
    }

    // Elegant simulated API request
    status.innerText = "Sending your message...";
    status.className = "form-status";
    status.style.display = "block";

    setTimeout(() => {
      status.innerText = "Thank you, Sreepriya will get back to you shortly.";
      status.className = "form-status success";
      form.reset();
    }, 1500);
  });
}

/* ==========================================================================
   DYNAMIC MEDIA RENDERING (PRESS & VIDEOS)
   ========================================================================== */
function initDynamicMedia() {
  const pressGrid = document.getElementById('pressGrid');
  const videosGrid = document.getElementById('videosGrid');

  if (pressGrid) {
    pressGrid.innerHTML = pressData.map((p) => `
      <div class="press-card reveal">
        <div class="press-meta">
          <span class="press-pub">${p.publication}</span>
          <span class="press-date">${p.date}</span>
        </div>
        <h4 class="press-title">${p.title}</h4>
        <p class="press-desc">${p.description}</p>
        <div class="press-tags">
          ${p.tags.map(t => `<span class="press-tag">${t}</span>`).join('')}
        </div>
        <a href="${p.link}" target="_blank" rel="noopener" class="press-link">
          Read Report
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    `).join('');
  }

  if (videosGrid) {
    videosGrid.innerHTML = videosData.map((v, index) => `
      <div class="video-card reveal" data-video-id="${index}">
        <div class="video-thumb-wrapper">
          <img src="https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg" alt="${v.title}">
          <div class="video-play-btn">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <div class="video-info">
          <span class="video-date">${v.date}</span>
          <h4 class="video-title">${v.title}</h4>
          <p class="video-desc">${v.description}</p>
        </div>
      </div>
    `).join('');
  }
}
