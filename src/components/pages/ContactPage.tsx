import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Footer from "../Footer";
import {
  Mail,
  Phone,
  Clock,
  Instagram,
  Twitter,
  Github,
  ArrowLeft,
  MessageSquare
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

// Lazy load background components
const MatrixRain = lazy(() => import("../MatrixRain"));
const InteractiveDots = lazy(() => import("../InteractiveDots"));

interface ContactPageProps {
  onBack?: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isTR = language === 'tr';

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };


  // TikTok Icon Component
  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );

  // YouTube Icon Component
  const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: isTR ? 'E-posta' : 'Email',
      content: 'info@simay.tech',
      link: 'mailto:info@simay.tech'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: isTR ? 'Telefon' : 'Phone',
      content: '+90 505 777 03 14',
      link: 'tel:+905057770314'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: isTR ? 'Çalışma Saatleri' : 'Working Hours',
      content: isTR ? '7/24' : '24/7',
      link: null
    }
  ];

  const socialMedia = [
    {
      icon: <Instagram className="w-6 h-6" />,
      name: 'Instagram',
      link: 'https://www.instagram.com/silifketechnology/',
      color: 'hover:text-pink-400'
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      name: isTR ? 'Twitter' : 'X (Twitter)',
      link: 'https://x.com/SilifkeTeknoloji',
      color: 'hover:text-blue-400'
    },
    {
      icon: <YouTubeIcon className="w-6 h-6" />,
      name: 'YouTube',
      link: 'https://www.youtube.com/@SilifkeTeknoloji',
      color: 'hover:text-red-500'
    },
    {
      icon: <Github className="w-6 h-6" />,
      name: 'GitHub',
      link: 'https://github.com/silifketeknoloji',
      color: 'hover:text-gray-400'
    },
    {
      icon: <TikTokIcon className="w-6 h-6" />,
      name: 'TikTok',
      link: 'https://www.tiktok.com/@silifketeknoloji7',
      color: 'hover:text-pink-500'
    }
  ];


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
            className="glass-panel glass-border-accent px-6 sm:px-12 py-12 md:py-16 text-center mb-20"
          >
            <div className="flex justify-center mb-6">
              <span className="glass-pill text-[0.65rem] sm:text-xs text-yellow-100">{isTR ? 'Bağlantıda Kal' : 'Stay Connected'}</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              {isTR ? 'İletişim' : 'Contact'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
              {isTR
                ? "Sorularınızı yanıtlamak, projelerinize ortak olmak ve Silifke'de teknoloji hikâyeleri yazmak için buradayız."
                : 'We are here to answer your questions, collaborate on your projects, and co-create technology stories in Silifke.'}
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[isTR ? '7/24 yanıt' : '24/7 response', isTR ? '1 iş günü içinde geri dönüş' : 'Reply within one business day', isTR ? 'Topluluk tabanlı destek' : 'Community-driven support'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm md:text-base text-gray-200 backdrop-blur-md"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Media Accounts */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-16 sm:mb-20"
          >
            <motion.div
              variants={fadeInUp}
              className="glass-panel glass-border-accent p-8"
            >
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent text-center">
                {isTR ? 'Sosyal Medya Hesaplarımız' : 'Our Social Media'}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {socialMedia.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group glass-panel flex flex-col items-center space-y-3 p-6 text-gray-200 ${social.color} cursor-pointer hover:-translate-y-2`}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </div>
                    <span className="font-medium text-sm text-center">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* WhatsApp Contact */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass-panel glass-border-accent p-8">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                      {isTR ? 'WhatsApp ile İletişim' : 'Reach Us on WhatsApp'}
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                      {isTR
                        ? 'Sorularınızı, önerilerinizi veya işbirliği tekliflerinizi WhatsApp üzerinden doğrudan bizimle paylaşabilirsiniz. En kısa sürede size dönüş yapacağız.'
                        : 'Share your questions, ideas, or partnership requests with us directly on WhatsApp. We will get back to you as soon as possible.'}
                    </p>
                  </div>

                  <motion.a
                    href="https://wa.me/905057770314"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 
                             text-white text-lg font-bold px-8 py-4 rounded-xl shadow-2xl shadow-green-500/30 
                             hover:shadow-green-500/50 transition-all duration-300"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span>{isTR ? "WhatsApp'ta Mesaj Gönder" : 'Send a WhatsApp Message'}</span>
                  </motion.a>

                  <div className="mt-6 text-sm text-gray-400">
                    <p>📱 +90 505 777 03 14</p>
                    <p className="mt-1">{isTR ? '⏰ 7/24 Destek' : '⏰ 24/7 Support'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="glass-panel glass-border-accent p-8">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                  {isTR ? 'İletişim Bilgileri' : 'Contact Details'}
                </h2>

                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start space-x-4">
                      <div className="text-yellow-400 mt-1">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-300">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 glass-panel border-white/15 p-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                    {isTR ? 'Adres' : 'Address'}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {isTR
                      ? 'Gazi Mahallesi İlhan Akgün Caddesi Şahin Apartmanı No:12 Daire:4 1.Kat / GAZİ ORTAOKULU Karşısı'
                      : 'Gazi Mahallesi, Ilhan Akgun Street, Sahin Apt. No:12, Floor:1, Flat:4 / Across from Gazi Middle School'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ContactPage;
