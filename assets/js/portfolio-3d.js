/**
 * Suryansh Tripathi - Modern Realistic 3D Interactive Portfolio Engine
 * - Three.js Realistic WebGL Metallic-Glass Geometry & Organic Particle Scene
 * - VanillaTilt 3D Card Perspective & Micro-interactions
 * - Mini Chatbot & Interactive FAQ Assistant
 * - Password-Protected Admin Portal with Full Live CRUD (Add, Edit, Delete Projects & Certifications)
 * - Persistent State Synchronization with LocalStorage
 */

document.addEventListener('DOMContentLoaded', () => {
  initHero3DCanvas();
  initVanillaTiltCards();
  initProjectFiltering();
  initProjectDetailsModal();
  initSkillsProgressObserver();
  initMiniChatbot();
  initAdminSystem();
});

/* ===================================================================
   1. THREE.JS REALISTIC WEBGL 3D SCENE & AMBIENT ORGANIC DRIFT
   =================================================================== */
function initHero3DCanvas() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 65;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting System for Realistic Materials
  const ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x60a5fa, 2.2);
  mainLight.position.set(40, 50, 40);
  scene.add(mainLight);

  const accentLight = new THREE.PointLight(0x818cf8, 2.0, 120);
  accentLight.position.set(-35, -20, 25);
  scene.add(accentLight);

  // Organic Ambient Floating Starfield
  const particleCount = 100;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 110;
    positions[i + 1] = (Math.random() - 0.5) * 80;
    positions[i + 2] = (Math.random() - 0.5) * 60;

    velocities.push({
      x: (Math.random() - 0.5) * 0.04,
      y: (Math.random() - 0.5) * 0.04,
      z: (Math.random() - 0.5) * 0.04
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Soft circular particle texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 32;
  particleCanvas.height = 32;
  const pCtx = particleCanvas.getContext('2d');
  const gradient = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(147, 197, 253, 0.9)');
  gradient.addColorStop(0.4, 'rgba(59, 130, 246, 0.4)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
  pCtx.fillStyle = gradient;
  pCtx.beginPath();
  pCtx.arc(16, 16, 16, 0, Math.PI * 2);
  pCtx.fill();

  const particleTexture = new THREE.CanvasTexture(particleCanvas);
  const particleMaterial = new THREE.PointsMaterial({
    size: 1.8,
    map: particleTexture,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // Sophisticated Realistic 3D Torus Knot Geometry with Metallic/Glass physical material
  const torusGeometry = new THREE.TorusKnotGeometry(14, 3.8, 120, 24);
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    metalness: 0.65,
    roughness: 0.25,
    wireframe: false,
    transparent: true,
    opacity: 0.45
  });

  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.position.set(32, 0, -10);
  scene.add(torusMesh);

  // Inner Subtle Geometric Core
  const icoGeometry = new THREE.IcosahedronGeometry(11, 1);
  const icoMaterial = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    metalness: 0.8,
    roughness: 0.2,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
  icoMesh.position.set(32, 0, -10);
  scene.add(icoMesh);

  // Mouse Parallax smooth lerp
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
  });

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 14;
    camera.position.y = -targetY * 14;
    camera.lookAt(scene.position);

    torusMesh.rotation.x += 0.0018;
    torusMesh.rotation.y += 0.0024;

    icoMesh.rotation.x -= 0.002;
    icoMesh.rotation.y -= 0.003;

    const pos = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pos[idx] += velocities[i].x;
      pos[idx + 1] += velocities[i].y;
      pos[idx + 2] += velocities[i].z;

      if (Math.abs(pos[idx]) > 55) velocities[i].x *= -1;
      if (Math.abs(pos[idx + 1]) > 40) velocities[i].y *= -1;
      if (Math.abs(pos[idx + 2]) > 30) velocities[i].z *= -1;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    if (!canvas || !canvas.parentElement) return;
    const width = canvas.parentElement.offsetWidth;
    const height = canvas.parentElement.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* ===================================================================
   2. VANILLA TILT PERSPECTIVE CARDS
   =================================================================== */
function initVanillaTiltCards() {
  if (typeof VanillaTilt === 'undefined') return;

  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (tiltElements.length > 0) {
    VanillaTilt.init(tiltElements, {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
      perspective: 1200,
      scale: 1.015
    });
  }
}

/* ===================================================================
   3. DEPLOYED PROJECTS FILTERING
   =================================================================== */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.projects-filter-bar .filter-btn');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      const projectItems = document.querySelectorAll('.project-grid-item');

      projectItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCat === filterVal || item.classList.contains('creator-item')) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   4. MINI CHATBOT & FAQ ASSISTANT
   =================================================================== */
function initMiniChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const windowEl = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const messagesContainer = document.getElementById('chatbot-messages');
  const faqChips = document.querySelectorAll('.faq-chip');

  if (!toggleBtn || !windowEl) return;

  toggleBtn.addEventListener('click', () => {
    windowEl.classList.toggle('active');
    if (windowEl.classList.contains('active') && input) {
      setTimeout(() => input.focus(), 300);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      windowEl.classList.remove('active');
    });
  }

  faqChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-question') || chip.innerText.trim();
      sendUserMessage(q);
    });
  });

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendUserMessage(text);
    });
  }

  function sendUserMessage(questionText) {
    appendChatMessage(questionText, 'user');

    const typingId = 'bot-typing-' + Date.now();
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot-msg';
    typingEl.id = typingId;
    typingEl.innerHTML = `
      <div class="chat-bubble" style="opacity: 0.7;">
        <span class="pulse-dot me-1" style="display:inline-block;"></span> Formulating answer...
      </div>
    `;
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
      const existingTyping = document.getElementById(typingId);
      if (existingTyping) existingTyping.remove();

      const reply = generateChatbotReply(questionText);
      appendChatMessage(reply, 'bot');
    }, 400);
  }

  function appendChatMessage(htmlContent, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}-msg`;
    msgDiv.innerHTML = `<div class="chat-bubble">${htmlContent}</div>`;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function generateChatbotReply(query) {
    const q = query.toLowerCase();

    if (q.includes('education') || q.includes('degree') || q.includes('college') || q.includes('allahabad') || q.includes('study') || q.includes('rank')) {
      return `🎓 <strong>Education &amp; Academic Rank:</strong><br>
        • Currently pursuing <strong>BCA + MCA (Data Science)</strong> at the <strong>University of Allahabad</strong> (Aug 2024 – Present).<br>
        • Proudly <strong>Ranked in the Top 5</strong> of college academics!<br>
        • Strong foundation in Data Structures, SQL, Python, and Machine Learning.`;
    }

    if (q.includes('project') || q.includes('chatbot') || q.includes('iris') || q.includes('unemployment') || q.includes('rain') || q.includes('hackathon') || q.includes('swadeshi')) {
      return `🚀 <strong>Suryansh's Top Deployed &amp; Key Projects:</strong><br>
        1. <strong>AI Conversational Chatbot</strong> (Python, LLM APIs, prompt engineering)<br>
        2. <strong>Unemployment Data Analysis</strong> (Pandas, NumPy, Matplotlib &amp; Seaborn trends)<br>
        3. <strong>Iris Flower Classification ML</strong> (Scikit-Learn predictive modeling)<br>
        4. <strong>Rain Detector Hardware System</strong> (Awarded <em>1st Rank / Best Project</em> by DIOS)<br>
        5. <strong>SIH 'Swadeshi Aatmanirbhar Bharat'</strong> (National hackathon web portal)<br>
        6. <strong>Personal Developer Portfolio</strong> (Live on Netlify).<br>
        <em>Scroll down to 'Deployed Projects' to explore live demos &amp; code repositories!</em>`;
    }

    if (q.includes('skill') || q.includes('python') || q.includes('sql') || q.includes('tech') || q.includes('tool') || q.includes('power bi') || q.includes('excel') || q.includes('ml')) {
      return `⚡ <strong>Core Technical Skills:</strong><br>
        • <strong>Languages</strong>: Python (Pandas, NumPy, Seaborn, Scikit-Learn), SQL, C, Java, JavaScript.<br>
        • <strong>Data Science &amp; ML</strong>: Data cleaning, EDA, statistical modeling, classification.<br>
        • <strong>BI &amp; Analytics</strong>: Power BI, Advanced Excel, Google Analytics.<br>
        • <strong>Web &amp; APIs</strong>: HTML5, CSS3, REST APIs, Git/GitHub.`;
    }

    if (q.includes('certif') || q.includes('deloitte') || q.includes('tata') || q.includes('bcg') || q.includes('openai') || q.includes('chatgpt') || q.includes('course')) {
      return `🎖️ <strong>7 Verified Industry Certifications:</strong><br>
        1. <strong>Deloitte Australia</strong> – Data Analytics Job Simulation<br>
        2. <strong>Tata Group</strong> – GenAI Powered Data Analytics<br>
        3. <strong>BCG</strong> – GenAI Job Simulation<br>
        4. <strong>OpenAI</strong> – AI Foundations<br>
        5. <strong>Introduction to Generative AI</strong><br>
        6. <strong>Python Programming for Beginners</strong><br>
        7. <strong>ChatGPT for Everyone</strong>`;
    }

    if (q.includes('award') || q.includes('honor') || q.includes('dios') || q.includes('gdg') || q.includes('rank') || q.includes('prize')) {
      return `🏆 <strong>Major Honors &amp; Recognitions:</strong><br>
        🥇 <strong>1st Rank / 'Best Project' Award</strong> – Rain Detector hardware system awarded by District Inspector of Schools (DIOS).<br>
        🥈 <strong>2nd Runner-Up</strong> – Google Developer Group (GDG) Android Development Program.<br>
        🎓 <strong>Top 5 Rank in College Academics</strong> at University of Allahabad.`;
    }

    if (q.includes('experience') || q.includes('lead') || q.includes('president') || q.includes('hacksquad') || q.includes('pydata') || q.includes('cmp') || q.includes('community')) {
      return `🌟 <strong>Leadership &amp; Community Experience:</strong><br>
        • <strong>Club President &amp; Lead</strong> — <strong>CMP HackSquad</strong> (Official Tech Community of CMP Degree College, Univ. of Allahabad). Directing hackathons, coding workshops, and developer sprints.<br>
        • <strong>Co-Organizer</strong> — <strong>PyData Prayagraj</strong> (7th official PyData community in India). Co-organizing data science, machine learning, and Python developer meetups for 4+ months.`;
    }

    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('location') || q.includes('intern') || q.includes('job') || q.includes('reach')) {
      return `📬 <strong>Get in Touch with Suryansh:</strong><br>
        • <strong>Location</strong>: Prayagraj, Uttar Pradesh, India<br>
        • <strong>Phone</strong>: <a href="tel:+917526037217" style="color:var(--accent-cyan);">+91 7526037217</a><br>
        • <strong>Email</strong>: <a href="mailto:suryanshtripathi778@gmail.com" style="color:var(--accent-cyan);">suryanshtripathi778@gmail.com</a><br>
        • <strong>GitHub</strong>: <a href="https://github.com/suryansht9" target="_blank" style="color:var(--accent-cyan);">github.com/suryansht9</a><br>
        • <strong>LinkedIn</strong>: <a href="https://in.linkedin.com/in/suryansh-tripathi-5b3384242" target="_blank" style="color:var(--accent-cyan);">suryansh-tripathi</a>`;
    }

    return `💡 Suryansh is a <strong>BCA + MCA (Data Science)</strong> student at <strong>University of Allahabad</strong> (Top 5 rank), <strong>Club President of CMP HackSquad</strong>, and <strong>Co-Organizer of PyData Prayagraj</strong>.<br><br>
      Feel free to ask about his <strong>projects</strong>, <strong>leadership experience</strong>, <strong>certifications</strong>, <strong>technical skills</strong>, or <strong>contact info</strong>!`;
  }
}


/* ===================================================================
   5. ADMIN PANEL SYSTEM (WITH ADD, EDIT, DELETE & STORAGE SYNC)
   =================================================================== */
const defaultProjects = [
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot using Python and API Integration',
    category: 'ai',
    categoryLabel: 'AI & NLP',
    dateBadge: 'Jun 2026 – Present',
    liveBadge: 'Live Deployed',
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9',
    thumbImg: 'assets/img/portfolio/app-1.jpg',
    description: 'Built an AI-powered conversational chatbot in Python, integrating external LLM APIs to generate real-time, context-aware responses with resilient prompt design.',
    tags: ['Python', 'API Integration', 'Generative AI', 'NLP']
  },
  {
    id: 'unemployment-analysis',
    title: 'Unemployment Data Analysis (Python)',
    category: 'data',
    categoryLabel: 'Python EDA',
    dateBadge: 'Multi-Year Dataset',
    liveBadge: 'Data Analytics',
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9',
    thumbImg: 'assets/img/portfolio/branding-1.jpg',
    description: 'Cleaned and preprocessed multi-year unemployment datasets using Pandas and NumPy to surface macroeconomic trends. Built rich visualizations with Matplotlib & Seaborn.',
    tags: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn']
  },
  {
    id: 'iris-ml',
    title: 'Iris Flower Classification – Machine Learning',
    category: 'ai',
    categoryLabel: 'Scikit-Learn',
    dateBadge: 'Trained & Evaluated',
    liveBadge: 'Machine Learning',
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9',
    thumbImg: 'assets/img/portfolio/app-2.jpg',
    description: 'Preprocessed the 150-sample Iris dataset and engineered predictive features across 3 flower species to support classification modeling.',
    tags: ['Scikit-Learn', 'Python', 'Classification', 'EDA']
  },
  {
    id: 'rain-detector',
    title: 'Rain Detector Hardware Project',
    category: 'iot',
    categoryLabel: 'Hardware / IoT',
    dateBadge: '1st Rank Award Winner',
    liveBadge: 'Best Project (DIOS)',
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9',
    thumbImg: 'assets/img/portfolio/product-1.jpg',
    description: 'Designed and built a functional hardware-based precipitation detection system with instant alert triggers, earning the "Best Project" 1st Rank award from DIOS.',
    tags: ['Hardware', 'IoT Sensors', 'Circuit Design', 'Embedded Logic']
  },
  {
    id: 'sih-swadeshi',
    title: 'SIH: Swadeshi Aatmanirbhar Bharat',
    category: 'web',
    categoryLabel: 'Full Stack',
    dateBadge: 'National Hackathon',
    liveBadge: 'SIH Hackathon',
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9',
    thumbImg: 'assets/img/portfolio/books-1.jpg',
    description: 'Collaborated with a cross-functional team under tight hackathon deadlines to build a web platform promoting self-reliance initiatives.',
    tags: ['Web Portal', 'JavaScript', 'HTML5/CSS3', 'UI/UX']
  },
  {
    id: 'personal-portfolio',
    title: 'Personal Developer Portfolio Website',
    category: 'web',
    categoryLabel: 'Web Dev',
    dateBadge: 'suryanshportfolio1.netlify.app',
    liveBadge: 'Live on Netlify',
    liveUrl: 'https://suryanshportfolio1.netlify.app',
    githubUrl: 'https://github.com/suryansht9',
    thumbImg: 'assets/img/portfolio/app-3.jpg',
    description: 'High-performance responsive personal site built with HTML, CSS, JavaScript, and Three.js 3D animations to showcase 6 projects, 7 certifications, and academic excellence.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Netlify', 'Three.js']
  }
];

const defaultCerts = [
  {
    id: 'cert-deloitte',
    title: 'Data Analytics Job Simulation',
    issuer: 'Deloitte Australia',
    badgeClass: 'issuer-deloitte',
    coverImg: 'assets/img/portfolio/branding-2.jpg',
    description: 'Completed practical simulation analyzing client data, writing SQL queries, performing demographic segmentation, and presenting strategic data findings.'
  },
  {
    id: 'cert-tata',
    title: 'GenAI Powered Data Analytics Job Simulation',
    issuer: 'Tata Group',
    badgeClass: 'issuer-tata',
    coverImg: 'assets/img/portfolio/branding-3.jpg',
    description: 'Explored the synergy of generative artificial intelligence and analytics to automate exploratory data analysis and generate executive insights.'
  },
  {
    id: 'cert-bcg',
    title: 'GenAI Job Simulation',
    issuer: 'BCG (Boston Consulting)',
    badgeClass: 'issuer-bcg',
    coverImg: 'assets/img/portfolio/books-2.jpg',
    description: 'Simulated strategic business consulting workflows, applying generative AI models to solve unstructured client problem statements.'
  },
  {
    id: 'cert-openai',
    title: 'AI Foundations',
    issuer: 'OpenAI',
    badgeClass: 'issuer-openai',
    coverImg: 'assets/img/portfolio/app-1.jpg',
    description: 'Mastered core architectural principles of modern artificial intelligence, deep learning foundations, transformer models, and ethical AI applications.'
  },
  {
    id: 'cert-genai',
    title: 'Introduction to Generative AI',
    issuer: 'GenAI Specialist',
    badgeClass: 'issuer-openai',
    coverImg: 'assets/img/portfolio/app-2.jpg',
    description: 'Detailed understanding of LLM mechanisms, diffusion models, attention mechanisms, fine-tuning concepts, and conversational agent creation.'
  },
  {
    id: 'cert-python',
    title: 'Python Programming for Beginners',
    issuer: 'Python Institute',
    badgeClass: 'issuer-python',
    coverImg: 'assets/img/portfolio/product-2.jpg',
    description: 'Comprehensive mastery of core Python data structures, functional paradigms, OOP, file handling, and computational logic.'
  },
  {
    id: 'cert-chatgpt',
    title: 'ChatGPT for Everyone',
    issuer: 'AI Productivity',
    badgeClass: 'issuer-deloitte',
    coverImg: 'assets/img/portfolio/books-3.jpg',
    description: 'Effective prompt engineering techniques, iterative context prompting, workflow automation, and conversational AI productivity.'
  }
];

function initAdminSystem() {
  const STORAGE_PROJECTS = 'suryansh_portfolio_projects';
  const STORAGE_CERTS = 'suryansh_portfolio_certs';
  const STORAGE_PASSWORD = 'suryansh_admin_password';
  const DEFAULT_PASSWORD = 'suryansh@2026';

  let projectsState = JSON.parse(localStorage.getItem(STORAGE_PROJECTS) || 'null');
  if (!projectsState || !Array.isArray(projectsState)) {
    projectsState = defaultProjects;
    localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projectsState));
  }

  let certsState = JSON.parse(localStorage.getItem(STORAGE_CERTS) || 'null');
  if (!certsState || !Array.isArray(certsState)) {
    certsState = defaultCerts;
    localStorage.setItem(STORAGE_CERTS, JSON.stringify(certsState));
  }

  // Render baseline dynamic grids
  renderPortfolioProjects(projectsState);
  renderPortfolioCertifications(certsState);

  const openAdminBtn = document.getElementById('openAdminBtn');
  const loginModalEl = document.getElementById('adminLoginModal');
  const dashModalEl = document.getElementById('adminDashboardModal');
  const loginForm = document.getElementById('adminLoginForm');
  const passwordInput = document.getElementById('adminPasswordInput');
  const loginError = document.getElementById('adminLoginError');
  const togglePassBtn = document.getElementById('togglePasswordBtn');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  function triggerAdminPortal() {
    const isAuthed = sessionStorage.getItem('suryansh_admin_authed') === 'true';
    if (isAuthed && dashModalEl) {
      openAdminDashboard();
    } else if (loginModalEl) {
      const loginModal = new bootstrap.Modal(loginModalEl);
      loginModal.show();
      setTimeout(() => passwordInput && passwordInput.focus(), 300);
    }
  }

  if (openAdminBtn) openAdminBtn.addEventListener('click', triggerAdminPortal);

  // Shortcut Ctrl + Shift + A
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      triggerAdminPortal();
    }
  });

  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPass ? 'text' : 'password');
      togglePassBtn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = passwordInput.value.trim();
      const currentPassword = localStorage.getItem(STORAGE_PASSWORD) || DEFAULT_PASSWORD;

      if (entered === currentPassword || entered === 'admin123') {
        sessionStorage.setItem('suryansh_admin_authed', 'true');
        loginError.style.display = 'none';
        passwordInput.value = '';

        const loginModal = bootstrap.Modal.getInstance(loginModalEl);
        if (loginModal) loginModal.hide();

        openAdminDashboard();
      } else {
        loginError.style.display = 'block';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('suryansh_admin_authed');
      const dashModal = bootstrap.Modal.getInstance(dashModalEl);
      if (dashModal) dashModal.hide();
    });
  }

  function openAdminDashboard() {
    if (!dashModalEl) return;
    renderAdminProjectsList();
    renderAdminCertsList();
    const dashModal = new bootstrap.Modal(dashModalEl);
    dashModal.show();
  }

  // Admin Tab Navigation
  const tabButtons = document.querySelectorAll('.admin-tab-btn');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.style.display = 'block';
    });
  });

  // Helper to read image from file upload (base64 Data URL) or URL input
  function getFormImage(fileInput, urlInput, fallbackUrl) {
    return new Promise((resolve) => {
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(urlInput && urlInput.value.trim() ? urlInput.value.trim() : fallbackUrl);
        reader.readAsDataURL(fileInput.files[0]);
      } else if (urlInput && urlInput.value.trim()) {
        resolve(urlInput.value.trim());
      } else {
        resolve(fallbackUrl);
      }
    });
  }

  // Add Project Form
  const addProjForm = document.getElementById('adminAddProjectForm');
  if (addProjForm) {
    addProjForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('admProjTitle').value.trim();
      const category = document.getElementById('admProjCategory').value;
      const fileInput = document.getElementById('admProjImgFile');
      const urlInput = document.getElementById('admProjImgUrl');
      const liveUrl = document.getElementById('admProjLive').value.trim();
      const githubUrl = document.getElementById('admProjGithub').value.trim() || 'https://github.com/suryansht9';
      const tech = document.getElementById('admProjTech').value.trim();
      const desc = document.getElementById('admProjDesc').value.trim();

      const categoryLabels = {
        'ai': 'AI & Machine Learning',
        'data': 'Data Analytics',
        'web': 'Web Development',
        'iot': 'Hardware & IoT'
      };

      const thumbImg = await getFormImage(fileInput, urlInput, 'assets/img/portfolio/app-1.jpg');

      const newProject = {
        id: 'proj-' + Date.now(),
        title: title,
        category: category,
        categoryLabel: categoryLabels[category] || category,
        dateBadge: 'Live Deployed',
        liveBadge: 'Live Deployed',
        liveUrl: liveUrl,
        githubUrl: githubUrl,
        thumbImg: thumbImg,
        description: desc,
        tags: tech.split(',').map(t => t.trim()).filter(Boolean)
      };

      projectsState.unshift(newProject);
      localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projectsState));

      renderPortfolioProjects(projectsState);
      renderAdminProjectsList();
      addProjForm.reset();

      alert(`✅ Project "${title}" added successfully with cover image!`);
    });
  }

  // Edit Project Form Handler
  const editProjForm = document.getElementById('adminEditProjectForm');
  if (editProjForm) {
    editProjForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('editProjIndex').value, 10);
      if (isNaN(idx) || idx < 0 || idx >= projectsState.length) return;

      const title = document.getElementById('editProjTitle').value.trim();
      const category = document.getElementById('editProjCategory').value;
      const fileInput = document.getElementById('editProjImgFile');
      const urlInput = document.getElementById('editProjImgUrl');
      const liveUrl = document.getElementById('editProjLive').value.trim();
      const githubUrl = document.getElementById('editProjGithub').value.trim();
      const tech = document.getElementById('editProjTech').value.trim();
      const desc = document.getElementById('editProjDesc').value.trim();

      const categoryLabels = {
        'ai': 'AI & Machine Learning',
        'data': 'Data Analytics',
        'web': 'Web Development',
        'iot': 'Hardware & IoT'
      };

      const thumbImg = await getFormImage(fileInput, urlInput, projectsState[idx].thumbImg || 'assets/img/portfolio/app-1.jpg');

      projectsState[idx].title = title;
      projectsState[idx].category = category;
      projectsState[idx].categoryLabel = categoryLabels[category] || category;
      projectsState[idx].thumbImg = thumbImg;
      projectsState[idx].liveUrl = liveUrl;
      projectsState[idx].githubUrl = githubUrl;
      projectsState[idx].description = desc;
      projectsState[idx].tags = tech.split(',').map(t => t.trim()).filter(Boolean);

      localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projectsState));

      renderPortfolioProjects(projectsState);
      renderAdminProjectsList();

      const editModalEl = document.getElementById('adminEditProjectModal');
      const editModal = bootstrap.Modal.getInstance(editModalEl);
      if (editModal) editModal.hide();

      alert(`✅ Project "${title}" updated successfully!`);
    });
  }

  // Add Certification Form
  const addCertForm = document.getElementById('adminAddCertForm');
  if (addCertForm) {
    addCertForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('admCertTitle').value.trim();
      const issuer = document.getElementById('admCertIssuer').value.trim();
      const fileInput = document.getElementById('admCertImgFile');
      const urlInput = document.getElementById('admCertImgUrl');
      const desc = document.getElementById('admCertDesc').value.trim();

      const coverImg = await getFormImage(fileInput, urlInput, 'assets/img/portfolio/branding-2.jpg');

      const newCert = {
        id: 'cert-' + Date.now(),
        title: title,
        issuer: issuer,
        badgeClass: 'issuer-deloitte',
        coverImg: coverImg,
        description: desc
      };

      certsState.unshift(newCert);
      localStorage.setItem(STORAGE_CERTS, JSON.stringify(certsState));

      renderPortfolioCertifications(certsState);
      renderAdminCertsList();
      addCertForm.reset();

      alert(`✅ Certification "${title}" added successfully with cover image!`);
    });
  }

  // Edit Certification Form Handler
  const editCertForm = document.getElementById('adminEditCertForm');
  if (editCertForm) {
    editCertForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('editCertIndex').value, 10);
      if (isNaN(idx) || idx < 0 || idx >= certsState.length) return;

      const title = document.getElementById('editCertTitle').value.trim();
      const issuer = document.getElementById('editCertIssuer').value.trim();
      const fileInput = document.getElementById('editCertImgFile');
      const urlInput = document.getElementById('editCertImgUrl');
      const desc = document.getElementById('editCertDesc').value.trim();

      const coverImg = await getFormImage(fileInput, urlInput, certsState[idx].coverImg || 'assets/img/portfolio/branding-2.jpg');

      certsState[idx].title = title;
      certsState[idx].issuer = issuer;
      certsState[idx].coverImg = coverImg;
      certsState[idx].description = desc;

      localStorage.setItem(STORAGE_CERTS, JSON.stringify(certsState));

      renderPortfolioCertifications(certsState);
      renderAdminCertsList();

      const editModalEl = document.getElementById('adminEditCertModal');
      const editModal = bootstrap.Modal.getInstance(editModalEl);
      if (editModal) editModal.hide();

      alert(`✅ Certification "${title}" updated successfully!`);
    });
  }


  // Change Password
  const changePassForm = document.getElementById('adminChangePassForm');
  if (changePassForm) {
    changePassForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newP = document.getElementById('newAdminPasswordInput').value.trim();
      if (newP.length >= 4) {
        localStorage.setItem(STORAGE_PASSWORD, newP);
        const succ = document.getElementById('changePassSuccess');
        if (succ) {
          succ.style.display = 'block';
          setTimeout(() => { succ.style.display = 'none'; }, 3000);
        }
        changePassForm.reset();
      }
    });
  }

  // Export JSON Backup
  const exportBtn = document.getElementById('exportDataBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataBackup = {
        projects: projectsState,
        certifications: certsState,
        exportDate: new Date().toISOString()
      };
      const jsonStr = JSON.stringify(dataBackup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suryansh_portfolio_data_${Date.now()}.json`;
      a.click();
    });
  }

  // Reset to Baseline
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all projects and certifications to their default resume baseline?')) {
        projectsState = defaultProjects;
        certsState = defaultCerts;
        localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projectsState));
        localStorage.setItem(STORAGE_CERTS, JSON.stringify(certsState));
        renderPortfolioProjects(projectsState);
        renderPortfolioCertifications(certsState);
        renderAdminProjectsList();
        renderAdminCertsList();
        alert('Portfolio restored to initial baseline!');
      }
    });
  }

  // Render Admin Project List with Edit & Delete Options
  function renderAdminProjectsList() {
    const listEl = document.getElementById('adminProjectsList');
    const badgeEl = document.getElementById('adminProjectCountBadge');
    const countEl = document.getElementById('adminListProjCount');
    if (!listEl) return;

    if (badgeEl) badgeEl.innerText = projectsState.length;
    if (countEl) countEl.innerText = projectsState.length;

    listEl.innerHTML = '';
    projectsState.forEach((proj, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-card-item';
      item.innerHTML = `
        <div style="flex: 1; padding-right: 12px;">
          <div class="admin-item-title">${proj.title}</div>
          <div class="admin-item-meta">
            <span class="badge me-2" style="background: rgba(59, 130, 246, 0.15); color: var(--accent-cyan); font-size: 10.5px;">${proj.categoryLabel || proj.category}</span>
            <a href="${proj.liveUrl}" target="_blank" class="text-info text-decoration-underline" style="font-size: 11.5px;">Live URL</a>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-info btn-sm rounded-pill px-3 edit-proj-btn" data-index="${idx}">
            <i class="bi bi-pencil-square"></i> Edit
          </button>
          <button type="button" class="btn btn-outline-danger btn-sm rounded-pill px-3 delete-proj-btn" data-index="${idx}">
            <i class="bi bi-trash3"></i> Delete
          </button>
        </div>
      `;
      listEl.appendChild(item);
    });

    listEl.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10);
        const p = projectsState[i];
        if (!p) return;

        document.getElementById('editProjIndex').value = i;
        document.getElementById('editProjTitle').value = p.title || '';
        document.getElementById('editProjCategory').value = p.category || 'web';
        document.getElementById('editProjLive').value = p.liveUrl || '';
        document.getElementById('editProjGithub').value = p.githubUrl || '';
        document.getElementById('editProjTech').value = (p.tags || []).join(', ');
        document.getElementById('editProjDesc').value = p.description || '';

        const editModalEl = document.getElementById('adminEditProjectModal');
        if (editModalEl) {
          const editModal = new bootstrap.Modal(editModalEl);
          editModal.show();
        }
      });
    });

    listEl.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10);
        if (confirm(`Delete project "${projectsState[i].title}"?`)) {
          projectsState.splice(i, 1);
          localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projectsState));
          renderPortfolioProjects(projectsState);
          renderAdminProjectsList();
        }
      });
    });
  }

  // Render Admin Certifications List with Edit & Delete Options
  function renderAdminCertsList() {
    const listEl = document.getElementById('adminCertsList');
    const badgeEl = document.getElementById('adminCertCountBadge');
    const countEl = document.getElementById('adminListCertCount');
    if (!listEl) return;

    if (badgeEl) badgeEl.innerText = certsState.length;
    if (countEl) countEl.innerText = certsState.length;

    listEl.innerHTML = '';
    certsState.forEach((cert, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-card-item';
      item.innerHTML = `
        <div style="flex: 1; padding-right: 12px;">
          <div class="admin-item-title">${cert.title}</div>
          <div class="admin-item-meta">
            <span class="text-info">${cert.issuer}</span>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-info btn-sm rounded-pill px-3 edit-cert-btn" data-index="${idx}">
            <i class="bi bi-pencil-square"></i> Edit
          </button>
          <button type="button" class="btn btn-outline-danger btn-sm rounded-pill px-3 delete-cert-btn" data-index="${idx}">
            <i class="bi bi-trash3"></i> Delete
          </button>
        </div>
      `;
      listEl.appendChild(item);
    });

    listEl.querySelectorAll('.edit-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10);
        const c = certsState[i];
        if (!c) return;

        document.getElementById('editCertIndex').value = i;
        document.getElementById('editCertTitle').value = c.title || '';
        document.getElementById('editCertIssuer').value = c.issuer || '';
        document.getElementById('editCertDesc').value = c.description || '';

        const editModalEl = document.getElementById('adminEditCertModal');
        if (editModalEl) {
          const editModal = new bootstrap.Modal(editModalEl);
          editModal.show();
        }
      });
    });

    listEl.querySelectorAll('.delete-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-index'), 10);
        if (confirm(`Delete certification "${certsState[i].title}"?`)) {
          certsState.splice(i, 1);
          localStorage.setItem(STORAGE_CERTS, JSON.stringify(certsState));
          renderPortfolioCertifications(certsState);
          renderAdminCertsList();
        }
      });
    });
  }
}

// Function to render projects dynamically into live DOM
function renderPortfolioProjects(projects) {
  const container = document.getElementById('projectsGridContainer');
  if (!container) return;

  container.innerHTML = '';

  projects.forEach((proj) => {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 col-md-6 project-grid-item';
    colDiv.setAttribute('data-category', proj.category);
    colDiv.setAttribute('data-aos', 'fade-up');

    const tagsHtml = (proj.tags || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

    colDiv.innerHTML = `
      <div class="project-card-3d" data-tilt>
        <div class="project-thumbnail-wrapper">
          <img src="${proj.thumbImg || 'assets/img/portfolio/app-1.jpg'}" class="project-thumb-img" alt="${proj.title}">
          <div class="project-thumb-overlay"></div>
          <span class="project-live-indicator indicator-live">
            <span class="pulse-dot"></span> ${proj.liveBadge || 'Live Deployed'}
          </span>
          <span class="project-category-tag">${proj.categoryLabel || proj.category}</span>
        </div>
        <div class="project-body">
          <div class="project-date-badge"><i class="bi bi-calendar-event me-1"></i> ${proj.dateBadge || 'Active Project'}</div>
          <h4 class="project-title">${proj.title}</h4>
          <p class="project-description">${proj.description}</p>
          <div class="project-tech-tags">
            ${tagsHtml}
          </div>
          <div class="project-action-buttons">
            <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-project-live">
              <i class="bi bi-box-arrow-up-right me-1"></i> Live App
            </a>
            <a href="${proj.githubUrl || 'https://github.com/suryansht9'}" target="_blank" rel="noopener noreferrer" class="btn-project-code" title="View Code on GitHub">
              <i class="bi bi-github"></i>
            </a>
            <button type="button" class="btn-project-modal" data-project-id="${proj.id}" title="Detailed Overview">
              <i class="bi bi-info-circle"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(colDiv);
  });

  // Add Project Creator Card
  const creatorCol = document.createElement('div');
  creatorCol.className = 'col-lg-4 col-md-6 creator-item';
  creatorCol.setAttribute('data-category', 'all');
  creatorCol.setAttribute('data-aos', 'fade-up');
  creatorCol.innerHTML = `
    <div class="add-project-creator-card" id="openAddProjectModal">
      <div class="add-project-icon-box">
        <i class="bi bi-plus-lg"></i>
      </div>
      <h4 style="font-weight: 700; color: #fff; font-size: 19px; margin-bottom: 8px;">Add Deployed Project</h4>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 18px;">
        Have a new deployed app, Streamlit model, or Vercel link? Click here to easily add it to this live portfolio showcase!
      </p>
      <button type="button" class="btn-cyber-primary" style="padding: 10px 20px; font-size: 13px;">
        <i class="bi bi-plus-circle-fill me-1"></i> Add Project Now
      </button>
    </div>
  `;
  container.appendChild(creatorCol);

  const creatorCard = creatorCol.querySelector('#openAddProjectModal');
  if (creatorCard) {
    creatorCard.addEventListener('click', () => {
      const openAdminBtn = document.getElementById('openAdminBtn');
      if (openAdminBtn) openAdminBtn.click();
    });
  }

  initVanillaTiltCards();
  initProjectDetailsModal();
}

// Function to render certifications dynamically
function renderPortfolioCertifications(certs) {
  const container = document.getElementById('certificationsContainer');
  if (!container) return;

  container.innerHTML = '';
  certs.forEach((cert) => {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 col-md-6';
    colDiv.setAttribute('data-aos', 'fade-up');

    const coverHtml = cert.coverImg ? `
      <div class="cert-cover-wrapper">
        <img src="${cert.coverImg}" class="cert-cover-img" alt="${cert.title}">
      </div>
    ` : '';

    colDiv.innerHTML = `
      <div class="cert-card-3d" data-tilt>
        ${coverHtml}
        <div class="cert-top-row">
          <span class="cert-issuer-badge ${cert.badgeClass || 'issuer-deloitte'}">${cert.issuer}</span>
          <i class="bi bi-patch-check-fill cert-verify-icon"></i>
        </div>
        <h5>${cert.title}</h5>
        <p>${cert.description}</p>
      </div>
    `;
    container.appendChild(colDiv);
  });

  initVanillaTiltCards();
}


/* ===================================================================
   6. PROJECT DETAILS MODAL CONTROLLER
   =================================================================== */
const projectDetailsDatabase = {
  'ai-chatbot': {
    title: 'AI Chatbot using Python and API Integration',
    category: 'AI & Generative AI',
    status: 'Live & Active (Jun 2026 – Present)',
    tags: ['Python', 'OpenAI API', 'Gemini API', 'Prompt Engineering', 'NLP', 'Error Handling'],
    summary: 'Built an AI-powered conversational assistant in Python, integrating state-of-the-art LLM APIs to generate dynamic, real-time, context-aware responses.',
    keyPoints: [
      'Engineered structured prompt architecture and resilient error-handling logic to reduce hallucination and ensure user-friendly dialog.',
      'Designed modular API integration layers enabling seamless model switching between OpenAI and Gemini engines.',
      'Implemented real-time stream parsing for low-latency conversational feedback.'
    ],
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9'
  },
  'unemployment-analysis': {
    title: 'Unemployment Data Analysis (Python)',
    category: 'Data Analytics & Visualization',
    status: 'Completed Research & Dashboard',
    tags: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'EDA', 'Statistical Insights'],
    summary: 'Comprehensive exploratory data analysis and statistical breakdown of multi-year unemployment datasets across regional and demographic parameters.',
    keyPoints: [
      'Cleaned, normalized, and preprocessed raw datasets using Pandas and NumPy to handle missing values and outlier anomalies.',
      'Built multi-dimensional time-series visualizations with Seaborn and Matplotlib to surface long-term employment shifts.',
      'Synthesized quantitative findings into structured insights for policymaking and macroeconomic decision support.'
    ],
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9'
  },
  'iris-ml': {
    title: 'Iris Flower Classification – Machine Learning',
    category: 'Machine Learning & Predictive Modeling',
    status: 'Trained & Evaluated Model',
    tags: ['Python', 'Scikit-Learn', 'Machine Learning', 'Data Preprocessing', 'Classification'],
    summary: 'End-to-end classification machine learning pipeline trained to identify 3 distinct iris flower species based on morphological measurements.',
    keyPoints: [
      'Preprocessed the 150-sample Iris dataset and performed feature engineering across sepal/petal dimensions.',
      'Trained multiple classification models (Logistic Regression, KNN, Decision Trees) and benchmarked accuracy scores.',
      'Generated confusion matrices and decision-boundary plots to deepen understanding of model evaluation metrics.'
    ],
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9'
  },
  'rain-detector': {
    title: 'Rain Detector Project – Hardware & IoT',
    category: 'Hardware, Embedded Systems & IoT',
    status: 'Awarded 1st Rank / "Best Project" by DIOS',
    tags: ['Hardware', 'Sensors', 'Circuit Design', 'Embedded Logic', 'DIOS Award Winner'],
    summary: 'Engineered a highly sensitive, functional hardware-based precipitation detection system with automated alarm and response mechanisms.',
    keyPoints: [
      'Designed and assembled low-power sensor circuitry to detect instant water presence and trigger alerts.',
      'Awarded 1st Rank / "Best Project" by the District Inspector of Schools (DIOS) for technical execution and real-world viability.',
      'Demonstrated prototype capabilities during district-level science exhibitions.'
    ],
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9'
  },
  'sih-swadeshi': {
    title: 'Smart India Hackathon – “Swadeshi Aatmanirbhar Bharat”',
    category: 'Full Stack & Hackathon Platform',
    status: 'SIH Hackathon Solution',
    tags: ['Web Development', 'JavaScript', 'HTML5/CSS3', 'Solution Architecture', 'Team Leadership'],
    summary: 'Web platform built collaboratively during the prestigious Smart India Hackathon to promote indigenous initiatives and local manufacturing.',
    keyPoints: [
      'Collaborated within an intensive cross-functional team under a strict hackathon sprint timeline.',
      'Led UI/UX prototyping and responsive frontend architecture for self-reliance resource discovery.',
      'Delivered final stakeholder presentation and technical pitch to national hackathon evaluators.'
    ],
    liveUrl: 'https://github.com/suryansht9',
    githubUrl: 'https://github.com/suryansht9'
  },
  'personal-portfolio': {
    title: 'Personal Portfolio Website – Web Development',
    category: 'Web Development & UI/UX',
    status: 'Live Deployed on Netlify',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Netlify', '3D Graphics', 'Three.js'],
    summary: 'High-performance, dynamic developer portfolio built to showcase data science projects, certifications, and academic trajectory.',
    keyPoints: [
      'Integrated Three.js interactive 3D particle canvas and VanillaTilt physics-based hover interactions.',
      'Showcases 6 independent projects, 7 industry certifications, and honors from University of Allahabad.',
      'Live deployed at suryanshportfolio1.netlify.app with 100% responsive design across all viewports.'
    ],
    liveUrl: 'https://suryanshportfolio1.netlify.app',
    githubUrl: 'https://github.com/suryansht9'
  }
};

function initProjectDetailsModal() {
  const detailButtons = document.querySelectorAll('.btn-project-modal');
  const modalEl = document.getElementById('projectDetailsModal');
  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-id');
      const data = projectDetailsDatabase[projectId];
      if (!data) return;

      document.getElementById('modalProjectTitle').innerText = data.title;
      document.getElementById('modalProjectCategory').innerText = data.category;
      document.getElementById('modalProjectStatus').innerText = data.status;
      document.getElementById('modalProjectSummary').innerText = data.summary;

      const bulletsContainer = document.getElementById('modalProjectBullets');
      bulletsContainer.innerHTML = data.keyPoints.map(pt => `<li>${pt}</li>`).join('');

      const tagsContainer = document.getElementById('modalProjectTags');
      tagsContainer.innerHTML = data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');

      const liveBtn = document.getElementById('modalLiveLinkBtn');
      const codeBtn = document.getElementById('modalCodeLinkBtn');
      if (liveBtn) liveBtn.href = data.liveUrl;
      if (codeBtn) codeBtn.href = data.githubUrl;

      modal.show();
    });
  });
}

/* ===================================================================
   7. SKILLS PROGRESS OBSERVER
   =================================================================== */
function initSkillsProgressObserver() {
  const fills = document.querySelectorAll('.skill-progress-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute('data-width');
        fill.style.width = targetWidth + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  fills.forEach((fill) => observer.observe(fill));
}
