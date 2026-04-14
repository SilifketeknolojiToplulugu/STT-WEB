import React, { useMemo, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Footer";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Ticket,
  Star,
  Share2,
  Code,
  GraduationCap,
  Users2,
  Lightbulb,
  Coffee,
  Award,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { useCmsCollection } from "../../hooks/useCmsCollection";
import type { CmsCollectionItem } from "../../lib/cmsClient";

// Lazy load background components
const MatrixRain = lazy(() => import("../MatrixRain"));
const InteractiveDots = lazy(() => import("../InteractiveDots"));

interface Event {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  price: number;
  image: string;
  speaker?: string;
  speakerTitle?: string;
  speakerImage?: string;
  pendingSpeakerMessage?: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  featured: boolean;
}

interface EventsPageProps {
  onBack?: () => void;
}

// Fallback placeholder for missing event images
const EVENT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&auto=format&q=80';

function cmsItemToEvent(item: CmsCollectionItem, index: number, lang: 'tr' | 'en'): Event {
  const d = item.data;
  // CMS panel field name fallbacks: try both localized and generic keys
  const title = (lang === 'tr' ? (d.title_tr || d.title) : (d.title_en || d.title)) || d.title_tr || d.title || '';
  const description = (lang === 'tr' ? (d.description_tr || d.description) : (d.description_en || d.description)) || d.description_tr || d.description || '';
  const longDesc = (lang === 'tr' ? (d.long_description_tr || d.longDescription || d.long_description) : (d.long_description_en || d.longDescription || d.long_description)) || d.long_description_tr || d.longDescription || d.long_description || description;
  const location = (lang === 'tr' ? (d.location_tr || d.location) : (d.location_en || d.location)) || d.location_tr || d.location || '';
  const date = (lang === 'tr' ? (d.date_tr || d.date) : (d.date_en || d.date)) || d.date_tr || d.date || '';

  const capacity = parseInt(d.capacity || '0', 10) || 0;
  const registered = parseInt(d.registered || '0', 10) || 0;

  // image_url fallback: try multiple field names, then use placeholder
  // Trim values and treat empty strings as falsy
  const rawImage = (d.image_url || d.image || d.imageUrl || d.img || '').trim();
  const image = rawImage || EVENT_PLACEHOLDER_IMAGE;

  return {
    id: index + 1,
    title,
    description,
    longDescription: longDesc,
    category: d.category || 'meetup',
    date,
    time: d.time || '',
    location,
    capacity: capacity || registered || 1, // prevent 0 capacity causing division issues
    registered,
    price: parseInt(d.price || '0', 10),
    image,
    speaker: d.speaker || undefined,
    speakerTitle: d.speaker_title || d.speakerTitle || undefined,
    speakerImage: d.speaker_image || d.speakerImage || undefined,
    tags: d.tags ? d.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    status: (['upcoming', 'ongoing', 'completed'].includes(d.event_status || d.status) ? (d.event_status || d.status) : 'upcoming') as Event['status'],
    featured: d.featured === 'true' || d.featured === '1',
  };
}

const EventsPage: React.FC<EventsPageProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isTR = language === 'tr';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { items: cmsItems } = useCmsCollection('events');

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

  const categories = useMemo(
    () => [
      { id: 'all', name: isTR ? 'Tümü' : 'All', icon: <Calendar className="w-4 h-4" /> },
      { id: 'workshop', name: isTR ? 'Atölye Çalışması' : 'Workshop', icon: <Code className="w-4 h-4" /> },
      { id: 'seminar', name: isTR ? 'Seminer' : 'Seminar', icon: <GraduationCap className="w-4 h-4" /> },
      { id: 'meetup', name: isTR ? 'Buluşma' : 'Meetup', icon: <Users2 className="w-4 h-4" /> },
      { id: 'hackathon', name: 'Hackathon', icon: <Lightbulb className="w-4 h-4" /> },
      { id: 'networking', name: isTR ? 'Networking' : 'Networking', icon: <Coffee className="w-4 h-4" /> },
      { id: 'competition', name: isTR ? 'Yarışma' : 'Competition', icon: <Award className="w-4 h-4" /> }
    ],
    [isTR]
  );

  const eventsData = [
    {
      id: 10,
      category: 'meetup',
      image: "/images/Untitled.webp",
      capacity: 10,
      registered: 7,
      price: 0,
      status: 'completed' as const,
      featured: true,
      speakerImage: '/bahadirgemalmaz.webp',
      translations: {
        tr: {
          title: "Silifke Teknoloji Topluluğu 4. Buluşma",
          description: "Git & GitHub eğitimi, yapay zeka uygulamaları ve proje görev dağılımı",
          longDescription: "Silifke Teknoloji Topluluğu 4. Buluşma'da Git ve GitHub temel eğitimi verildi. Yapay zekayı etkili kullanma yöntemleri hakkında bilgi ve uygulamalı ders gerçekleştirildi. Projeler ve bağlamları hakkında detaylı bilgilendirme yapıldı. İlk projede yapılacak check listler dağıtıldı. Görev teslimi ve panelin nasıl kullanılması gerektiği hakkında bilgiler verildi.",
          date: '12 Mart 2026 Perşembe',
          time: '20:00 - 22:00',
          location: 'Silifke Teknoloji Topluluğu Ofisi',
          speaker: 'Bahadır Gemalmaz',
          speakerTitle: 'Kurucu & Teknik Lider',
          pendingSpeakerMessage: undefined,
          tags: ['Git', 'GitHub', 'AI', 'Proje Yönetimi', 'Eğitim']
        },
        en: {
          title: "Silifke Technology Community 4th Meetup",
          description: "Git & GitHub training, AI usage methods, and project task distribution",
          longDescription: "At the 4th Meetup of Silifke Technology Community, Git and GitHub fundamentals were taught. Practical lessons on effective AI usage methods were delivered. Detailed information about projects and their contexts was provided. Checklists for the first project were distributed. Guidance on task delivery and panel usage was given.",
          date: 'Thursday, 12 March 2026',
          time: '20:00 – 22:00',
          location: 'Silifke Technology Community Office',
          speaker: 'Bahadır Gemalmaz',
          speakerTitle: 'Founder & Technical Lead',
          pendingSpeakerMessage: undefined,
          tags: ['Git', 'GitHub', 'AI', 'Project Management', 'Training']
        }
      }
    },
    {
      id: 11,
      category: 'meetup',
      image: "/images/3-top.webp",
      capacity: 10,
      registered: 8,
      price: 0,
      status: 'completed' as const,
      featured: false,
      speakerImage: '/bahadirgemalmaz.webp',
      translations: {
        tr: {
          title: "Silifke Teknoloji Topluluğu 3. Buluşma",
          description: "Sözleşmeler imzalandı, ilk projeler belirlendi, departmanlar ve görev dağılımları yapıldı",
          longDescription: "Silifke Teknoloji Topluluğu 3. Buluşma'da önemli adımlar atıldı. Topluluk üyeleriyle resmi sözleşmeler imzalandı. İlk projeler belirlenerek ekiplere dağıtıldı. Departmanlar oluşturuldu ve görev dağılımları yapıldı. Topluluğun profesyonel yapılanması bu toplantıyla şekillenmeye başladı.",
          date: '5 Mart 2026 Perşembe',
          time: '20:00 - 22:00',
          location: 'Silifke Teknoloji Topluluğu Ofisi',
          speaker: 'Bahadır Gemalmaz',
          speakerTitle: 'Kurucu & Teknik Lider',
          pendingSpeakerMessage: undefined,
          tags: ['Sözleşme', 'Proje Belirleme', 'Departman', 'Görev Dağılımı']
        },
        en: {
          title: "Silifke Technology Community 3rd Meetup",
          description: "Contracts signed, first projects determined, departments and task distributions completed",
          longDescription: "Important milestones were achieved at the 3rd Meetup of Silifke Technology Community. Official contracts were signed with club members. First projects were determined and distributed to teams. Departments were established and task distributions were completed. The professional structuring of the club began to take shape with this meeting.",
          date: 'Thursday, 5 March 2026',
          time: '20:00 – 22:00',
          location: 'Silifke Technology Community Office',
          speaker: 'Bahadır Gemalmaz',
          speakerTitle: 'Founder & Technical Lead',
          pendingSpeakerMessage: undefined,
          tags: ['Contracts', 'Project Planning', 'Departments', 'Task Distribution']
        }
      }
    },
    {
      id: 2,
      category: 'meetup',
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop&auto=format&q=80",
      capacity: 11,
      registered: 10,
      price: 0,
      status: 'completed' as const,
      featured: false,
      speakerImage: undefined,
      translations: {
        tr: {
          title: "Silifke Teknoloji Topluluğu 2. Buluşma - Proje & Yol Haritası Toplantısı",
          description: "2026 Proje ve Yol Haritası Toplantısı",
          longDescription: "Silifke Teknoloji Topluluğu olarak yeni dönem projelerimizi ve yol haritamızı konuşacağımız stratejik planlama toplantısı.",
          date: '17 Ocak 2026 Cumartesi',
          time: 'Planlanıyor',
          location: 'Silifke Teknoloji Topluluğu Ofisi',
          speaker: undefined,
          speakerTitle: undefined,
          pendingSpeakerMessage: undefined,
          tags: ['Strategy', 'Roadmap', 'Planning']
        },
        en: {
          title: "Silifke Technology Community 2nd Meetup - Project & Roadmap Meeting",
          description: "2026 Project and Roadmap Meeting",
          longDescription: "Strategic planning meeting where we will discuss our new term projects and roadmap as Silifke Technology Community.",
          date: 'Saturday, 17 January 2026',
          time: 'Planned',
          location: 'Silifke Technology Community Office',
          speaker: undefined,
          speakerTitle: undefined,
          pendingSpeakerMessage: undefined,
          tags: ['Strategy', 'Roadmap', 'Planning']
        }
      }
    },
    {
      id: 1,
      category: 'meetup',
      image: "/images/stk-tanisma.webp",
      capacity: 11,
      registered: 11,
      price: 0,
      status: 'completed' as const,
      featured: false,
      speakerImage: '/bahadirgemalmaz.webp',
      translations: {
        tr: {
          title: 'Silifke Teknoloji Topluluğu İlk Buluşması',
          description: 'Topluluğumuzun kuruluş buluşması ve tanışma etkinliği',
          longDescription:
            "Silifke Teknoloji Topluluğu'nun ilk resmi buluşması! Tanışma oturumlarının ardından 2025-2026 yol haritamızı paylaşacak, mentorluk programı ve projelerimizi duyuracağız. Etkinlik sonunda networking alanı ve küçük ikramlar olacak.",
          date: '29 Kasım 2025 Cumartesi',
          time: '20:00 - 22:00',
          location: 'Silifke Belediyesi Kültür Merkezi - Konferans Salonu',
          speaker: 'Bahadır Gemalmaz',
          speakerTitle: 'Kurucu & Teknik Lider',
          pendingSpeakerMessage: undefined,
          tags: ['Networking', 'Roadmap', 'Community']
        },
        en: {
          title: 'Silifke Technology Community Kick-off Meetup',
          description: 'Our founding gathering and networking event',
          longDescription:
            "The first official meetup of Silifke Technology Community! After welcome sessions we will share our 2025–2026 roadmap, announce the mentorship programme, and walk through upcoming projects. We close with a networking lounge and light refreshments.",
          date: 'Saturday, 29 November 2025',
          time: '20:00 – 21:00',
          location: 'Silifke Municipality Cultural Center – Conference Hall',
          speaker: 'Bahadır Gemalmaz',
          speakerTitle: 'Founder & Technical Lead',
          pendingSpeakerMessage: undefined,
          tags: ['Networking', 'Roadmap', 'Community']
        }
      }
    }
  ] as const;

  // Hardcoded + CMS verilerini birleştir (CMS varsa hardcoded'a ekle)
  const events: Event[] = useMemo(() => {
    // Önce hardcoded verileri al
    const hardcodedEvents = eventsData.map((event) => {
      const translation = event.translations[language];
      return {
        id: event.id,
        category: event.category,
        date: translation.date,
        time: translation.time,
        location: translation.location,
        capacity: event.capacity,
        registered: event.registered,
        price: event.price,
        image: event.image,
        title: translation.title,
        description: translation.description,
        longDescription: translation.longDescription,
        speaker: translation.speaker,
        speakerTitle: translation.speakerTitle,
        speakerImage: event.speakerImage,
        pendingSpeakerMessage: translation.pendingSpeakerMessage,
        tags: Array.from(translation.tags),
        status: event.status,
        featured: event.featured
      } satisfies Event;
    });
    // CMS verisi varsa hardcoded'a ekle (title bazlı duplicate kontrolü)
    if (cmsItems.length > 0) {
      const cmsEvents = cmsItems.map((item, i) => cmsItemToEvent(item, i + 100, language));
      // Normalize: ortak anahtar kelimeleri çıkar ve kelime bazlı örtüşme kontrol et
      const getKeywords = (t: string) => {
        const stripped = t.toLowerCase().replace(/kulübü|kulüp|topluluğu|topluluk|club|community|silifke|teknoloji/gi, '');
        return new Set(stripped.split(/\s+/).filter(w => w.length > 2));
      };
      const hardcodedKws = hardcodedEvents.map(e => getKeywords(e.title));
      const uniqueCmsEvents = cmsEvents.filter(cmsE => {
        const cmsKw = getKeywords(cmsE.title);
        return !hardcodedKws.some(hKw => {
          let overlap = 0;
          for (const w of cmsKw) if (hKw.has(w)) overlap++;
          return overlap >= 2;
        });
      });
      return [...hardcodedEvents, ...uniqueCmsEvents];
    }
    return hardcodedEvents;
  }, [cmsItems, language]);

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredEvents = events.filter(event => event.featured);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'ongoing': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'completed': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusText = (status: string) => {
    if (isTR) {
      switch (status) {
        case 'upcoming': return 'Yaklaşan';
        case 'ongoing': return 'Devam Ediyor';
        case 'completed': return 'Tamamlandı';
        default: return status;
      }
    }

    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAvailableSpots = (event: Event) => {
    return event.capacity - event.registered;
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
              <span className="glass-pill text-[0.65rem] sm:text-xs text-yellow-100">{isTR ? 'Silifke\'de Teknoloji Buluşmaları' : 'Technology Gatherings in Silifke'}</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              {isTR ? 'Etkinlikler' : 'Events'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200/90 max-w-4xl mx-auto leading-relaxed">
              {isTR
                ? 'Teknoloji gündemini takip edin, yeni beceriler kazanın ve toplulukla aynı cam masada buluşun. Etkinliklerin çoğu ücretsiz veya sembolik katkı payı ile.'
                : 'Stay close to the technology agenda, build new skills, and sit at the same glass table with the community. Most events are free or have symbolic contributions.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {(isTR ? ['Atölye', 'Networking', 'Hackathon', 'Sosyal Etki'] : ['Workshop', 'Networking', 'Hackathon', 'Social Impact']).map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.25em] uppercase text-gray-200 backdrop-blur-lg">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Featured Events */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent flex items-center justify-center"
            >
              <Star className="w-8 h-8 text-yellow-400 mr-3" />
              {isTR ? 'Öne Çıkan Etkinlikler' : 'Featured Events'}
            </motion.h2>

            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                {featuredEvents.slice(0, 2).map((event) => (
                  <motion.div
                    key={event.id}
                    variants={fadeInUp}
                    className="group glass-panel glass-border-accent overflow-hidden cursor-pointer hover:-translate-y-3"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image || EVENT_PLACEHOLDER_IMAGE}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = EVENT_PLACEHOLDER_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                        {isTR ? '⭐ Öne Çıkan' : '⭐ Featured'}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {event.price === 0 ? (isTR ? 'Ücretsiz' : 'Free') : `₺${event.price}`}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-3 text-yellow-400" />
                          <span>{formatDate(event.date)} • {event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-3 text-yellow-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Users className="w-4 h-4 mr-3 text-yellow-400" />
                          <span>
                            {isTR
                              ? `${event.registered}/${event.capacity} katılımcı`
                              : `${event.registered}/${event.capacity} attendees`}
                          </span>
                          {event.registered === 0 && (
                            <span className="ml-2 text-green-400 text-sm font-semibold">
                              {isTR ? '(İlk katılımcı siz olun!)' : '(Be the very first attendee!)'}
                            </span>
                          )}
                          {getAvailableSpots(event) <= 5 && getAvailableSpots(event) > 0 && event.registered > 0 && (
                            <span className="ml-2 text-orange-400 text-sm font-semibold">
                              {isTR
                                ? `(Sadece ${getAvailableSpots(event)} yer kaldı!)`
                                : `(Only ${getAvailableSpots(event)} spots left!)`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-yellow-400/10 text-yellow-400 text-sm font-medium rounded-full border border-yellow-400/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Filter and Search */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel glass-border-accent p-6 mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-200/80" />
                  <input
                    type="text"
                    placeholder={isTR ? 'Etkinlik ara...' : 'Search events...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300/60 focus:bg-white/10 transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium
                                transition-all duration-300 border ${selectedCategory === category.id
                        ? 'border-yellow-400/40 bg-yellow-400/15 text-yellow-200'
                        : 'border-white/10 bg-white/5 text-gray-200 hover:border-yellow-300/40 hover:text-yellow-200'
                      }`}
                  >
                    {category.icon}
                    <span className="hidden sm:inline">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  className="group glass-panel glass-border-accent overflow-hidden cursor-pointer hover:-translate-y-3"
                  onClick={() => setSelectedEvent(event)}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || EVENT_PLACEHOLDER_IMAGE}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = EVENT_PLACEHOLDER_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Status Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold
                                   border ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {event.price === 0 ? (isTR ? 'Ücretsiz' : 'Free') : `₺${event.price}`}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>{isTR ? 'Katılımcı' : 'Attendees'}</span>
                        <span>{event.registered}/{event.capacity}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${event.registered > 0 ? (event.registered / event.capacity) * 100 : 0}%` }}
                        ></div>
                      </div>
                      {event.registered === 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {isTR ? 'Henüz katılımcı yok - İlk siz olun!' : 'No attendees yet – be the first!'}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {event.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-medium rounded border border-yellow-400/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs font-medium rounded border border-gray-400/20">
                          +{event.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-center py-20"
            >
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">{isTR ? 'Etkinlik bulunamadı' : 'No events found'}</h3>
              <p className="text-gray-400">{isTR ? 'Arama kriterlerinizi değiştirip tekrar deneyin.' : 'Try adjusting your filters and search again.'}</p>
            </motion.div>
          )}
        </div>
        <Footer />
      </main>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
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
                  src={selectedEvent.image || EVENT_PLACEHOLDER_IMAGE}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = EVENT_PLACEHOLDER_IMAGE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full
                           flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-300"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center space-x-4">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold
                                   border ${getStatusColor(selectedEvent.status)}`}>
                      {getStatusText(selectedEvent.status)}
                    </div>
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedEvent.price === 0 ? (isTR ? 'Ücretsiz' : 'Free') : `₺${selectedEvent.price}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8">
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {selectedEvent.longDescription}
                </p>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">{isTR ? 'Etkinlik Detayları' : 'Event Details'}</h3>
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-3 text-yellow-400" />
                      <span>{formatDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 mr-3 text-yellow-400" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-3 text-yellow-400" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="w-5 h-5 mr-3 text-yellow-400" />
                      <span>
                        {isTR
                          ? `${selectedEvent.registered}/${selectedEvent.capacity} katılımcı`
                          : `${selectedEvent.registered}/${selectedEvent.capacity} attendees`}
                      </span>
                      {selectedEvent.registered === 0 && (
                        <span className="ml-2 text-green-400 text-sm font-semibold">
                          {isTR ? '(İlk katılımcı siz olun!)' : '(Be the first attendee!)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Speaker Info */}
                  {selectedEvent.speaker && (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">{isTR ? 'Konuşmacı' : 'Speaker'}</h3>
                      <div className="flex items-center space-x-4">
                        <img
                          src={selectedEvent.speakerImage || EVENT_PLACEHOLDER_IMAGE}
                          alt={selectedEvent.speaker}
                          className="w-16 h-16 rounded-full border-2 border-yellow-400/30"
                          onError={(e) => { (e.target as HTMLImageElement).src = EVENT_PLACEHOLDER_IMAGE; }}
                        />
                        <div>
                          <div className="text-lg font-semibold text-white">{selectedEvent.speaker}</div>
                          <div className="text-yellow-400">{selectedEvent.speakerTitle}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!selectedEvent.speaker && selectedEvent.pendingSpeakerMessage && (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">{isTR ? 'Konuşmacı' : 'Speaker'}</h3>
                      <div className="text-gray-400 italic">
                        {selectedEvent.pendingSpeakerMessage}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">{isTR ? 'Etiketler' : 'Tags'}</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedEvent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-yellow-400/10 text-yellow-400 font-medium rounded-lg border border-yellow-400/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {getAvailableSpots(selectedEvent) > 0 ? (
                    <button className="flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 
                                     text-black font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300">
                      <Ticket className="w-5 h-5" />
                      <span>{isTR ? 'Katılım Sağla' : 'Join Event'}</span>
                    </button>
                  ) : (
                    <button className="flex items-center justify-center space-x-3 bg-gray-600 
                                     text-gray-300 font-bold px-8 py-4 rounded-xl cursor-not-allowed">
                      <Ticket className="w-5 h-5" />
                      <span>{isTR ? 'Kontenjan Doldu' : 'Fully Booked'}</span>
                    </button>
                  )}

                  <button className="flex items-center justify-center space-x-3 bg-black/50 border border-gray-600
                                   text-white font-semibold px-8 py-4 rounded-xl hover:border-yellow-400/50 hover:text-yellow-400
                                   transition-all duration-300">
                    <Share2 className="w-5 h-5" />
                    <span>{isTR ? 'Paylaş' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;
