import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Clock, Users, Star, Mail } from 'lucide-react';
import { getApplicationStatus } from '../../lib/supabaseClient';
import { useLanguage } from '../../i18n/LanguageContext';

interface ThankYouPageProps {
  onBack: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isTR = language === 'tr';
  const [applicationStatus, setApplicationStatus] = useState<{
    status?: string;
    level?: string;
    score?: number;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get application ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('applicationId');

    if (applicationId) {
      // Fetch application status
      getApplicationStatus(applicationId).then((status) => {
        setApplicationStatus(status);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const getStatusMessage = () => {
    if (isLoading) return isTR ? 'Başvurunuz işleniyor...' : 'Your application is being processed...';

    switch (applicationStatus.status) {
      case 'approved':
        return isTR ? 'Tebrikler! Başvurunuz onaylandı!' : 'Congratulations! Your application has been approved!';
      case 'under_review':
        return isTR ? 'Başvurunuz değerlendiriliyor...' : 'Your application is under review...';
      case 'rejected':
        return isTR ? 'Başvurunuz reddedildi.' : 'Your application was declined.';
      default:
        return isTR ? 'Başvurunuz alındı!' : 'We received your application!';
    }
  };

  const getStatusColor = () => {
    switch (applicationStatus.status) {
      case 'approved':
        return 'text-green-400';
      case 'under_review':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const getLevelInfo = () => {
    switch (applicationStatus.level) {
      case 'community':
        return {
          title: isTR ? 'Topluluk Üyesi' : 'Community Member',
          description: isTR ? 'Açık topluluk etkinliklerine katılabilirsiniz' : 'You can join open community events',
          icon: <Users className="w-6 h-6" />
        };
      case 'contributor':
        return {
          title: isTR ? 'Katkıcı Üye' : 'Contributor Member',
          description: isTR ? 'Projelere aktif katkı sağlayabilirsiniz' : 'You can actively contribute to projects',
          icon: <Star className="w-6 h-6" />
        };
      case 'core':
        return {
          title: isTR ? 'Çekirdek Üye' : 'Core Member',
          description: isTR ? 'Topluluk yönetiminde söz sahibisiniz' : 'You have a voice in community leadership',
          icon: <Star className="w-6 h-6" />
        };
      default:
        return null;
    }
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="relative bg-background text-foreground min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/100" />

      <div className="relative z-40 pt-8 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <button
              onClick={onBack}
              className="absolute top-0 left-0 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{isTR ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent mb-4">
              {isTR ? 'Başvurunuz Alındı!' : 'Application Received!'}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {isTR
                ? "Silifke Teknoloji Topluluğu'na başvurunuz başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz."
                : 'Your application has been submitted successfully. We will get in touch with you shortly.'}
            </p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-2xl p-8 mb-8"
          >
            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
                {getStatusMessage()}
              </h2>

              {applicationStatus.score && (
                <div className="mb-6">
                  <p className="text-gray-400 mb-2">{isTR ? 'Başvuru Puanınız' : 'Your Application Score'}</p>
                  <div className="text-4xl font-bold text-yellow-400">
                    {applicationStatus.score}/100
                  </div>
                </div>
              )}

              {levelInfo && (
                <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <span className="text-yellow-400">{levelInfo.icon}</span>
                    <h3 className="text-xl font-bold text-white">{levelInfo.title}</h3>
                  </div>
                  <p className="text-gray-400">{levelInfo.description}</p>
                </div>
              )}

              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">
                    <strong>{isTR ? 'Değerlendirme Süreci:' : 'Review Timeline:'}</strong> {isTR ? '1-3 iş günü' : '1-3 business days'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">
                    <strong>{isTR ? 'İletişim:' : 'Communication:'}</strong> {isTR ? 'E-posta adresinize bilgi gönderilecek' : 'We will email you an update'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">
                    <strong>{isTR ? 'Sonraki Adım:' : 'Next Step:'}</strong> {isTR ? 'Onay sonrası Discord sunucumuza davet' : 'Join our Discord after approval'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-2xl p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              {isTR ? 'Sonraki Adımlar' : 'What Happens Next'}
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-white mb-2">{isTR ? 'Değerlendirme' : 'Evaluation'}</h4>
                <p className="text-sm text-gray-400">
                  {isTR ? 'Başvurunuz puanlama sistemi ile değerlendirilecek' : 'Your application will be reviewed with our scoring system'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-yellow-400 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-white mb-2">{isTR ? 'İletişim' : 'Communication'}</h4>
                <p className="text-sm text-gray-400">
                  {isTR ? 'E-posta ile sonuç hakkında bilgilendirileceksiniz' : 'We will email you about the result'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-white mb-2">{isTR ? 'Katılım' : 'Participation'}</h4>
                <p className="text-sm text-gray-400">
                  {isTR ? 'Onay sonrası topluluk etkinliklerine katılabilirsiniz' : 'After approval you can join community activities'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-gray-400 mb-4">
              {isTR ? 'Sorularınız için bizimle iletişime geçebilirsiniz' : 'Reach out anytime if you have questions'}
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="mailto:info@simay.tech"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                {isTR ? 'E-posta' : 'Email'}
              </a>
              <a
                href="https://discord.gg/silifketeknoloji"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Discord
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
