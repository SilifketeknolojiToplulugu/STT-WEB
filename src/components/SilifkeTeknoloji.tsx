import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

import { ChevronRight, Sparkles, Cpu, Globe2, HeartHandshake, Play } from "lucide-react";
import ModernFlipCard from "./ModernFlipCard";
import DetailModal from "./DetailModal";
import useImagePreload from "../hooks/useImagePreload";
import {
  clearAdminSession,
  getStoredAdminSession,
  logoutAdminSession,
  validateAdminSession,
} from "../lib/adminConfig";
import { useLanguage } from "../i18n/LanguageContext";

// Lazy load heavy components for better initial load
const MatrixRain = lazy(() => import("./MatrixRain"));
const AnimatedTextCycle = lazy(() => import("./AnimatedTextCycle"));
const InteractiveDots = lazy(() => import("./InteractiveDots"));
const NostalgicCounter = lazy(() => import("./NostalgicCounter"));
const FaqSection = lazy(() => import("./FaqSection"));
const Footer = lazy(() => import("./Footer"));

// Lazy load page components - only loaded when navigated to
const JoinClubPage = lazy(() => import("./pages/JoinClubPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AdminLogin = lazy(() => import("./AdminLogin"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));

type CurrentPage = 'home' | 'about' | 'contact' | 'projects' | 'events' | 'join-club' | 'thank-you' | 'admin' | 'blog' | 'blog-post';

const pagePathMap: Record<CurrentPage, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  projects: '/projects',
  events: '/events',
  'join-club': '/katil',
  'thank-you': '/tesekkurler',
  admin: '/yonetim',
  blog: '/blog',
  'blog-post': '/blog/',
};

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const trimmed = pathname.trim().toLowerCase().replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function resolvePageFromPath(pathname: string): CurrentPage {
  const normalized = normalizePath(pathname);

  // Check for blog post path first (e.g., /blog/some-slug)
  if (normalized.startsWith('/blog/')) {
    const slug = normalized.replace('/blog/', '');
    // Only return blog-post if there's actually a slug
    if (slug && slug.length > 0) {
      return 'blog-post';
    }
  }

  switch (normalized) {
    case '/':
      return 'home';
    case '/about':
    case '/hakkimizda':
      return 'about';
    case '/contact':
    case '/iletisim':
      return 'contact';
    case '/projects':
    case '/projeler':
      return 'projects';
    case '/events':
    case '/etkinlikler':
      return 'events';
    case '/katil':
    case '/join':
      return 'join-club';
    case '/tesekkurler':
    case '/thank-you':
      return 'thank-you';
    case '/yonetim':
    case '/admin':
      return 'admin';
    case '/blog':
      return 'blog';
    default:
      return 'home';
  }
}

const SilifkeTeknoloji: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const isTR = language === 'tr';
  const toggleButtonLabel = isTR ? 'EN' : 'TR';
  const toggleAriaLabel = isTR ? 'İngilizce diline geç' : 'Türkçe diline geç';
  const animatedWords = isTR ? ['Yenilik', 'İşbirliği', 'Gelecek', 'Değişim'] : ['Innovation', 'Collaboration', 'Future', 'Change'];
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [isQuickVideoPlaying, setIsQuickVideoPlaying] = useState(false);
  const [pendingScrollTarget, setPendingScrollTarget] = useState<'faq' | null>(null);
  const [pendingBlogPost, setPendingBlogPost] = useState<import('./pages/BlogPage').BlogPostData | null>(null);
  const { scrollY } = useScroll();

  const scrollToFaqImmediate = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const element = document.getElementById('sss');
    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const basePath = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(window.history.state, '', `${basePath}#sss`);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const contentDelay = 0.3;
  const itemDelayIncrement = 0.15;

  const headerVariants = {
    top: {
      backgroundColor: "rgba(0, 0, 0, 0.90)",
      borderBottomColor: "rgba(255, 255, 255, 0.15)",
      boxShadow: 'none',
    },
    scrolled: {
      backgroundColor: "rgba(0, 0, 0, 0.98)",
      borderBottomColor: "rgba(255, 215, 0, 0.40)",
      boxShadow: '0 8px 32px rgba(255, 215, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.8)',
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const heroHighlights = [
    {
      title: isTR ? "Yapay Zeka & Otomasyon" : "AI & Automation",
      description: isTR
        ? "Projeleri GPT-asistanları ve özel otomasyonlarla hızlandırıyoruz."
        : "We accelerate projects with GPT assistants and tailored automations.",
      icon: Sparkles
    },
    {
      title: isTR ? "Ürünleştirme Mentorluğu" : "Productization Mentorship",
      description: isTR
        ? "Fikirleri iş modeline dönüştürmek için haftalık mentorluk seansları."
        : "Weekly mentorship sessions to turn ideas into sustainable business models.",
      icon: HeartHandshake
    },
    {
      title: isTR ? "Teknoloji Atölyeleri" : "Technology Workshops",
      description: isTR
        ? "Modern stack'lerle kod kampı, veri bilimi ve tasarım oturumları."
        : "Coding camps, data science, and design sessions built on modern stacks.",
      icon: Cpu
    },
    {
      title: isTR ? "Yerel Etki Programları" : "Local Impact Programs",
      description: isTR
        ? "Silifke’de sosyal fayda yaratan girişimleri birlikte kuruyoruz."
        : "We co-create initiatives that deliver social impact across Silifke.",
      icon: Globe2
    }
  ];

  const quickAccessVideoId = "fjBeQzlykyY";
  const quickAccessVideoUrl = `https://www.youtube.com/embed/${quickAccessVideoId}?autoplay=1&rel=0&modestbranding=1`;
  const quickAccessThumbnail = `https://img.youtube.com/vi/${quickAccessVideoId}/hqdefault.jpg`;

  const featureData = [
    {
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      content: {
        tr: {
          title: "Uygulama Geliştirme",
          desc: "Web ve mobil için uygulamalar geliştiriyoruz.",
          detailedContent:
            "📱 Web ve mobil için uygulamalar geliştiriyoruz. Önce fikri birlikte planlıyor, sonra vibe coding (eş zamanlı ortak kodlama yaklaşımı) ile adım adım kodlayarak hayata geçiriyoruz.",
          details: {
            vision:
              "Silifke'nin teknoloji alanında öncü olmasını hedefleyerek, yerel işletmeler ve girişimciler için modern, ölçeklenebilir ve kullanıcı dostu uygulamalar geliştiriyoruz. Amacımız, teknolojinin gücünü kullanarak bölgemizin dijital dönüşümüne katkıda bulunmak.",
            services: [
              "Responsive Web Uygulamaları",
              "Mobil Uygulama Geliştirme (iOS & Android)",
              "E-ticaret Platformları",
              "Kurumsal Web Siteleri",
              "Progressive Web Apps (PWA)",
              "API Geliştirme ve Entegrasyon"
            ],
            technologies: [
              "React",
              "Next.js",
              "Node.js",
              "TypeScript",
              "Flutter",
              "React Native",
              "PostgreSQL",
              "MongoDB",
              "Firebase",
              "AWS"
            ],
            examples: [
              "Yerel restoran için online sipariş sistemi geliştirmek",
              "Turizm acentesi için rezervasyon ve tur yönetim uygulaması",
              "Tarım kooperatifi için ürün takip ve satış platformu",
              "Belediye için vatandaş hizmet portalı"
            ]
          }
        },
        en: {
          title: "Application Development",
          desc: "We build applications for web and mobile.",
          detailedContent:
            "📱 We build applications for web and mobile. We start by planning the idea together, then bring it to life step by step with vibe coding—our synchronous co-coding approach.",
          details: {
            vision:
              "We aim to position Silifke as a technology pioneer by creating modern, scalable, and user-friendly applications for local businesses and entrepreneurs. Our goal is to contribute to the region's digital transformation by harnessing technology.",
            services: [
              "Responsive Web Applications",
              "Mobile App Development (iOS & Android)",
              "E-commerce Platforms",
              "Corporate Websites",
              "Progressive Web Apps (PWA)",
              "API Development & Integration"
            ],
            technologies: [
              "React",
              "Next.js",
              "Node.js",
              "TypeScript",
              "Flutter",
              "React Native",
              "PostgreSQL",
              "MongoDB",
              "Firebase",
              "AWS"
            ],
            examples: [
              "Building an online ordering system for a local restaurant",
              "Reservation and tour management app for a travel agency",
              "Product tracking and sales platform for an agricultural cooperative",
              "Citizen services portal for the municipality"
            ]
          }
        }
      }
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      content: {
        tr: {
          title: "UI/UX & Tasarım",
          desc: "Kullanıcı dostu ve estetik arayüzler tasarlıyoruz.",
          detailedContent:
            "🎨 Kullanıcı dostu ve estetik arayüzler tasarlıyoruz. Önce ihtiyacı anlamaya çalışıyor, sonra basit ve şık çözümlerle ekranları hayata geçiriyoruz.",
          details: {
            vision:
              "Her dijital deneyimin arkasında güçlü bir tasarım felsefesi olduğuna inanıyoruz. Kullanıcıların ihtiyaçlarını anlayarak, hem estetik hem fonksiyonel tasarımlar yaratıyoruz. Hedefimiz, teknoloji ile insan arasındaki köprüyü güçlendirmek.",
            services: [
              "Kullanıcı Araştırması ve Analizi",
              "Wireframe ve Prototipleme",
              "Visual Identity Tasarımı",
              "Responsive Tasarım",
              "Usability Testing",
              "Design System Oluşturma"
            ],
            technologies: [
              "Figma",
              "Adobe XD",
              "Sketch",
              "Principle",
              "InVision",
              "Miro",
              "Photoshop",
              "Illustrator"
            ],
            examples: [
              "Yerel e-ticaret sitesi için kullanıcı deneyimi optimizasyonu",
              "Mobil bankacılık uygulaması arayüz tasarımı",
              "Eğitim platformu için interaktif öğrenme deneyimi",
              "Sağlık uygulaması için erişilebilir tasarım çözümleri"
            ]
          }
        },
        en: {
          title: "UI/UX & Design",
          desc: "We design user-friendly and aesthetic interfaces.",
          detailedContent:
            "🎨 We design user-friendly and aesthetic interfaces. We first seek to understand the need, then bring screens to life with simple and elegant solutions.",
          details: {
            vision:
              "We believe every digital experience stands on a strong design philosophy. By understanding users' needs, we craft designs that are both aesthetic and functional. Our goal is to strengthen the bridge between people and technology.",
            services: [
              "User Research & Analysis",
              "Wireframing & Prototyping",
              "Visual Identity Design",
              "Responsive Design",
              "Usability Testing",
              "Design System Creation"
            ],
            technologies: [
              "Figma",
              "Adobe XD",
              "Sketch",
              "Principle",
              "InVision",
              "Miro",
              "Photoshop",
              "Illustrator"
            ],
            examples: [
              "User experience optimisation for a local e-commerce site",
              "Interface design for a mobile banking app",
              "Interactive learning experience for an education platform",
              "Accessible design solutions for a health application"
            ]
          }
        }
      }
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      content: {
        tr: {
          title: "Yapay Zeka Entegrasyonu",
          desc: "Projelerinize yapay zeka ekliyoruz.",
          detailedContent:
            "🤖 Projelerinize yapay zeka ekliyoruz. Tekrar eden işleri otomatikleştiriyor, verilerinizi daha akıllı kullanmanızı sağlıyoruz.",
          details: {
            vision:
              "Yapay zeka teknolojilerini günlük hayatın her alanına entegre ederek, verimliliği artıran ve hayatı kolaylaştıran çözümler üretiyoruz. Amacımız, AI'ın gücünü herkesin erişebileceği şekilde demokratikleştirmek.",
            services: [
              "Chatbot ve Sanal Asistan Geliştirme",
              "Veri Analizi ve Tahmin Modelleri",
              "Görüntü İşleme ve Tanıma Sistemleri",
              "Doğal Dil İşleme Uygulamaları",
              "Otomasyon Sistemleri",
              "Makine Öğrenmesi Danışmanlığı"
            ],
            technologies: [
              "Python",
              "TensorFlow",
              "PyTorch",
              "OpenAI API",
              "Hugging Face",
              "Scikit-learn",
              "OpenCV",
              "NLTK",
              "spaCy"
            ],
            examples: [
              "Tarım arazileri için drone ile hasat analizi sistemi",
              "Turizm rehberi için akıllı öneri motoru",
              "Müşteri hizmetleri için Türkçe chatbot geliştirme",
              "Sosyal medya içerik analizi ve sentiment analizi"
            ]
          }
        },
        en: {
          title: "AI Integration",
          desc: "We add artificial intelligence to your projects.",
          detailedContent:
            "🤖 We bring AI into your projects. We automate repetitive tasks and help you use your data more intelligently.",
          details: {
            vision:
              "By integrating AI technologies into everyday life, we create solutions that increase efficiency and make life easier. Our goal is to democratise the power of AI so everyone can benefit from it.",
            services: [
              "Chatbot & Virtual Assistant Development",
              "Data Analysis & Predictive Models",
              "Computer Vision & Recognition Systems",
              "Natural Language Processing Applications",
              "Automation Systems",
              "Machine Learning Consulting"
            ],
            technologies: [
              "Python",
              "TensorFlow",
              "PyTorch",
              "OpenAI API",
              "Hugging Face",
              "Scikit-learn",
              "OpenCV",
              "NLTK",
              "spaCy"
            ],
            examples: [
              "Harvest analysis system with drones for agricultural fields",
              "Smart recommendation engine for a tourism guide",
              "Developing a Turkish-language chatbot for customer service",
              "Social media content analysis and sentiment measurement"
            ]
          }
        }
      }
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      content: {
        tr: {
          title: "Takım Çalışması & Proje Yönetimi",
          desc: "Fikirleri birlikte şekillendiriyoruz.",
          detailedContent:
            "👥 Fikirleri birlikte şekillendiriyoruz. Görevleri paylaşıyor, birbirimize destek oluyor ve projeleri adım adım tamamlıyoruz.",
          details: {
            vision:
              "Başarılı projelerin arkasında güçlü takım çalışması ve etkili proje yönetimi olduğuna inanıyoruz. Modern metodolojileri kullanarak, hem bireysel hem de takım performansını en üst seviyeye çıkarıyoruz.",
            services: [
              "Agile/Scrum Koçluğu",
              "Proje Planlama ve Yönetimi",
              "Takım Oluşturma ve Geliştirme",
              "Sprint Planning ve Review",
              "Risk Yönetimi",
              "Kalite Güvence Süreçleri"
            ],
            technologies: [
              "Jira",
              "Trello",
              "Asana",
              "Slack",
              "Microsoft Teams",
              "GitHub",
              "GitLab",
              "Confluence",
              "Notion"
            ],
            examples: [
              "Yazılım geliştirme takımı için Scrum süreç implementasyonu",
              "Uzaktan çalışan ekipler için iş birliği platformu kurulumu",
              "Startup için MVP geliştirme süreç yönetimi",
              "Büyük ölçekli proje için risk analizi ve mitigation planı"
            ]
          }
        },
        en: {
          title: "Teamwork & Project Management",
          desc: "We shape ideas together.",
          detailedContent:
            "👥 We shape ideas together. We share tasks, support one another, and complete projects step by step.",
          details: {
            vision:
              "We believe successful projects are built on strong teamwork and effective project management. By using modern methodologies, we maximise both individual and team performance.",
            services: [
              "Agile/Scrum Coaching",
              "Project Planning & Management",
              "Team Formation & Development",
              "Sprint Planning & Review",
              "Risk Management",
              "Quality Assurance Processes"
            ],
            technologies: [
              "Jira",
              "Trello",
              "Asana",
              "Slack",
              "Microsoft Teams",
              "GitHub",
              "GitLab",
              "Confluence",
              "Notion"
            ],
            examples: [
              "Implementing Scrum processes for a software development team",
              "Setting up a collaboration platform for remote teams",
              "Managing MVP development processes for a startup",
              "Risk analysis and mitigation planning for a large-scale project"
            ]
          }
        }
      }
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      content: {
        tr: {
          title: "Startup & Ürünleştirme",
          desc: "Fikirleri sadece konuşmuyoruz, hayata geçiriyoruz.",
          detailedContent:
            "🚀 Fikirleri sadece konuşmuyoruz, hayata geçiriyoruz. Ortaya çıkan projeleri gerçek iş modellerine dönüştürüp sürdürülebilir hale getiriyoruz.",
          details: {
            vision:
              "Silifke'yi bir girişimcilik merkezi haline getirmeyi hedefliyoruz. Yerel girişimcilere mentorluk sağlayarak, teknoloji tabanlı iş fikirlerinin hayata geçirilmesinde köprü görevi üstleniyoruz.",
            services: [
              "İş Modeli Geliştirme",
              "MVP (Minimum Viable Product) Oluşturma",
              "Pazar Araştırması ve Analizi",
              "Yatırımcı Sunumu Hazırlama",
              "Girişimcilik Mentorluğu",
              "Ürün Pazarlama Stratejileri"
            ],
            technologies: [
              "Lean Canvas",
              "Design Thinking",
              "A/B Testing",
              "Google Analytics",
              "Mixpanel",
              "Hotjar",
              "Mailchimp",
              "HubSpot"
            ],
            examples: [
              "Yerel üretici pazarı için dijital platform geliştirme",
              "Turizm startup'ı için rezervasyon sistemi MVP'si",
              "EdTech girişimi için öğrenme platformu prototipi",
              "AgriTech çözümü için çiftçi-tüketici bağlantı uygulaması"
            ]
          }
        },
        en: {
          title: "Startup & Productization",
          desc: "We don't just talk about ideas—we ship them.",
          detailedContent:
            "🚀 We don't just talk about ideas; we launch them. We transform emerging projects into real business models and make them sustainable.",
          details: {
            vision:
              "We aim to turn Silifke into a hub for entrepreneurship. By mentoring local founders, we act as a bridge that helps technology-based ideas come to life.",
            services: [
              "Business Model Development",
              "MVP (Minimum Viable Product) Creation",
              "Market Research & Analysis",
              "Investor Pitch Preparation",
              "Entrepreneurship Mentoring",
              "Product Marketing Strategies"
            ],
            technologies: [
              "Lean Canvas",
              "Design Thinking",
              "A/B Testing",
              "Google Analytics",
              "Mixpanel",
              "Hotjar",
              "Mailchimp",
              "HubSpot"
            ],
            examples: [
              "Developing a digital platform for local producer markets",
              "Reservation system MVP for a tourism startup",
              "Learning platform prototype for an EdTech venture",
              "Farmer-to-consumer connection app for an AgriTech solution"
            ]
          }
        }
      }
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
      content: {
        tr: {
          title: "Sosyal Etki & Topluluk",
          desc: "Yerelde gördüğümüz sorunlara teknolojiyle çözümler üretiyoruz.",
          detailedContent:
            "🌍 Yerelde gördüğümüz sorunlara teknolojiyle çözümler üretiyoruz. Bunu yaparken hem topluma fayda sağlıyor, birlikte değer üretiyoruz ve zamanla ciddi gelirler elde ediyoruz.",
          details: {
            vision:
              "Teknolojinin toplumsal fayda için kullanılması gerektiğine inanıyoruz. Silifke ve çevresindeki toplumsal sorunları tespit ederek, sürdürülebilir ve etkili teknolojik çözümler geliştiriyoruz.",
            services: [
              "Sosyal Etki Analizi",
              "Toplum Temelli Çözüm Geliştirme",
              "Gönüllü Yönetim Sistemleri",
              "Eğitim ve Farkındalık Platformları",
              "Çevre Koruma Uygulamaları",
              "Dijital Kapsayıcılık Projeleri"
            ],
            technologies: [
              "Open Source",
              "Progressive Web Apps",
              "Offline-First",
              "Accessibility Standards",
              "Multi-language Support"
            ],
            examples: [
              "Yaşlılar için dijital okuryazarlık eğitim platformu",
              "Çevre gönüllüleri için koordinasyon uygulaması",
              "Yerel kültür ve tarih arşivleme projesi",
              "Engelli bireylerin erişilebilirliği için akıllı şehir çözümleri"
            ]
          }
        },
        en: {
          title: "Social Impact & Community",
          desc: "We solve local challenges with technology.",
          detailedContent:
            "🌍 We tackle the challenges we observe locally with technology. By doing so we create value together, deliver social benefit, and also build sustainable revenue over time.",
          details: {
            vision:
              "We believe technology should be used for social good. We identify the societal challenges around Silifke and develop sustainable, high-impact technological solutions.",
            services: [
              "Social Impact Analysis",
              "Community-led Solution Development",
              "Volunteer Management Systems",
              "Education & Awareness Platforms",
              "Environmental Protection Applications",
              "Digital Inclusion Projects"
            ],
            technologies: [
              "Open Source",
              "Progressive Web Apps",
              "Offline-First",
              "Accessibility Standards",
              "Multi-language Support"
            ],
            examples: [
              "Digital literacy training platform for seniors",
              "Coordination app for environmental volunteers",
              "Local culture and history archiving project",
              "Smart city solutions that improve accessibility for people with disabilities"
            ]
          }
        }
      }
    }
  ] as const;

  const features = featureData.map((feature) => {
    const localized = feature.content[language];
    return {
      title: localized.title,
      desc: localized.desc,
      imageUrl: feature.imageUrl,
      detailedContent: localized.detailedContent,
      details: {
        vision: localized.details.vision,
        services: Array.from(localized.details.services),
        technologies: Array.from(localized.details.technologies),
        examples: Array.from(localized.details.examples)
      }
    };
  });

  // Preload all images for better performance
  const imageUrls = features.map(feature => feature.imageUrl);
  useImagePreload(imageUrls, { priority: true, highPriorityCount: 2 });

  // Handle page navigation
  const handlePageChange = (page: CurrentPage) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      const targetPath = pagePathMap[page] || '/';
      const search = window.location.search;
      const nextUrl = `${targetPath}${search}`;

      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', nextUrl);
      }
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setIsMobileMenuOpen(false);

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      const search = window.location.search;
      if (window.location.pathname !== '/') {
        const nextUrl = search ? `/${search}` : '/';
        window.history.pushState({ page: 'home' }, '', nextUrl);
      }
    }
  };

  const handleBlogPostNavigation = (slug: string, post: import('./pages/BlogPage').BlogPostData | null) => {
    setPendingBlogPost(post);
    setCurrentPage('blog-post');
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      window.history.pushState({ page: 'blog-post' }, '', `/blog/${slug}`);
    }
  };

  const handleScrollToFaq = () => {
    setIsMobileMenuOpen(false);

    if (currentPage !== 'home') {
      setPendingScrollTarget('faq');
      handlePageChange('home');
      return;
    }

    scrollToFaqImmediate();
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthorized(true);
    setIsMobileMenuOpen(false);
  };

  const handleAdminLogout = () => {
    const session = getStoredAdminSession();
    setIsAdminAuthorized(false);
    logoutAdminSession(session?.token).finally(() => {
      clearAdminSession();
    });
    setIsMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle URL-based routing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRoute = () => {
      const nextPage = resolvePageFromPath(window.location.pathname);
      setCurrentPage(nextPage);
      setIsMobileMenuOpen(false);
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);

    return () => {
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const session = getStoredAdminSession();

    if (!session) {
      clearAdminSession();
      return;
    }

    const runValidation = async () => {
      const isValid = await validateAdminSession(session);
      if (!cancelled) {
        if (isValid) {
          setIsAdminAuthorized(true);
        } else {
          clearAdminSession();
          setIsAdminAuthorized(false);
        }
      }
    };

    runValidation();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (pendingScrollTarget !== 'faq') return;
    if (currentPage !== 'home') return;
    if (typeof window === 'undefined') return;

    const timer = window.setTimeout(() => {
      scrollToFaqImmediate();
      setPendingScrollTarget(null);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [pendingScrollTarget, currentPage, scrollToFaqImmediate]);

  // Render current page (lazy loaded with Suspense)
  const pageFallback = (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  switch (currentPage) {
    case 'about':
      return <Suspense fallback={pageFallback}><AboutPage onBack={handleBackToHome} onJoin={() => handlePageChange('join-club')} /></Suspense>;
    case 'contact':
      return <Suspense fallback={pageFallback}><ContactPage onBack={handleBackToHome} /></Suspense>;
    case 'projects':
      return <Suspense fallback={pageFallback}><ProjectsPage onBack={handleBackToHome} /></Suspense>;
    case 'events':
      return <Suspense fallback={pageFallback}><EventsPage onBack={handleBackToHome} /></Suspense>;
    case 'join-club':
      return <Suspense fallback={pageFallback}><JoinClubPage onBack={handleBackToHome} /></Suspense>;
    case 'thank-you':
      return <Suspense fallback={pageFallback}><ThankYouPage onBack={handleBackToHome} /></Suspense>;
    case 'admin':
      if (!isAdminAuthorized) {
        return <Suspense fallback={pageFallback}><AdminLogin onBack={handleBackToHome} onSuccess={handleAdminLoginSuccess} /></Suspense>;
      }
      return <Suspense fallback={pageFallback}><AdminPage onBack={handleBackToHome} onLogout={handleAdminLogout} /></Suspense>;
    case 'blog':
      return <Suspense fallback={pageFallback}><BlogPage onBack={handleBackToHome} onNavigateToBlogPost={handleBlogPostNavigation} /></Suspense>;
    case 'blog-post': {
      const currentSlug = typeof window !== 'undefined'
        ? normalizePath(window.location.pathname).replace('/blog/', '')
        : '';
      return <Suspense fallback={pageFallback}><BlogPostPage slug={currentSlug} onBack={() => { setPendingBlogPost(null); handlePageChange('blog'); }} fallbackPost={pendingBlogPost} /></Suspense>;
    }
    case 'home':
    default:
      break;
  }

  return (
    <div className="relative bg-background text-foreground min-h-screen overflow-hidden">
      {/* Background Effects */}
      <Suspense fallback={<div className="absolute inset-0 bg-black/90" />}>
        <MatrixRain />
        <InteractiveDots />
      </Suspense>

      {/* Clean Black Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/100 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/80 z-20" />

      {/* Header */}
      <motion.header
        variants={headerVariants}
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b"
        style={{ borderBottomColor: 'rgba(255, 215, 0, 0.2)' }}
      >
        <nav className="container mx-auto px-6 py-4 sm:py-6 lg:py-8 flex justify-between items-center relative">
          {/* Sol Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex items-center space-x-8 lg:space-x-12 flex-1 justify-start"
          >
            <button
              onClick={() => handlePageChange('about')}
              className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl tracking-wide hover:scale-110 relative group"
            >
              {isTR ? 'Hakkımızda' : 'About'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handlePageChange('projects')}
              className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl tracking-wide hover:scale-110 relative group"
            >
              {isTR ? 'Projeler' : 'Projects'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handlePageChange('events')}
              className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl tracking-wide hover:scale-110 relative group"
            >
              {isTR ? 'Etkinlikler' : 'Events'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handlePageChange('blog')}
              className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl tracking-wide hover:scale-110 relative group"
            >
              {isTR ? 'Blog' : 'Blog'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </motion.div>

          {/* Logo - Merkeze yerleştirildi */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center flex-1 mt-4"
          >
            <motion.button
              onClick={handleBackToHome}
              className="focus:outline-none group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 via-yellow-500/30 to-yellow-400/20 
                            blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300/10 via-yellow-400/20 to-yellow-300/10 
                            blur-lg scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <img
                src="/logo-512.webp"
                alt={isTR ? "Silifke Teknoloji Topluluğu - Ana Sayfaya Dön" : "Silifke Technology Community - Back to Home"}
                className="relative h-20 sm:h-20 md:h-24 lg:h-24 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(255,215,0,0.5)]
                         scale-[1.4] sm:scale-[1.8] md:scale-[2.0] lg:scale-[2.0] hover:scale-[1.5] sm:hover:scale-[1.9] md:hover:scale-[2.1] lg:hover:scale-[2.1]
                         transition-all duration-500 cursor-pointer group-hover:drop-shadow-[0_0_45px_rgba(255,215,0,0.8)]"
                loading="eager"
                decoding="async"
                width="512"
                height="400"
                onError={(e) => {
                  console.error(isTR ? 'Logo yüklenemedi:' : 'Failed to load logo:', e);
                  (e.target as HTMLImageElement).src = '/logo-256.webp';
                }}
              />
            </motion.button>
          </motion.div>

          {/* Sağ Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex items-center space-x-8 lg:space-x-12 flex-1 justify-end"
          >
            <button
              onClick={handleScrollToFaq}
              className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl tracking-wide hover:scale-110 relative group"
            >
              {isTR ? 'S.S.S' : 'FAQ'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handlePageChange('contact')}
              className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl tracking-wide hover:scale-110 relative group"
            >
              {isTR ? 'İletişim' : 'Contact'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <a
              href="https://www.plansmy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl tracking-wide hover:scale-110 relative group"
            >
              {isTR ? 'Yönetim' : 'Management'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-full border border-yellow-400/40 text-yellow-200 hover:text-black hover:bg-yellow-400 transition-all duration-300 font-semibold text-sm"
              aria-label={toggleAriaLabel}
            >
              {toggleButtonLabel}
            </button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 z-50"
          >
            <button
              onClick={toggleMobileMenu}
              className="relative w-10 h-10 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center
                       border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              aria-label={isTR ? 'Mobil menü' : 'Mobile menu'}
            >
              <div className="w-5 h-5 relative">
                <span className={`absolute block w-5 h-0.5 bg-white transition-all duration-300
                  ${isMobileMenuOpen ? 'rotate-45 top-2' : 'top-1'}`}></span>
                <span className={`absolute block w-5 h-0.5 bg-white top-2 transition-all duration-300
                  ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute block w-5 h-0.5 bg-white transition-all duration-300
                  ${isMobileMenuOpen ? '-rotate-45 top-2' : 'top-3'}`}></span>
              </div>
            </button>
          </motion.div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-gradient-to-br
                       from-black/95 via-black/90 to-black/95 backdrop-blur-md z-50 lg:hidden
                       border-l border-yellow-400/20 shadow-2xl flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-yellow-400/20">
                <h2 className="text-xl font-bold text-white">{isTR ? 'Menü' : 'Menu'}</h2>
                <button
                  onClick={closeMobileMenu}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white
                           transition-colors duration-300 rounded-lg hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                {/* Logo */}
                <motion.div
                  className="flex justify-center mb-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <motion.button
                    onClick={handleBackToHome}
                    className="focus:outline-none group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <img
                      src="/logo-128.webp"
                      alt={isTR ? "Silifke Teknoloji Topluluğu - Ana Sayfaya Dön" : "Silifke Technology Community - Back to Home"}
                      className="h-20 sm:h-24 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]
                               group-hover:drop-shadow-[0_0_25px_rgba(255,215,0,0.7)] transition-all duration-300"
                      loading="eager"
                      decoding="async"
                      width="128"
                      height="100"
                      onError={(e) => {
                        console.error(isTR ? 'Mobil logo yüklenemedi:' : 'Failed to load mobile logo:', e);
                        (e.target as HTMLImageElement).src = '/logo-64.webp';
                      }}
                    />
                  </motion.button>
                </motion.div>

                {/* Navigation Links */}
                <nav className="space-y-5">
                  <button
                    onClick={() => handlePageChange('home')}
                    className="w-full text-left px-6 py-4 rounded-xl bg-yellow-400/10 text-yellow-400
                             font-semibold hover:bg-yellow-400/20 transition-all duration-300
                             flex items-center space-x-4 text-lg"
                  >
                    <span className="text-xl">🏠</span>
                    <span>{isTR ? 'Ana Sayfa' : 'Home'}</span>
                  </button>

                  <button
                    onClick={() => handlePageChange('about')}
                    className="w-full text-left px-6 py-4 rounded-xl text-gray-300 hover:text-white
                             hover:bg-white/10 transition-all duration-300 flex items-center space-x-4 text-lg"
                  >
                    <span className="text-xl">ℹ️</span>
                    <span>{isTR ? 'Hakkımızda' : 'About'}</span>
                  </button>

                  <button
                    onClick={() => handlePageChange('contact')}
                    className="w-full text-left px-6 py-4 rounded-xl text-gray-300 hover:text-white
                             hover:bg-white/10 transition-all duration-300 flex items-center space-x-4 text-lg"
                  >
                    <span className="text-xl">📞</span>
                    <span>{isTR ? 'İletişim' : 'Contact'}</span>
                  </button>

                  <button
                    onClick={() => handlePageChange('blog')}
                    className="w-full text-left px-6 py-4 rounded-xl text-gray-300 hover:text-white
                             hover:bg-white/10 transition-all duration-300 flex items-center space-x-4 text-lg"
                  >
                    <span className="text-xl">📝</span>
                    <span>{isTR ? 'Blog' : 'Blog'}</span>
                  </button>

                  <button
                    onClick={handleScrollToFaq}
                    className="w-full text-left px-6 py-4 rounded-xl text-gray-300 hover:text-white
                             hover:bg-white/10 transition-all duration-300 flex items-center space-x-4 text-lg"
                  >
                    <span className="text-xl">❓</span>
                    <span>{isTR ? 'S.S.S' : 'FAQ'}</span>
                  </button>

                  <button
                    onClick={() => handlePageChange('projects')}
                    className="w-full text-left px-6 py-4 rounded-xl text-gray-300 hover:text-white
                             hover:bg-white/10 transition-all duration-300 flex items-center space-x-4 text-lg"
                  >
                    <span className="text-xl">🚀</span>
                    <span>{isTR ? 'Projeler' : 'Projects'}</span>
                  </button>

                  <button
                    onClick={() => handlePageChange('events')}
                    className="w-full text-left px-6 py-4 rounded-xl text-gray-300 hover:text-white
                             hover:bg-white/10 transition-all duration-300 flex items-center space-x-4 text-lg"
                  >
                    <span className="text-xl">📅</span>
                    <span>{isTR ? 'Etkinlikler' : 'Events'}</span>
                  </button>

                  <a
                    href="https://www.plansmy.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-6 py-4 rounded-xl text-gray-300 hover:text-white
                             hover:bg-white/10 transition-all duration-300 flex items-center space-x-4 text-lg"
                  >
                    <span className="text-xl">⚙️</span>
                    <span>{isTR ? 'Yönetim' : 'Management'}</span>
                  </a>

                  <button
                    onClick={() => handlePageChange('join-club')}
                    className="w-full text-left px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700
                             text-black font-bold hover:scale-105 transition-all duration-300
                             flex items-center space-x-4 shadow-lg shadow-yellow-500/30 text-lg"
                  >
                    <span className="text-xl">🤝</span>
                    <span>{isTR ? 'Topluluğa Katıl' : 'Join the Community'}</span>
                  </button>
                </nav>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      toggleLanguage();
                      closeMobileMenu();
                    }}
                    className="px-6 py-2 rounded-full border border-yellow-400/40 text-yellow-200 hover:text-black hover:bg-yellow-400 transition-all duration-300 font-semibold"
                    aria-label={toggleAriaLabel}
                  >
                    {isTR ? 'İngilizceye Geç' : 'Switch to Turkish'}
                  </button>
                </div>

                {/* Contact Info */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">{isTR ? 'İletişim' : 'Contact'}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <span>📧</span>
                      <span>info@simay.tech</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <span>📱</span>
                      <span>+90 505 777 03 14</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <span>📍</span>
                      <span>Silifke/Mersin</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">{isTR ? 'Bizi Takip Edin' : 'Follow Us'}</h3>
                  <div className="flex space-x-4">
                    {[
                      { name: 'Instagram', icon: '📸', color: 'hover:text-pink-400', url: 'https://www.instagram.com/silifketechnology/' },
                      { name: 'Twitter', icon: '🐦', color: 'hover:text-blue-400', url: 'https://x.com/SilifkeTeknoloji' },
                      { name: 'YouTube', icon: '🎬', color: 'hover:text-red-500', url: 'https://www.youtube.com/@SilifkeTeknoloji' },
                      { name: 'GitHub', icon: '💻', color: 'hover:text-gray-400', url: 'https://github.com/silifketeknoloji' }
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center
                                 text-gray-400 ${social.color} transition-all duration-300
                                 hover:bg-white/20 hover:scale-110`}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-40 pt-28 sm:pt-36 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="relative text-center space-y-6 sm:space-y-8">
            {/* Hero Title */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, delay: contentDelay }}
              className="space-y-6 sm:space-y-8 mt-4 sm:mt-6 md:mt-8 lg:mt-12 mb-8 sm:mb-12"
            >
              <h1 className="text-display text-4xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight md:leading-none tracking-tighter">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent font-extrabold">
                  {isTR ? 'Silifke Teknoloji Topluluğu' : 'Silifke Technology Community'}
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent 
                               font-light text-3xl md:text-4xl lg:text-5xl opacity-90">{isTR ? 'ile' : 'with'}</span>{" "}
                <Suspense fallback={<span className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 bg-clip-text text-transparent font-display font-black">{isTR ? 'Yenilik' : 'Innovation'}</span>}>
                  <AnimatedTextCycle
                    words={animatedWords}
                    className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 bg-clip-text text-transparent font-display font-black"
                  />
                </Suspense>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: contentDelay + itemDelayIncrement }}
              className="text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto leading-relaxed font-medium tracking-wide
                         bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent"
            >
              {isTR
                ? (
                  <>
                    Yerelden başlayarak insanların sorunlarına{" "}
                    <span className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-200 bg-clip-text text-transparent font-bold">
                      teknolojiyle çözümler
                    </span>{" "}
                    üreten, faydayı motivasyona ve motivasyonu{" "}
                    <span className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-200 bg-clip-text text-transparent font-bold">
                      kazanca dönüştüren
                    </span>{" "}
                    bir topluluk.
                  </>
                ) : (
                  <>
                    We start locally and craft <span className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-200 bg-clip-text text-transparent font-bold">technology-powered solutions</span>{" "}
                    for real problems, turning the value we create into motivation and that motivation into{" "}
                    <span className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-200 bg-clip-text text-transparent font-bold">sustainable income</span>. A community built to make technology meaningful.
                  </>
                )}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: contentDelay + itemDelayIncrement * 2 }}
              className="flex justify-center items-center"
            >
              {/* Topluluğa Katıl Button - Büyütülmüş */}
              <motion.button
                onClick={() => handlePageChange('join-club')}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 
                         rounded-2xl font-black text-black text-xl sm:text-2xl shadow-2xl shadow-yellow-500/40 
                         hover:shadow-yellow-500/60 transition-all duration-300 overflow-hidden
                         border-2 border-yellow-400/40 hover:border-yellow-300/60"
              >
                {/* Enhanced animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Enhanced glow effect with golden halo */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/40 via-yellow-500/50 to-yellow-400/40 
                              blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-110" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300/20 via-yellow-400/30 to-yellow-300/20 
                              blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-125" />

                {/* Content */}
                <div className="relative flex items-center space-x-4">
                  <span className="transition-transform duration-300 group-hover:translate-x-1 tracking-wide">
                    {isTR ? 'TOPLULUĞA KATIL' : 'JOIN THE COMMUNITY'}
                  </span>
                  <ChevronRight className="w-7 h-7 transition-transform duration-300 
                                         group-hover:translate-x-2 group-hover:scale-125" />
                </div>

                {/* Enhanced shine effect */}
                <div className="absolute inset-0 -top-3 -left-3 w-6 h-full bg-gradient-to-r 
                              from-transparent via-white/40 to-transparent skew-x-12 
                              -translate-x-full group-hover:translate-x-[200%] 
                              transition-transform duration-700 ease-out" />
              </motion.button>
            </motion.div>

            {/* Fener Link */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: contentDelay + itemDelayIncrement * 2.5 }}
              className="flex justify-center mt-5"
            >
              <a
                href="https://fener.silifketeknoloji.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-full border border-yellow-400/30 bg-yellow-400/5
                           hover:bg-yellow-400/15 hover:border-yellow-400/60 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
                </span>
                <span className="text-sm font-semibold text-yellow-300 group-hover:text-yellow-200 tracking-wide transition-colors duration-300">
                  {isTR ? 'Fener Platformu →' : 'Fener Platform →'}
                </span>
              </a>
            </motion.div>

            {/* Hero Highlights */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: contentDelay + itemDelayIncrement * 3 }}
              className="mt-10 sm:mt-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                {heroHighlights.map((highlight, index) => {
                  const Icon = highlight.icon;
                  return (
                    <motion.div
                      key={highlight.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="group glass-panel glass-border-accent p-5 sm:p-6 shadow-yellow-500/10 hover:-translate-y-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/15 border border-yellow-400/30 text-yellow-200">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-white">{highlight.title}</h3>
                          <p className="mt-1 text-sm text-gray-300 leading-relaxed">
                            {highlight.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Nostalgic Counter */}
            <Suspense fallback={<div className="h-96" />}>
              <NostalgicCounter />
            </Suspense>

            {/* Features Grid with Connections */}
            <div className="relative mt-16">
              {/* Connection Lines - Desktop */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-10"
                style={{ top: '50px', left: 0 }}
                viewBox="0 0 1200 400"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255, 215, 0, 0)" />
                    <stop offset="50%" stopColor="rgba(255, 215, 0, 0.4)" />
                    <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
                  </linearGradient>
                </defs>

                {/* Horizontal connections */}
                <motion.path
                  d="M 200 120 L 600 120"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.5 }}
                  className="drop-shadow-lg"
                />
                <motion.path
                  d="M 600 120 L 1000 120"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.7 }}
                  className="drop-shadow-lg"
                />

                {/* Vertical connections */}
                <motion.path
                  d="M 200 120 L 200 280"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.9 }}
                  className="drop-shadow-lg"
                />
                <motion.path
                  d="M 600 120 L 600 280"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 2.1 }}
                  className="drop-shadow-lg"
                />
                <motion.path
                  d="M 1000 120 L 1000 280"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 2.3 }}
                  className="drop-shadow-lg"
                />

                {/* Diagonal connections for bottom row */}
                <motion.path
                  d="M 200 280 L 400 280"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 2.5 }}
                  className="drop-shadow-lg"
                />
                <motion.path
                  d="M 600 280 L 800 280"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 2.7 }}
                  className="drop-shadow-lg"
                />

                {/* Connection dots */}
                <circle cx="200" cy="120" r="4" fill="rgba(255, 215, 0, 0.6)" className="drop-shadow-lg">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="600" cy="120" r="4" fill="rgba(255, 215, 0, 0.6)" className="drop-shadow-lg">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="1000" cy="120" r="4" fill="rgba(255, 215, 0, 0.6)" className="drop-shadow-lg">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="280" r="4" fill="rgba(255, 215, 0, 0.6)" className="drop-shadow-lg">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="600" cy="280" r="4" fill="rgba(255, 215, 0, 0.6)" className="drop-shadow-lg">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="1000" cy="280" r="4" fill="rgba(255, 215, 0, 0.6)" className="drop-shadow-lg">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>

              {/* Connection Lines - Mobile/Tablet */}
              <div className="lg:hidden absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-20 left-1/2 w-0.5 h-96 bg-gradient-to-b from-yellow-400/0 via-yellow-400/30 to-yellow-400/0 transform -translate-x-1/2" />
                {/* Mobile connection dots */}
                <div className="absolute top-20 left-1/2 w-3 h-3 bg-yellow-400/60 rounded-full transform -translate-x-1/2 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400/60 rounded-full transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-20 left-1/2 w-3 h-3 bg-yellow-400/60 rounded-full transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
                {features.map((feature, index) => (
                  <ModernFlipCard
                    key={feature.title}
                    title={feature.title}
                    description={feature.desc}
                    imageUrl={feature.imageUrl}
                    detailedContent={feature.detailedContent}
                    index={index}
                    onCardClick={() => setSelectedCard(index)}
                  />
                ))}
              </div>
            </div>

            <Suspense fallback={<div className="h-96" />}>
              <FaqSection isTR={isTR} />
            </Suspense>

            <Suspense fallback={null}>
              <Footer />
            </Suspense>

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.button
                type="button"
                onClick={() => handlePageChange('blog')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 1 }}
                className="hidden md:flex absolute md:top-20 md:left-10 md:w-32 md:h-32 rounded-full border border-white/25 shadow-lg shadow-white/15 [box-shadow:_0_0_50px_rgba(255,215,0,0.15)]
                           pointer-events-auto bg-black/40 backdrop-blur-sm items-center justify-center group focus:outline-none
                           focus:ring-2 focus:ring-yellow-300/70 focus:ring-offset-2 focus:ring-offset-black z-10"
                aria-label={isTR ? 'Blog sayfasını aç' : 'Open the blog page'}
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/0 via-yellow-400/10 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-xs tracking-[0.55em] text-yellow-200/80 group-hover:text-yellow-100 font-semibold relative">
                  BLOG
                </span>
              </motion.button>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 1.2 }}
                className="absolute bottom-10 right-4 w-16 h-16 md:bottom-20 md:right-10 md:w-24 md:h-24 border border-yellow-400/30 rounded-full shadow-lg shadow-yellow-400/20 [box-shadow:_0_0_40px_rgba(255,215,0,0.18)]"
              />
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 1.5 }}
                className="absolute top-1/3 left-0 w-40 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent [box-shadow:_0_0_20px_rgba(255,215,0,0.4)]"
              />
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 1.7 }}
                className="absolute bottom-1/3 right-0 w-40 h-px bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent [box-shadow:_0_0_20px_rgba(255,215,0,0.5)]"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Quick Actions — Desktop (xl+) */}
      <motion.aside
        initial={{ opacity: 0, x: 40, y: 40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="pointer-events-auto hidden xl:flex flex-col fixed bottom-10 right-8 z-50"
      >
        <div className="glass-panel glass-border-accent p-4 w-56 shadow-yellow-500/15">
          <div className="mb-3">
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-yellow-300/80">{isTR ? 'Hızlı Erişim' : 'Quick Access'}</span>
            <h3 className="mt-1 text-sm font-semibold text-white">{isTR ? 'Tanıtım Videomuz' : 'Our Intro Video'}</h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {isQuickVideoPlaying ? (
              <iframe
                className="h-32 w-full"
                src={quickAccessVideoUrl}
                title={isTR ? 'Silifke Teknoloji tanıtım videosu' : 'Silifke Technology Community intro video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsQuickVideoPlaying(true)}
                className="group relative block h-32 w-full overflow-hidden bg-transparent text-left"
              >
                <img
                  src={quickAccessThumbnail}
                  alt={isTR ? 'Silifke Teknoloji YouTube videosu' : 'Silifke Technology Community YouTube video'}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/90 text-black transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-white/90">{isTR ? 'Videoyu Başlat' : 'Play Video'}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Floating Quick Actions — Mobile (sm–lg) */}
      <motion.aside
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isMobileMenuOpen ? 0 : 1, y: isMobileMenuOpen ? 30 : 0, pointerEvents: isMobileMenuOpen ? 'none' : 'auto' }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex xl:hidden fixed bottom-5 right-4 z-30"
      >
        <div className="glass-panel glass-border-accent p-3 w-44 shadow-yellow-500/15">
          <div className="mb-2">
            <span className="text-[0.55rem] uppercase tracking-[0.25em] text-yellow-300/80">{isTR ? 'Hızlı Erişim' : 'Quick Access'}</span>
            <h3 className="text-xs font-semibold text-white leading-tight">{isTR ? 'Tanıtım Videosu' : 'Intro Video'}</h3>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
            {isQuickVideoPlaying ? (
              <iframe
                className="h-24 w-full"
                src={quickAccessVideoUrl}
                title={isTR ? 'Silifke Teknoloji tanıtım videosu' : 'Silifke Technology Community intro video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsQuickVideoPlaying(true)}
                className="group relative block h-24 w-full overflow-hidden bg-transparent text-left"
              >
                <img
                  src={quickAccessThumbnail}
                  alt={isTR ? 'Silifke Teknoloji YouTube videosu' : 'Silifke Technology Community YouTube video'}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/90 text-black transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-4 w-4" />
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Detail Modal */}
      <DetailModal
        isOpen={selectedCard !== null}
        onClose={() => setSelectedCard(null)}
        title={selectedCard !== null ? features[selectedCard].title : ''}
        content={selectedCard !== null ? features[selectedCard].details : { vision: '', services: [], technologies: [], examples: [] }}
      />
    </div>
  );
};

export default SilifkeTeknoloji;
