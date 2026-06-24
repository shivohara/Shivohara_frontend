import { useState, useEffect, useRef } from 'react';
import ParticleNetwork from './components/ParticleNetwork';
import CareersPage from './components/CareersPage';

const API_BASE_URL = 'https://shivohara-backend-1.onrender.com/api';

// Project Portfolio Data
const PROJECTS = [
  {
    id: 1,
    title: "Founder's Mart",
    description: "A gamified student marketplace and e-commerce platform developed for Alliance University's Entrepreneurship Cell (E-Cell).",
    image: '/ecell.jpg',
    imageBackground: '#ffffff',
    objectFit: 'contain',
    padding: '1.25rem',
    categories: ['web-mobile', 'products'],
    link: 'https://ecellstore.com'
  },
  {
    id: 2,
    title: 'Velish',
    description: 'A campus food ordering and smart cafeteria management platform designed for colleges and universities.',
    image: '/velish.png',
    imageBackground: '#000000',
    objectFit: 'contain',
    padding: '1.25rem',
    categories: ['web-mobile', 'products', 'ai'],
    link: 'https://velish.in'
  }
];

// Services Data
const SERVICES = [
  {
    id: 0,
    title: 'Web Applications',
    description: 'Responsive, lightning-fast web experiences engineered with modern core APIs. We build custom admin dashboards, SaaS applications, and interactive portals.',
    features: ['SPA & SSR architectures', 'Sleek, fluid user interfaces', 'Optimized LCP & INP metrics'],
    icon: 'web'
  },
  {
    id: 1,
    title: 'Mobile Applications',
    description: 'High-fidelity applications optimized for both Android and iOS platforms. Native Swift, Kotlin, and highly performant cross-platform frameworks.',
    features: ['iOS & Android Native Dev', 'Fluid gestures and visuals', 'Store release orchestration'],
    icon: 'mobile'
  },
  {
    id: 2,
    title: 'Ecommerce Solutions',
    description: 'Secure, highly transactional ecommerce platforms and mobile applications. Integrations with advanced payment gateways and dynamic inventories.',
    features: ['High-speed checkout flows', 'Secure billing integrations', 'Custom catalog scaling'],
    icon: 'ecommerce'
  },
  {
    id: 3,
    title: 'Database Services',
    description: 'Robust database schemas, data warehouses, and query optimizations. We construct scalable relational tables and real-time database syncing channels.',
    features: ['PostgreSQL & NoSQL designs', 'Sharding & read-replication', 'Real-time synchronization'],
    icon: 'database'
  },
  {
    id: 4,
    title: 'Automated Testing',
    description: 'Rigorous test automation structures ensuring software stability. Unit, integration, visual regression, and load testing configurations.',
    features: ['E2E Test Suites', 'CI/CD pipeline hooks', 'Security and load audits'],
    icon: 'testing'
  },
  {
    id: 5,
    title: 'Digital Marketing',
    description: 'Amplify your digital presence. Technical SEO structures, precision search optimization, performance marketing, and analytics setups.',
    features: ['SEO audit & page optimizations', 'Conversion rate analytics', 'Targeted campaign marketing'],
    icon: 'marketing'
  }
];

const SERVICE_ICONS = {
  web: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="7" x2="8.01" y2="7" /><line x1="12" y1="7" x2="12.01" y2="7" /><line x1="16" y1="7" x2="16.01" y2="7" /></svg>
  ),
  mobile: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
  ),
  ecommerce: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
  ),
  database: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></svg>
  ),
  testing: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></svg>
  ),
  marketing: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3" /></svg>
  )
};

// Team Data
const TEAM_MEMBERS = [
  { id: 1, name: "UDAY SANKAR NASINA", role: "Founder", desc: "Spearheading our vision to build scalable, intelligent architectures for the next generation of digital products.", img: "/uday.png" },
  { id: 2, name: "MARUVENI CHARAN", role: "UI/UX Designer", desc: "Crafting intuitive, highly aesthetic digital experiences that bridge the gap between complex engineering and human interaction.", img: "/charan.png" },
  { id: 3, name: "THOLUCHURU SHNMUKA GANGA MAHESH", role: "Flutter Developer", desc: "Engineering fluid, native-feeling cross-platform mobile applications that perform flawlessly under heavy computational loads.", img: "/mahesh.png" },
  { id: 4, name: "DASIREDDY VISHNU KIRAN REDDY", role: "Frontend Developer", desc: "Building highly interactive, performance-optimized client-side applications using modern component architectures and micro-frontends.", img: "/vishnu.png" },
  { id: 5, name: "MANE VEDANTH", role: "Backend Developer", desc: "Architecting resilient server-side systems, optimizing database query pipelines, and ensuring deep infrastructure security.", img: "/vedant.png" },
  { id: 6, name: "POTHIREDDY VENKATESWARA REDDY", role: "Backend Developer", desc: "Scaling data layers and building ultra-fast APIs to handle massive concurrency without sacrificing data integrity.", img: "/venky.png" }
];

export default function App() {
  // --- State Hooks ---
  const [view, setView] = useState('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [scaleStep, setScaleStep] = useState(1); // Steps: 1, 2, 3
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [teamAnimKey, setTeamAnimKey] = useState(0);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#careers') {
        setView('careers');
        window.scrollTo(0, 0);
      } else {
        setView('home');
        if (hash && hash.startsWith('#')) {
          const id = hash.slice(1);
          let attempts = 0;
          const maxAttempts = 15;
          
          const tryScroll = () => {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else if (attempts < maxAttempts) {
              attempts++;
              requestAnimationFrame(tryScroll);
            }
          };
          
          setTimeout(tryScroll, 50);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    type: '', // 'success' or 'error'
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const teamTrackRef = useRef(null);
  const capabilitiesGridRef = useRef(null);
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);

  // Refs to prevent scroll event fight during programmatic carousel slides
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // --- Team Section Scroll Observer ---
  useEffect(() => {
    if (!teamTrackRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isProgrammaticScrollRef.current) {
          const idx = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(idx) && idx !== currentTeamIndex) {
            setCurrentTeamIndex(idx);
            setTeamAnimKey(k => k + 1);
          }
        }
      });
    }, {
      root: teamTrackRef.current,
      threshold: 0.6 // Trigger when 60% of the slide is visible
    });

    const slides = teamTrackRef.current.querySelectorAll('.team-carousel-slide');
    slides.forEach(slide => observer.observe(slide));

    return () => observer.disconnect();
  }, [currentTeamIndex, view]);

  const scrollToTeamMember = (index) => {
    if (!teamTrackRef.current) return;
    const slides = teamTrackRef.current.querySelectorAll('.team-carousel-slide');
    if (slides[index]) {
      isProgrammaticScrollRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      
      setCurrentTeamIndex(index);
      setTeamAnimKey(k => k + 1);

      slides[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    }
  };

  const scrollTeamCarousel = (direction) => {
    let targetIndex;
    if (direction === 'next') {
      targetIndex = currentTeamIndex >= TEAM_MEMBERS.length - 1 ? 0 : currentTeamIndex + 1;
    } else {
      targetIndex = currentTeamIndex <= 0 ? TEAM_MEMBERS.length - 1 : currentTeamIndex - 1;
    }
    scrollToTeamMember(targetIndex);
  };

  const handleCapabilityScroll = (e) => {
    const track = e.currentTarget;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return;
    const scrollPct = track.scrollLeft / maxScroll;
    const newIndex = Math.min(3, Math.max(0, Math.round(scrollPct * 3)));
    setActiveCapabilityIndex(newIndex);
  };

  const scrollToCapability = (idx) => {
    if (!capabilitiesGridRef.current) return;
    const track = capabilitiesGridRef.current;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const targetScroll = (idx / 3) * maxScroll;
    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveCapabilityIndex(idx);
  };

  // --- Scroll Timeline Observer Fallback ---
  useEffect(() => {
    const supportsScrollTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    const scrollElements = document.querySelectorAll('.reveal-on-scroll');

    let observer;

    if (!supportsScrollTimeline && scrollElements.length > 0) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              // Unobserve once revealed
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.1
        }
      );

      scrollElements.forEach((el) => {
        el.classList.add('reveal-fallback');
        observer.observe(el);
      });
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [view]);

  // --- Philosophy Section Animation Scroll Observer ---
  useEffect(() => {
    const section = document.getElementById('philosophy');
    if (section) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            section.classList.add('animate-philosophy');
          } else {
            section.classList.remove('animate-philosophy');
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(section);
      return () => observer.disconnect();
    }
  }, [view]);

  useEffect(() => {
    const el = document.querySelector('.footer-big-brand');
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-up');
        } else {
          el.classList.remove('animate-up');
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 50px 0px',
        threshold: 0.05
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [view]);

  // --- AI Lab Section Scroll Animation Observer ---
  useEffect(() => {
    const aiLabSection = document.getElementById('ai-lab');
    if (!aiLabSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          aiLabSection.classList.add('ai-lab-in-view');
        } else {
          aiLabSection.classList.remove('ai-lab-in-view');
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.05
      }
    );

    observer.observe(aiLabSection);
    return () => observer.disconnect();
  }, [view]);

  // --- Scale Section Scroll Animation Observer ---
  useEffect(() => {
    const scaleSection = document.getElementById('scale');
    if (!scaleSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scaleSection.classList.add('scale-in-view');
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.15
      }
    );

    observer.observe(scaleSection);
    return () => observer.disconnect();
  }, [view]);

  // --- Contact Section Scroll Animation Observer ---
  useEffect(() => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          contactSection.classList.add('contact-in-view');
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.15
      }
    );

    observer.observe(contactSection);
    return () => observer.disconnect();
  }, [view]);

  // --- Team Section Scroll Animation Observer ---
  useEffect(() => {
    const teamSection = document.getElementById('team');
    if (!teamSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          teamSection.classList.add('team-in-view');
        } else {
          teamSection.classList.remove('team-in-view');
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.15
      }
    );

    observer.observe(teamSection);
    return () => observer.disconnect();
  }, [view]);

  // --- Portfolio Section Scroll Animation Observer ---
  useEffect(() => {
    const portfolioSection = document.getElementById('portfolio');
    if (!portfolioSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          portfolioSection.classList.add('portfolio-in-view');
        } else {
          portfolioSection.classList.remove('portfolio-in-view');
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.1
      }
    );

    observer.observe(portfolioSection);
    return () => observer.disconnect();
  }, [view]);

  // --- Services Section Scroll Animation Observer ---
  useEffect(() => {
    const servicesSection = document.getElementById('services');
    if (!servicesSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          servicesSection.classList.add('services-in-view');
        } else {
          servicesSection.classList.remove('services-in-view');
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.1
      }
    );

    observer.observe(servicesSection);
    return () => observer.disconnect();
  }, [view]);

  // --- Actions & Helpers ---
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
    document.body.style.overflow = !isMobileNavOpen ? 'hidden' : '';
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    document.body.style.overflow = '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: '', message: '' });

    // Validate using browser API validity flags
    const formEl = formRef.current;
    if (!formEl.checkValidity()) {
      // Force individual field visual error triggers
      const inputs = formEl.querySelectorAll('.form-input, .form-textarea');
      inputs.forEach(input => {
        // Triggers the :user-invalid state representation in native forms
        input.dispatchEvent(new Event('blur'));
      });
      setFormStatus({
        type: 'error',
        message: 'Please fill out all required fields correctly.'
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit your inquiry.');
      }

      setFormStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. We will get in touch soon.'
      });
      setFormData({
        name: '',
        email: '',
        serviceType: '',
        message: ''
      });
    } catch (err) {
      console.error('Inquiry submit error:', err);
      setFormStatus({
        type: 'error',
        message: err.message || 'An error occurred while submitting your inquiry. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic values based on scale step slider
  const getScaleStageClass = () => {
    if (scaleStep === 1) return 'stage-1';
    if (scaleStep === 3) return 'stage-3';
    return 'stage-2'; // default 2
  };

  return (
    <>
      {view !== 'admin' && (
        <header className="site-header">
          <div className="container nav-container">
            <a href="#" className="logo" onClick={closeMobileNav}>
              <img src="/logo_web_bg.png" alt="SHIVOHARA Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
            </a>

            <nav className="nav-links">
              <ul>
                <li><a href="#services">Services</a></li>
                <li><a href="#ai-lab">AI Lab</a></li>
                <li><a href="#scale">Our Scale</a></li>
                <li><a href="#portfolio">Projects</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>

            <button
              className={`mobile-nav-toggle ${isMobileNavOpen ? 'active' : ''}`}
              onClick={toggleMobileNav}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileNavOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>
      )}

      {view !== 'admin' && (
        <div className={`mobile-menu ${isMobileNavOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="#services" onClick={closeMobileNav}>Services</a></li>
            <li><a href="#ai-lab" onClick={closeMobileNav}>AI Lab</a></li>
            <li><a href="#scale" onClick={closeMobileNav}>Our Scale</a></li>
            <li><a href="#portfolio" onClick={closeMobileNav}>Projects</a></li>
            <li><a href="#careers" onClick={closeMobileNav}>Careers</a></li>
            <li><a href="#contact" onClick={closeMobileNav}>Contact</a></li>
          </ul>
        </div>
      )}

      {view === 'home' && (
        <main>
          {/* ==========================================
               Hero Section
               ========================================== */}
          <section
          className="hero"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
        >
          <div className="hero-bg">
            <ParticleNetwork />
          </div>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="hero-content" style={{ maxWidth: '800px', marginInline: 'auto' }}>
              <span className="hero-tagline" style={{ justifyContent: 'center' }}>Transformation Through Intelligence</span>
              <h1 className="hero-title">Engineering the <span className="gradient-text">Conscious Future</span> of Tech</h1>
              <p className="hero-description">We combine cutting-edge Artificial Intelligence with robust, high-scale software engineering. From early startups to massive enterprises, we construct the systems of tomorrow.</p>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <a href="#contact" className="btn btn-primary">Partner With Us</a>
                <a href="#services" className="btn btn-secondary">Explore Capabilities</a>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
             Philosophy Section
             ========================================== */}
        <section className="philosophy-section reveal-on-scroll" id="philosophy" style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>

          {/* Tech Circuit Graphics */}
          <div className="tech-circuit tech-circuit-left">
            <svg width="300" height="150" viewBox="0 0 300 150" fill="none" stroke="#000" strokeWidth="1.5" strokeOpacity="0.15">
              <path d="M-10 20 L50 20 L70 40 L150 40 L160 30 L220 30" />
              <circle cx="220" cy="30" r="3" fill="#000" />
              <path d="M-10 60 L80 60 L100 80 L180 80 L190 70 L260 70" />
              <circle cx="260" cy="70" r="3" fill="#000" />
              <path d="M-10 100 L40 100 L60 120 L120 120" />
              <circle cx="120" cy="120" r="3" fill="#000" />
            </svg>
          </div>
          <div className="tech-circuit tech-circuit-right">
            <svg width="300" height="150" viewBox="0 0 300 150" fill="none" stroke="#000" strokeWidth="1.5" strokeOpacity="0.15">
              <path d="M310 30 L250 30 L230 50 L150 50 L140 40 L80 40" />
              <circle cx="80" cy="40" r="3" fill="#000" />
              <path d="M310 70 L220 70 L200 90 L120 90 L110 80 L40 80" />
              <circle cx="40" cy="80" r="3" fill="#000" />
              <path d="M310 110 L260 110 L240 130 L180 130" />
              <circle cx="180" cy="130" r="3" fill="#000" />
            </svg>
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>

            {/* Top Editorial Header */}
            <div className="philosophy-header" style={{ maxWidth: '900px', margin: '0 auto 6rem auto', textAlign: 'center' }}>
              <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, margin: '1.5rem 0', fontWeight: 500, letterSpacing: '-1.5px', color: '#000' }}>
                Bridging Pure Innovation<br />and <i style={{ fontStyle: 'italic', fontWeight: 400 }}>Reliability</i>
              </h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                The word <strong>SHIVOHARA</strong> stands for infinite consciousness and transformation. At our core, we translate that energy into software engineering—transforming complex, fragmented data and legacy architectures into sleek, intelligent, and scalable digital ecosystems.
              </p>
            </div>

            {/* Bottom 3-Column Features Grid */}
            <div className="editorial-features-grid">

              <div className="editorial-feature">
                <div className="feature-header-wrap">
                  <div className="feature-number">01</div>
                  <div className="feature-icon-ring">
                    {/* Cube Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                </div>
                <h3>Transformative Architecture</h3>
                <p>We build codebases designed to adapt, scale, and thrive under absolute maximum load. Precision engineering from the database to the edge.</p>
              </div>

              <div className="editorial-feature">
                <div className="feature-header-wrap">
                  <div className="feature-number">02</div>
                  <div className="feature-icon-ring">
                    {/* AI Brain Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></svg>
                  </div>
                </div>
                <h3>AI-First Integration</h3>
                <p>We don't just add AI; we engineer systems around intelligence workflows. Deep neural integration for predictive and generative capabilities.</p>
              </div>

              <div className="editorial-feature">
                <div className="feature-header-wrap">
                  <div className="feature-number">03</div>
                  <div className="feature-icon-ring">
                    {/* Globe Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                  </div>
                </div>
                <h3>Full-Spectrum Support</h3>
                <p>From initial abstract design to continuous automated testing, global marketing reach, and zero-downtime deployment pipelines.</p>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================
             Services Section
             ========================================== */}
        <section className="services-section reveal-on-scroll" id="services">
          <div className="container">
            {/* Sticky Scroll Services Layout */}
            <div className="services-sticky-layout">
              <div className="services-sticky-sidebar">
                <span className="section-tagline">Core Capabilities</span>
                <h2 className="section-title word-reveal-title">
                  <span className="word-wrapper">
                    <span className="word">Our</span>
                  </span>
                  <span className="word-wrapper">
                    <span className="word">Development</span>
                  </span>
                  <span className="word-wrapper">
                    <span className="word">&</span>
                  </span>
                  <span className="word-wrapper">
                    <span className="word">Engineering</span>
                  </span>
                  <span className="word-wrapper">
                    <span className="word">Services</span>
                  </span>
                </h2>
                <p>End-to-end expertise designed to scale your digital products securely and beautifully.</p>
              </div>

              <div className="services-scroll-content">
                {SERVICES.map((service, index) => (
                  <div className="service-scroll-card" key={service.id}>
                    <div className="service-scroll-header">
                      <div className="service-scroll-icon">
                        {SERVICE_ICONS[service.icon]}
                      </div>
                      <div className="service-scroll-number">0{index + 1}</div>
                    </div>
                    <h3 className="service-scroll-title">{service.title}</h3>
                    <p className="service-scroll-desc">{service.description}</p>
                    <ul className="service-scroll-features">
                      {service.features.map((f, i) => (
                        <li key={i}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
             AI & Data Science Lab
             ========================================== */}
        <section className="ai-lab-section" id="ai-lab">
          <div className="container">
            {/* Top Area: Animated Hero */}
            <div className="ai-lab-hero ai-lab-animate">
              <span className="section-tagline ai-lab-animate-item" style={{ display: 'block', marginBottom: '1rem', color: 'var(--accent-violet)', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.85rem', fontWeight: 600 }}>AI & ML Lab</span>
              <h2 className="section-title word-reveal-title">
                <span className="word-wrapper">
                  <span className="word">Cognitive</span>
                </span>
                <span className="word-wrapper">
                  <span className="word">Intelligence</span>
                </span>
                <span className="word-wrapper">
                  <span className="word">Integration</span>
                </span>
              </h2>
              <p className="ai-lab-animate-item">We build custom neural systems, automated agent actions, and high-yield data science assets to unlock automated growth.</p>
            </div>

            {/* Middle Area: Core Capabilities Header */}
            <div className="core-capabilities-header ai-lab-animate">
              <h2 className="ai-lab-animate-item">Our Core Capabilities</h2>
              <p className="ai-lab-animate-item">Precision-engineered solutions for the next generation of Industrial Intelligence.</p>
            </div>

            {/* Bottom Area: Bento Grid */}
            <div className="ai-bento-grid" ref={capabilitiesGridRef} onScroll={handleCapabilityScroll}>
              
              {/* Card 1: AI and ML Applications (Wide) */}
              <div className="bento-card bento-card-wide ai-lab-animate">
                <div className="bento-card-glow"></div>
                <div className="bento-card-content-wrap">
                  <div className="bento-card-text">
                    <span className="ai-card-tag">Core Applications</span>
                    <h3>AI and ML Applications</h3>
                    <p>Custom LLM tooling, natural language processors, image recognition software, and reinforcement systems integrated into existing applications.</p>
                  </div>
                  <div className="bento-card-visual">
                    <div className="saas-console">
                      <div className="console-header">
                        <span className="dot dot-red"></span>
                        <span className="dot dot-yellow"></span>
                        <span className="dot dot-green"></span>
                        <span className="console-title">agent-stream.json</span>
                      </div>
                      <div className="console-body">
                        <div className="code-line prompt-line">
                          <span className="code-prompt">&gt;</span> shivohara --model active
                        </div>
                        <div className="code-response">
                          <span className="key">"status"</span>: <span className="val-string">"running"</span>,<br />
                          <span className="key">"latency"</span>: <span className="val-number">12ms</span>,<br />
                          <span className="key">"throughput"</span>: <span className="val-string">"98.4k/s"</span>,<br />
                          <span className="key">"sync"</span>: <span className="val-boolean">true</span>
                          <span className="console-cursor">_</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: AI & ML Projects (Narrow) */}
              <div className="bento-card ai-lab-animate">
                <div className="bento-card-glow"></div>
                <div className="bento-card-content-wrap">
                  <div className="bento-card-text">
                    <span className="ai-card-tag">Specialized Projects</span>
                    <h3>AI & ML Projects</h3>
                    <p>Research-driven implementations, specialized fine-tuning models, multi-agent frameworks, and vector search retrievals tailored for industry niches.</p>
                  </div>
                  <div className="bento-card-visual">
                    <div className="saas-coordinates-box">
                      <svg width="180" height="130" viewBox="0 0 180 130" className="coordinates-svg" fill="none">
                        {/* 3D Grid */}
                        <line x1="20" y1="110" x2="160" y2="110" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
                        <line x1="40" y1="80" x2="150" y2="80" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
                        <line x1="60" y1="50" x2="140" y2="50" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                        
                        <line x1="20" y1="110" x2="60" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                        <line x1="90" y1="110" x2="90" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                        <line x1="160" y1="110" x2="140" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />

                        {/* Clusters */}
                        <ellipse cx="60" cy="70" rx="20" ry="12" stroke="rgba(0, 188, 212, 0.25)" strokeDasharray="3 3" className="cluster-outline" />
                        <ellipse cx="130" cy="85" rx="25" ry="15" stroke="rgba(139, 92, 246, 0.25)" strokeDasharray="3 3" className="cluster-outline" />

                        {/* Similarity link */}
                        <line x1="60" y1="70" x2="130" y2="85" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1.2" strokeDasharray="2 2" />

                        {/* Nodes */}
                        <circle cx="55" cy="72" r="3" fill="var(--accent-cyan)" className="coord-point" />
                        <circle cx="65" cy="66" r="3.5" fill="var(--accent-cyan)" className="coord-point" />
                        <circle cx="125" cy="88" r="3.5" fill="var(--accent-violet)" className="coord-point" />
                        <circle cx="140" cy="80" r="3" fill="var(--accent-violet)" className="coord-point" />

                        <text x="45" y="40" fill="rgba(0,0,0,0.4)" fontSize="8" fontFamily="monospace">c_0</text>
                        <text x="135" y="115" fill="rgba(0,0,0,0.4)" fontSize="8" fontFamily="monospace">c_1</text>
                      </svg>
                      <div className="coordinates-readout">
                        <span className="cos-label">cos_sim:</span> <span className="cos-val">0.984</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Data Science Projects (Narrow) */}
              <div className="bento-card ai-lab-animate">
                <div className="bento-card-glow"></div>
                <div className="bento-card-content-wrap">
                  <div className="bento-card-text">
                    <span className="ai-card-tag">Data Exploration</span>
                    <h3>Data Science Projects</h3>
                    <p>Advanced predictive algorithms, visual analytics dashboards, business intelligence patterns, and data engineering pipelines to extract actionable wisdom.</p>
                  </div>
                  <div className="bento-card-visual">
                    <div className="saas-metrics-card">
                      <div className="metrics-summary">
                        <div className="metric-headline">
                          <span className="metric-number">99.98%</span>
                          <span className="status-badge badge-success"></span>
                        </div>
                        <span className="metric-desc">Service Level SLA</span>
                      </div>
                      <div className="metrics-chart-box">
                        <svg width="180" height="70" viewBox="0 0 180 70" className="stripe-chart-svg" fill="none">
                          <line x1="0" y1="55" x2="180" y2="55" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                          <line x1="0" y1="25" x2="180" y2="25" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                          
                          <path d="M 0 55 Q 30 40, 60 45 T 120 18 T 180 8" stroke="url(#cyan-violet-grad-metrics)" strokeWidth="2" fill="none" />
                          <path d="M 0 55 Q 30 40, 60 45 T 120 18 T 180 8 L 180 70 L 0 70 Z" fill="url(#cyan-violet-grad-metrics-area)" />

                          <circle cx="120" cy="18" r="4.5" className="metrics-tooltip-dot" />

                          <defs>
                            <linearGradient id="cyan-violet-grad-metrics" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="var(--accent-cyan)" />
                              <stop offset="100%" stopColor="var(--accent-violet)" />
                            </linearGradient>
                            <linearGradient id="cyan-violet-grad-metrics-area" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(0, 188, 212, 0.08)" />
                              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="metrics-tooltip">
                          <span className="tt-label">latency:</span> <span className="tt-val">12ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: AI Automation (Wide) */}
              <div className="bento-card bento-card-wide ai-lab-animate">
                <div className="bento-card-glow"></div>
                <div className="bento-card-content-wrap">
                  <div className="bento-card-text">
                    <span className="ai-card-tag">Workflow Automation</span>
                    <h3>AI Automation</h3>
                    <p>Integrate AI-driven workflows (RPA, smart document routers, automated support assistants) to accelerate your business execution and reduce errors.</p>
                  </div>
                  <div className="bento-card-visual">
                    <div className="saas-workflow-board">
                      {/* Node 1 */}
                      <div className="workflow-card-node node-status-success">
                        <div className="node-icon-box cyan-bg">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7l7 5z" /></svg>
                        </div>
                        <div className="node-details">
                          <span className="node-title">Webhook Ingest</span>
                          <span className="node-sub">active</span>
                        </div>
                      </div>

                      {/* Connection wire 1 */}
                      <div className="workflow-connector">
                        <svg width="30" height="20" viewBox="0 0 30 20" className="wire-svg">
                          <path d="M 0 10 L 30 10" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1.5" />
                          <circle cx="15" cy="10" r="3" fill="var(--accent-violet)" className="wire-pulse-dot" />
                        </svg>
                      </div>

                      {/* Node 2 */}
                      <div className="workflow-card-node node-status-active">
                        <div className="node-icon-box violet-bg">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <div className="node-details">
                          <span className="node-title">LLM Router</span>
                          <span className="node-sub">processing</span>
                        </div>
                      </div>

                      {/* Connection wire 2 */}
                      <div className="workflow-connector">
                        <svg width="30" height="20" viewBox="0 0 30 20" className="wire-svg">
                          <path d="M 0 10 L 30 10" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1.5" />
                          <circle cx="15" cy="10" r="3" fill="var(--accent-cyan)" className="wire-pulse-dot-alt" />
                        </svg>
                      </div>

                      {/* Node 3 */}
                      <div className="workflow-card-node node-status-pending">
                        <div className="node-icon-box gray-bg">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10zM12 6v6l4 2" /></svg>
                        </div>
                        <div className="node-details">
                          <span className="node-title">DB Sync</span>
                          <span className="node-sub">queued</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Dots Indicator for mobile view */}
            <div className="capabilities-dots">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  className={`capability-dot ${activeCapabilityIndex === idx ? 'active' : ''}`}
                  onClick={() => scrollToCapability(idx)}
                  aria-label={`Go to capability card ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
             Product Scale Section (Interactive)
             ========================================== */}
        <section className="scale-section" id="scale">
          <div className="container scale-card-wrapper">
            <div className="section-header scale-animate">
              <span className="section-tagline scale-animate-item">Architected to Grow</span>
              <h2 className="section-title scale-animate-item">Small Scale to Big Scale Products</h2>
              <p className="scale-animate-item">Our solutions grow dynamically as your user base and data volumes scale. Drag the slider below to see how our engineering patterns evolve.</p>
            </div>

            <div className={`scale-visualizer-container ${getScaleStageClass()} scale-animate`} id="scale-container">
              <div className="scale-control-panel scale-animate-item">
                <h3>Scale Evolution</h3>
                <p style={{ marginBottom: '1.5rem' }}>Select your current project stage to see the corresponding tech setup and architecture patterns we implement:</p>

                <div className="scale-slider-wrapper">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={scaleStep}
                    className="scale-slider"
                    onChange={(e) => setScaleStep(parseInt(e.target.value, 10))}
                    aria-label="Scale level slider"
                  />
                  <div className="scale-labels">
                    <span id="label-step-1" className={scaleStep === 1 ? 'active' : ''}>1. MVP / Startup</span>
                    <span id="label-step-2" className={scaleStep === 2 ? 'active' : ''}>2. Growth Scale</span>
                    <span id="label-step-3" className={scaleStep === 3 ? 'active' : ''}>3. Enterprise Scale</span>
                  </div>
                </div>

                <div className="scale-details">
                  {/* Step 1 details */}
                  <div className={`scale-step-content ${scaleStep === 1 ? 'active' : ''}`}>
                    <h3>MVP & Launch</h3>
                    <p>Perfect for early products and validate-first ideas. Fast, lightweight serverless configurations, single database hubs, and key features built for rapid user acquisition and early pivots.</p>
                  </div>

                  {/* Step 2 details */}
                  <div className={`scale-step-content ${scaleStep === 2 ? 'active' : ''}`}>
                    <h3>Growth Infrastructure</h3>
                    <p>Engineered for products with steady user growth. Load balanced micro-services, regional CDNs, automated unit/integration testing pipelines, and cached database queries to ensure rapid load speeds.</p>
                  </div>

                  {/* Step 3 details */}
                  <div className={`scale-step-content ${scaleStep === 3 ? 'active' : ''}`}>
                    <h3>Enterprise Scale</h3>
                    <p>Designed for millions of transactions. Multi-region redundancy, globally synchronized database systems, autonomous AI agents for workflow automation, and extreme high-concurrency tolerance.</p>
                  </div>
                </div>
              </div>

              {/* Visual feedback grid panel */}
              <div className="scale-visual-panel scale-animate-item">
                <div className="topology-container">
                  <svg className="topo-svg" viewBox="0 0 300 280">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.58 0.15 200 / 0.4)" />
                      </marker>
                      <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-cyan)" />
                      </marker>
                    </defs>

                    {scaleStep === 1 && (
                      <g className="topo-group">
                        <line x1="150" y1="80" x2="150" y2="190" className="topo-link-path active" markerEnd="url(#arrow-active)" />

                        <g transform="translate(100, 40)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">App Instance</text>
                        </g>

                        <g transform="translate(100, 200)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Postgres DB</text>
                        </g>
                      </g>
                    )}

                    {scaleStep === 2 && (
                      <g className="topo-group">
                        <line x1="150" y1="50" x2="80" y2="100" className="topo-link-path active" markerEnd="url(#arrow-active)" />
                        <line x1="150" y1="50" x2="220" y2="100" className="topo-link-path active" markerEnd="url(#arrow-active)" />

                        <line x1="80" y1="140" x2="110" y2="200" className="topo-link-path active" markerEnd="url(#arrow-active)" />
                        <line x1="220" y1="140" x2="190" y2="200" className="topo-link-path active" markerEnd="url(#arrow-active)" />

                        <g transform="translate(100, 10)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Load Balancer</text>
                        </g>

                        <g transform="translate(30, 100)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Web Server A</text>
                        </g>

                        <g transform="translate(170, 100)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Web Server B</text>
                        </g>

                        <g transform="translate(100, 200)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">DB + Redis Cache</text>
                        </g>
                      </g>
                    )}

                    {scaleStep === 3 && (
                      <g className="topo-group">
                        <line x1="150" y1="50" x2="70" y2="100" className="topo-link-path active" />
                        <line x1="150" y1="50" x2="230" y2="100" className="topo-link-path active" />

                        <line x1="70" y1="140" x2="70" y2="190" className="topo-link-path active" />
                        <line x1="230" y1="140" x2="230" y2="190" className="topo-link-path active" />
                        <line x1="120" y1="210" x2="180" y2="210" className="topo-link-path active" />

                        <g transform="translate(100, 10)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Global Gateway</text>
                        </g>

                        <g transform="translate(20, 100)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Region A Nodes</text>
                        </g>

                        <g transform="translate(180, 100)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Region B Nodes</text>
                        </g>

                        <g transform="translate(20, 190)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Master DB + Sync</text>
                        </g>

                        <g transform="translate(180, 190)">
                          <rect width="100" height="40" className="topo-node-rect active" />
                          <text x="50" y="22" className="topo-node-text">Active Replicas</text>
                        </g>
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
             Projects Showcase (Portfolio)
             ========================================== */}
        <section className="portfolio-section reveal-on-scroll" id="portfolio">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title word-reveal-title">
                <span className="word-wrapper">
                  <span className="word">Our</span>
                </span>
                <span className="word-wrapper">
                  <span className="word">works</span>
                </span>
              </h2>
            </div>
            <div className="editorial-portfolio-grid" id="portfolio-grid">
              {PROJECTS.map((project, index) => (
                <div
                  key={project.id}
                  className={`editorial-project-card reveal-on-scroll ${index % 2 !== 0 ? 'reverse-layout slide-from-right' : 'slide-from-left'}`}
                >
                  <div
                    className="editorial-image-wrapper"
                    style={{
                      backgroundColor: project.imageBackground || 'var(--bg-panel)',
                      padding: project.padding || '0'
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="editorial-project-img"
                      style={{ objectFit: project.objectFit || 'cover' }}
                    />
                  </div>
                  <div className="editorial-project-body">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="editorial-project-link">
                      Visit Live Project <span>→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
             Our Team Section (Carousel Style)
             ========================================== */}
        <section className="team-section" id="team">
          <div className="container team-animate">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <h2 className="section-title word-reveal-title" style={{ fontSize: '2.5rem' }}>
                <span className="word-wrapper">
                  <span className="word">Our</span>
                </span>
                <span className="word-wrapper">
                  <span className="word">Team</span>
                </span>
              </h2>
            </div>

            <div className="team-carousel-container team-animate-item">

              {/* Swipeable Track */}
              <div className="team-carousel-track-wrapper">
                <div className="team-carousel-track" ref={teamTrackRef}>
                  {TEAM_MEMBERS.map((member, index) => (
                    <div className="team-carousel-slide" key={member.id} data-index={index}>
                      <div className="team-carousel-image-box">
                        {member.img && !member.img.includes('unsplash.com') ? (
                          <img src={member.img} alt={member.name} className="team-carousel-image" />
                        ) : (
                          <div className="team-carousel-image" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(0, 188, 212, 0.2))' }}></div>
                        )}
                        <div className="team-carousel-overlay">
                          <h3 className="team-overlay-title">{member.role}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Info & Controls Row */}
              <div className="team-carousel-bottom-row">
                {/* Content animates in with key change */}
                <div className="team-carousel-content" key={teamAnimKey}>
                  <h4 className="team-role-title">{TEAM_MEMBERS[currentTeamIndex]?.name}</h4>
                  <p className="team-desc">{TEAM_MEMBERS[currentTeamIndex]?.desc}</p>
                </div>

                <div className="team-carousel-controls">
                  <div className="team-carousel-dots">
                    {TEAM_MEMBERS.map((_, i) => (
                      <button
                        key={i}
                        className={`team-dot ${currentTeamIndex === i ? 'active' : ''}`}
                        onClick={() => scrollToTeamMember(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="team-nav-pill">
                    <button
                      className="team-nav-btn"
                      onClick={() => scrollTeamCarousel('prev')}
                      aria-label="Previous member"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button
                      className="team-nav-btn"
                      onClick={() => scrollTeamCarousel('next')}
                      aria-label="Next member"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================
             Inquiry Contact Form Section
             ========================================== */}
        <section className="contact-section" id="contact">
          <div className="container contact-animate">
            <div className="contact-layout">

              {/* Left — Info Panel */}
              <div className="contact-info-panel">
                <div className="contact-left-tagline contact-animate-item">
                  <span className="contact-tagline-bar"></span>
                  <span className="contact-tagline-text">Start a Dialogue</span>
                </div>
                <h2 className="contact-headline contact-animate-item">Let's Build Your<br />Future System</h2>
                <div className="contact-headline-underline contact-animate-item"></div>
                <p className="contact-subtitle contact-animate-item">Tell us about your requirements—whether it is an AI application integration, a database scaling project, or a full-scale ecommerce platform.<br />Our team responds within 24 hours.</p>

                <div className="contact-info-cards contact-animate-item">
                  <div className="contact-info-card">
                    <div className="contact-info-card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div className="contact-info-card-body">
                      <h4>Email Us</h4>
                      <p>partner@shivohara.com</p>
                      <span className="contact-info-card-note">We'll get back to you within 24 hours</span>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-info-card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <div className="contact-info-card-body">
                      <h4>Global Remote Operations</h4>
                      <p>Delivering solutions worldwide</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Clean White Form Card */}
              <div className="contact-form-panel contact-animate-item-form">
                <form ref={formRef} onSubmit={handleFormSubmit} noValidate>

                  {/* Name Field */}
                  <div className="cf-field-row">
                    <div className="cf-field-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <div className="cf-field-body">
                      <label htmlFor="name">Your Name</label>
                      <input type="text" id="name" name="name" className="form-input" placeholder="e.g. Sandra Kovac" value={formData.name} onChange={handleInputChange} required />
                      <span className="error-msg">Please enter your name.</span>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="cf-field-row">
                    <div className="cf-field-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div className="cf-field-body">
                      <label htmlFor="email">Work Email</label>
                      <input type="email" id="email" name="email" className="form-input" placeholder="e.g. sandra@company.com" value={formData.email} onChange={handleInputChange} required />
                      <span className="error-msg">Please enter a valid email.</span>
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="cf-field-row">
                    <div className="cf-field-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                    </div>
                    <div className="cf-field-body">
                      <label htmlFor="service-type">Project Requirement</label>
                      <select id="service-type" name="serviceType" className="form-input" value={formData.serviceType} onChange={handleInputChange} required style={{ cursor: 'pointer' }}>
                        <option value="" disabled>Select service category...</option>
                        <option value="ai-ml">AI &amp; ML Applications / Projects</option>
                        <option value="web-mobile">Web &amp; Mobile Applications</option>
                        <option value="database">Database &amp; Scale Services</option>
                        <option value="ecommerce">Ecommerce App / Website</option>
                        <option value="marketing">Digital Marketing / SEO</option>
                      </select>
                      <span className="error-msg">Please choose a category.</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="cf-field-row cf-field-row--textarea">
                    <div className="cf-field-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                    </div>
                    <div className="cf-field-body">
                      <label htmlFor="message">Project Description</label>
                      <textarea id="message" name="message" className="form-textarea" placeholder="Tell us about the project goals, scale, and timeline..." value={formData.message} onChange={handleInputChange} required></textarea>
                      <span className="error-msg">Please describe your project.</span>
                    </div>
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={submitting}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    <span>{submitting ? 'Sending Inquiry...' : 'Send Inquiry'}</span>
                  </button>

                  <div className="cf-security-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <span>Your information is secure and confidential.</span>
                  </div>

                  {formStatus.message && (
                    <div className={`form-status ${formStatus.type === 'success' ? 'success' : 'error'}`}>
                      {formStatus.message}
                    </div>
                  )}
                </form>
              </div>

            </div>
          </div>
        </section>
        </main>
      )}

      {view === 'careers' && (
        <main>
          <CareersPage />
        </main>
      )}

      {view !== 'admin' && (
        <footer className="site-footer" style={{ paddingBottom: '0' }}>
          <div className="container">
            <div className="footer-grid">
              {/* Column 1: Brand Logo only */}
              <div className="footer-brand">
                <a href="#" className="logo" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
                  <img src="/footer_logo.png" alt="SHIVOHARA Logo" style={{ height: '65px', width: 'auto', objectFit: 'contain', borderRadius: '12px' }} />
                </a>
                <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>Fusing engineering consciousness with intelligent automation. Building digital ecosystems that scale infinitely.</p>
              </div>

              {/* Column 2: Capabilities Links */}
              <div className="footer-nav">
                <h4>Capabilities</h4>
                <ul>
                  <li><a href="#services">Software Engineering</a></li>
                  <li><a href="#ai-lab">AI Lab Services</a></li>
                  <li><a href="#scale">Architecture Scale</a></li>
                  <li><a href="#services">Automated Testing</a></li>
                  <li><a href="#services">Digital Marketing</a></li>
                </ul>
              </div>

              {/* Column 3: Quick Links */}
              <div className="footer-nav">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#services">Services</a></li>
                  <li><a href="#ai-lab">AI Lab</a></li>
                  <li><a href="#scale">Our Scale</a></li>
                  <li><a href="#portfolio">Our works</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>

              {/* Column 4: Follow Us */}
              <div className="footer-nav">
                <h4>Follow us on</h4>
                <ul className="footer-social-links" style={{ display: 'flex', flexDirection: 'row', gap: '1.25rem', marginTop: '0.5rem', listStyle: 'none', padding: 0 }}>
                  <li>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Instagram">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Twitter">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-big-brand">SHIVOHARA</div>

            <div className="footer-bottom">
              <div className="footer-copyright">
                <p>&copy; 2026 SHIVOHARA. All rights reserved.</p>
                <p className="footer-sub-text">Fusing pure consciousness with engineering scale.</p>
              </div>
              <div className="footer-actions">
                <a href="#" className="back-to-top-btn" aria-label="Back to top">
                  <span>Back to Top</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Skyline Banner */}
          <div className="footer-skyline-wrap">
            <img src="/bottom.png" alt="Global Monuments and Tech Skyline Silhouette" className="footer-skyline-image" loading="lazy" />
          </div>
        </footer>
      )}
    </>
  );
}
