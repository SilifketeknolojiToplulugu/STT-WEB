import React, { useState, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Footer";
import {
  ExternalLink,
  Github,
  Calendar,
  Users,
  Heart,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { useCmsCollection } from "../../hooks/useCmsCollection";
import type { CmsCollectionItem } from "../../lib/cmsClient";

// Lazy load background components
const MatrixRain = lazy(() => import("../MatrixRain"));
const InteractiveDots = lazy(() => import("../InteractiveDots"));

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  status: 'completed' | 'in-progress' | 'planning';
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  teamSize: number;
  duration: string;
  impact: string;
  tags?: string[];
}

interface ProjectsPageProps {
  onBack?: () => void;
}

function cmsItemToProject(item: CmsCollectionItem, index: number, lang: 'tr' | 'en'): Project {
  const d = item.data;
  return {
    id: index + 1,
    title: (lang === 'tr' ? d.title_tr : d.title_en) || d.title_tr || '',
    description: (lang === 'tr' ? d.description_tr : d.description_en) || d.description_tr || '',
    longDescription: (lang === 'tr' ? d.long_description_tr : d.long_description_en) || d.long_description_tr || '',
    category: d.category || 'web',
    status: (d.project_status as Project['status']) || 'planning',
    technologies: d.technologies ? d.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    image: d.image_url || '',
    demoUrl: d.demo_url || undefined,
    githubUrl: d.github_url || undefined,
    teamSize: parseInt(d.team_size || '0', 10),
    duration: (lang === 'tr' ? d.duration_tr : d.duration_en) || d.duration_tr || '',
    impact: (lang === 'tr' ? d.impact_tr : d.impact_en) || d.impact_tr || '',
  };
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isTR = language === 'tr';
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { items: cmsItems } = useCmsCollection('projects');

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const projectData = [
    {
      id: 99,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&auto=format&q=80",
      category: 'web',
      status: 'in-progress' as const,
      technologies: ['PWA', 'LoRa Mesh', 'Bluetooth Mesh', 'Offline-first', 'Apache-2.0'],
      teamSize: 6,
      demoUrl: 'https://fener.silifketeknoloji.org',
      translations: {
        tr: {
          title: "Fener – İnternetsiz İletişim Ağı",
          description: "Afet anında internetsiz çalışan iletişim ağı",
          longDescription: "İnternet yokken, baz istasyonu çökmüşken bile çalışan yurttaş-sahipli açık kaynak iletişim altyapısı. PWA + Bluetooth mesh + LoRa gateway ile afet bölgelerinde kesintisiz haberleşme sağlar. Silifke'de doğar, Türkiye'nin her ilçesine şablon olur. Silifke Teknoloji Topluluğu ile birlikte geliştiriliyor.",
          duration: "2025 - Devam Ediyor",
          impact: "Afet anında internetsiz haberleşme altyapısı; Türkiye geneline şablon olması hedefleniyor."
        },
        en: {
          title: "Fener – Offline Communication Network",
          description: "A communication network that works without internet during disasters",
          longDescription: "An open-source, citizen-owned communication infrastructure that works even when the internet is down and cell towers have collapsed. PWA + Bluetooth mesh + LoRa gateway ensures uninterrupted communication in disaster zones. Born in Silifke, designed to become a blueprint for every district in Turkey. Developed together with Silifke Technology Community.",
          duration: "2025 – Ongoing",
          impact: "Offline communication infrastructure for disasters; aimed to become a nationwide blueprint across Turkey."
        }
      }
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&h=400&fit=crop&auto=format&q=80",
      category: 'web',
      status: 'in-progress' as const,
      technologies: ['React', 'Node.js', 'QR Code API', 'PostgreSQL', 'Tailwind CSS'],
      teamSize: 8,
      demoUrl: 'https://www.menusmy.com/',
      translations: {
        tr: {
          title: "QR Kod Hizmet Platformu",
          description: "İşletmeler için dinamik QR kod oluşturma ve yönetim sistemi",
          longDescription: "Yerel işletmelerin dijital menü, ürün katalogu, iletişim bilgileri ve kampanya yönetimini tek bir QR kod üzerinden sunmalarını sağlayan kapsamlı platform. Dinamik QR kodlar sayesinde içerik güncellemeleri anında yansıyor, analitik panel ile tarama istatistikleri takip edilebiliyor. Restoran menüleri, emlak ilanları, etkinlik biletleri ve kartvizit gibi farklı kullanım senaryolarını destekliyor.",
          duration: "Mart 2026 - Haziran 2026",
          impact: "İlk 10 işletmeye pilot uygulama Nisan 2026'da başlıyor."
        },
        en: {
          title: "QR Code Service Platform",
          description: "Dynamic QR code generation and management system for businesses",
          longDescription: "A comprehensive platform enabling local businesses to present their digital menus, product catalogs, contact information, and campaign management through a single QR code. Dynamic QR codes allow instant content updates, and an analytics dashboard tracks scan statistics. Supports various use cases including restaurant menus, real estate listings, event tickets, and business cards.",
          duration: "March 2026 – June 2026",
          impact: "Pilot application for the first 10 businesses starts in April 2026."
        }
      }
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format&q=80",
      category: 'web',
      status: 'completed' as const,
      technologies: ['React', 'TypeScript', 'Node.js', 'Supabase', 'Tailwind CSS'],
      teamSize: 4,
      demoUrl: 'https://www.plansmy.com/',
      translations: {
        tr: {
          title: "Silifke Teknoloji Topluluğu Organizasyon Paneli",
          description: "Topluluk yönetimi, üye takibi, etkinlik ve proje içerik yönetimi paneli",
          longDescription: "Silifke Teknoloji Topluluğu'nun tüm operasyonlarını tek merkezden yönetmek için geliştirilen kapsamlı organizasyon paneli. Üye başvuru yönetimi, etkinlik oluşturma ve düzenleme, proje içerik yönetimi (CMS), ekip üyesi profilleri, istatistik takibi ve duyuru sistemi gibi modüller içerir. Supabase altyapısı ile gerçek zamanlı veri senkronizasyonu sağlar.",
          duration: "Ocak 2026 - Mart 2026",
          impact: "Topluluk yönetimi tamamen dijitalleştirildi, tüm içerikler panelden yönetiliyor."
        },
        en: {
          title: "Silifke Technology Community Organization Panel",
          description: "Community management, member tracking, event and project content management panel",
          longDescription: "A comprehensive organization panel developed to manage all operations of Silifke Technology Community from a single hub. Includes modules for member application management, event creation and editing, project content management (CMS), team member profiles, statistics tracking, and announcement system. Provides real-time data synchronization with Supabase infrastructure.",
          duration: "January 2026 – March 2026",
          impact: "Community management fully digitalized, all content managed from the panel."
        }
      }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&auto=format&q=80",
      category: 'web',
      status: 'in-progress' as const,
      technologies: ['React', 'Node.js', 'KÖK-OS', 'Tailwind CSS', 'Supabase'],
      teamSize: 6,
      demoUrl: 'https://koksmy.com',
      translations: {
        tr: {
          title: "KÖK-OS - Yerel İşletme Dijitalleşme Platformu",
          description: "Simay Teknoloji altyapısıyla işletmelere dijital dönüşüm çözümleri sunan platform",
          longDescription: "KÖK-OS (Kökten Operasyon Sistemi), yerel esnaf ve KOBİ'lerin dijital dünyaya geçişini destekleyen kapsamlı bir platformdur. Simay Teknoloji altyapısı üzerinden işletmelere web sitesi kurulumu, dijital menü, online sipariş sistemi, sosyal medya yönetimi ve e-ticaret çözümleri sunulmaktadır. Her işletme için özelleştirilmiş dijital dönüşüm planları hazırlanarak pilot uygulamalar başlatılmıştır.",
          duration: "Ocak 2026 - Devam Ediyor",
          impact: "İlk 5 işletmenin dijital dönüşümü tamamlandı, 10 işletme hedefleniyor."
        },
        en: {
          title: "KÖK-OS - Local Business Digitalization Platform",
          description: "Platform providing digital transformation solutions to businesses via Simay Teknoloji infrastructure",
          longDescription: "KÖK-OS (Root Operation System) is a comprehensive platform supporting local artisans and SMEs in their digital transformation journey. Through Simay Teknoloji infrastructure, it offers businesses website setup, digital menus, online ordering systems, social media management, and e-commerce solutions. Customized digital transformation plans are prepared for each business with pilot implementations underway.",
          duration: "January 2026 – Ongoing",
          impact: "Digital transformation of the first 5 businesses completed, targeting 10 businesses."
        }
      }
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=400&fit=crop&auto=format&q=80",
      category: 'web',
      status: 'planning' as const,
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS S3'],
      teamSize: 4,
      translations: {
        tr: {
          title: "Silifke Teknoloji Topluluğu AI Destekli Dijital Radyo",
          description: "Yapay zeka destekli dijital radyo platformumuz",
          longDescription: "Silifke Teknoloji Topluluğu'nun yapay zeka destekli dijital radyo yayını. Teknoloji sohbetleri, müzik ve yapay zeka kürasyonu ile 7/24 yayın.",
          duration: "Ocak 2025 - Nisan 2025",
          impact: "İlk yayın Mayıs 2025'te başlıyor."
        },
        en: {
          title: "Silifke Technology Community AI Powered Digital Radio",
          description: "Our AI-powered digital radio platform",
          longDescription: "Silifke Technology Community's AI-backed digital radio broadcast. 24/7 broadcasting with tech talks, music, and AI curation.",
          duration: "January 2025 – April 2025",
          impact: "First broadcast starts in May 2025."
        }
      }
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&auto=format&q=80",
      category: 'web',
      status: 'completed' as const,
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      teamSize: 3,
      translations: {
        tr: {
          title: "Silifke Teknoloji Topluluğu Web Sitesi",
          description: "Topluluğumuzun resmi web sitesi ve üye yönetim sistemi",
          longDescription: "Silifke Teknoloji Topluluğu olarak üyelerimizin bir araya geldiği, etkinliklerimizi duyurduğumuz ve projelerimizi sergilediğimiz modern web platformu. Üye girişi, başvuru yönetimi, blog ve etkinlik takvimi modülleri tamamlandı; şimdi içerik yönetimi ve performans optimizasyonu üzerinde çalışıyoruz.",
          duration: "Aralık 2024 - Şubat 2025",
          impact: "Beta yayını 1 Mart 2025'te planlanıyor."
        },
        en: {
          title: "Silifke Technology Community Website",
          description: "Official community website and member management system",
          longDescription: "A modern web platform where our members connect, events are announced, and projects are showcased. Member login, application management, blog, and events calendar modules are finished; we are currently focusing on content management and performance optimisation.",
          duration: "December 2024 – February 2025",
          impact: "Beta launch planned for 1 March 2025."
        }
      }
    }
  ] as const;

  // Hardcoded + CMS verilerini birleştir
  const projects: Project[] = useMemo(() => {
    const hardcodedProjects = projectData.map((project) => {
      const translation = project.translations[language];
      return {
        id: project.id,
        image: project.image,
        category: project.category,
        status: project.status,
        technologies: Array.from(project.technologies),
        teamSize: project.teamSize,
        title: translation.title,
        description: translation.description,
        longDescription: translation.longDescription,
        duration: translation.duration,
        impact: translation.impact,
        demoUrl: 'demoUrl' in project ? (project as { demoUrl?: string }).demoUrl : undefined,
        githubUrl: 'githubUrl' in project ? (project as { githubUrl?: string }).githubUrl : undefined,
      } satisfies Project;
    });
    if (cmsItems.length > 0) {
      const cmsProjects = cmsItems.map((item, i) => cmsItemToProject(item, i + 100, language));
      // Normalize ve kısmi eşleşme: CMS title hardcoded title'ın parçasıysa veya tam tersiyse duplicate say
      // Normalize: ortak anahtar kelimeleri çıkar ve kelime bazlı örtüşme kontrol et
      const getKeywords = (t: string) => {
        const stripped = t.toLowerCase().replace(/kulübü|kulüp|topluluğu|topluluk|club|community|silifke|teknoloji|kök-os|platformu?|projesi?/gi, '');
        return new Set(stripped.split(/\s+/).filter(w => w.length > 2));
      };
      const hardcodedKws = hardcodedProjects.map(p => getKeywords(p.title));
      const uniqueCmsProjects = cmsProjects.filter(cmsP => {
        const cmsKw = getKeywords(cmsP.title);
        // 2+ ortak anahtar kelime varsa duplicate say
        return !hardcodedKws.some(hKw => {
          let overlap = 0;
          for (const w of cmsKw) if (hKw.has(w)) overlap++;
          return overlap >= 2;
        });
      });
      return [...hardcodedProjects, ...uniqueCmsProjects];
    }
    return hardcodedProjects;
  }, [cmsItems, language]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'planning': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusText = (status: string) => {
    if (isTR) {
      switch (status) {
        case 'completed': return 'Tamamlandı';
        case 'in-progress': return 'Devam Ediyor';
        case 'planning': return 'Planlanıyor';
        default: return status;
      }
    }

    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'planning': return 'Planning';
      default: return status;
    }
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen overflow-hidden">
      {/* Background Effects */}
      <Suspense fallback={<div className="absolute inset-0 bg-black/90" />}>
        <MatrixRain />
        <InteractiveDots />
      </Suspense>

      {/* Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/100 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/80 z-20" />

      {/* Main Content */}
      <main className="relative z-40 pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button */}
          {onBack && (
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{isTR ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
            </motion.button>
          )}
          {/* Hero Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="glass-panel glass-border-accent px-6 sm:px-12 py-12 text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <span className="glass-pill text-[0.65rem] sm:text-xs text-yellow-100">{isTR ? 'Üretim Yol Haritası' : 'Build Roadmap'}</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              {isTR ? 'Projelerimiz' : 'Our Projects'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200/90 max-w-4xl mx-auto leading-relaxed">
              {isTR
                ? "Silifke'nin geleceğini inşa eden teknoloji planlarımızı keşfedin. Her proje, topluluğun ihtiyaçlarına cam gibi şeffaf ve güçlü çözümler sunmak için tasarlandı."
                : 'Explore the technology plans shaping the future of Silifke. Every project is designed to deliver transparent, resilient solutions for our community.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {(isTR
                ? ['Web & Mobil Ürünler', 'Topluluk Programları', 'AI ve Veri Projeleri']
                : ['Web & Mobile Products', 'Community Programmes', 'AI & Data Projects']).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.25em] uppercase text-gray-200 backdrop-blur-lg">
                    {tag}
                  </span>
                ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  className="group glass-panel glass-border-accent overflow-hidden cursor-pointer hover:-translate-y-3"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
                                   border ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-medium rounded border border-yellow-400/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs font-medium rounded border border-gray-400/20">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{isTR ? `${project.teamSize} kişi` : `${project.teamSize} people`}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </div>
                    </div>

                    {/* Direct Demo Link */}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg
                                   border border-yellow-400/30 bg-yellow-400/5 text-yellow-400 text-sm font-semibold
                                   hover:bg-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {isTR ? 'Siteye Git' : 'Visit Site'}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>


        </div>
        <Footer />
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-black/90 via-black/95 to-black/90 backdrop-blur-md
                       rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto
                       border border-yellow-400/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full
                           flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-300"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h2>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold
                                 border ${getStatusColor(selectedProject.status)}`}>
                    {getStatusText(selectedProject.status)}
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8">
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {selectedProject.longDescription}
                </p>

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">{isTR ? 'Teknolojiler' : 'Technologies'}</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-yellow-400/10 text-yellow-400 font-medium rounded-lg border border-yellow-400/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedProject.teamSize}</div>
                    <div className="text-gray-400">{isTR ? 'Ekip Üyesi' : 'Team Members'}</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedProject.duration}</div>
                    <div className="text-gray-400">{isTR ? 'Süre' : 'Duration'}</div>
                  </div>
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{selectedProject.impact}</div>
                    <div className="text-gray-400">{isTR ? 'Etki' : 'Impact'}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 
                               text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>{isTR ? 'Canlı Demo' : 'Live Demo'}</span>
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-3 bg-black/50 border border-gray-600
                               text-white font-semibold px-6 py-3 rounded-xl hover:border-yellow-400/50 hover:text-yellow-400
                               transition-all duration-300"
                    >
                      <Github className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;
