import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: {
    vision: string;
    services: string[];
    technologies: string[];
    examples: string[];
  };
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, content }) => {
  const { language } = useLanguage();
  const t = language === 'tr'
    ? {
        vision: 'Vizyonumuz',
        services: 'Hizmetlerimiz',
        technologies: 'Teknolojiler',
        examples: 'Örnek Projeler',
        close: 'Kapat'
      }
    : {
        vision: 'Our Vision',
        services: 'Our Services',
        technologies: 'Technologies',
        examples: 'Sample Projects',
        close: 'Close'
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-black/95 via-black/98 to-black/95 rounded-2xl border border-yellow-400/30 shadow-2xl shadow-yellow-400/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-8 pb-6 border-b border-yellow-400/20">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-yellow-500/10 to-yellow-600/10" />
              <div className="relative flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide font-['Space_Grotesk',_'Inter',_system-ui] drop-shadow-2xl [text-shadow:_0_2px_8px_rgba(0,0,0,0.8),_0_0_25px_rgba(255,215,0,0.4)]">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 group"
                >
                  <X className="w-6 h-6 text-white group-hover:text-yellow-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Vision */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-300 tracking-wide font-['Space_Grotesk',_'Inter',_system-ui] drop-shadow-lg [text-shadow:_0_1px_4px_rgba(0,0,0,0.6),_0_0_15px_rgba(255,215,0,0.3)]">
                  {t.vision}
                </h3>
                <p className="text-white text-lg leading-relaxed font-medium">
                  {content.vision}
                </p>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-300 tracking-wide font-['Space_Grotesk',_'Inter',_system-ui] drop-shadow-lg [text-shadow:_0_1px_4px_rgba(0,0,0,0.6),_0_0_15px_rgba(255,215,0,0.3)]">
                  {t.services}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-black/30 rounded-lg border border-white/10 hover:border-yellow-400/30 transition-all duration-300"
                    >
                      <p className="text-white font-medium">{service}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-300 tracking-wide font-['Space_Grotesk',_'Inter',_system-ui] drop-shadow-lg [text-shadow:_0_1px_4px_rgba(0,0,0,0.6),_0_0_15px_rgba(255,215,0,0.3)]">
                  {t.technologies}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {content.technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-full border border-yellow-400/30 text-yellow-400 text-sm font-medium"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Examples */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-300 tracking-wide font-['Space_Grotesk',_'Inter',_system-ui] drop-shadow-lg [text-shadow:_0_1px_4px_rgba(0,0,0,0.6),_0_0_15px_rgba(255,215,0,0.3)]">
                  {t.examples}
                </h3>
                <div className="space-y-3">
                  {content.examples.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-black/30 to-black/50 rounded-lg border border-white/10 hover:border-yellow-400/30 transition-all duration-300"
                    >
                      <p className="text-white font-medium leading-relaxed">{example}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 pt-6 border-t border-yellow-400/20">
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-400/40 hover:shadow-yellow-400/60 hover:shadow-xl transition-all duration-300"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
