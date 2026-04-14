import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  return (
    <footer className="relative z-40 mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/40 space-y-2 pb-8 px-6">
      <div className="flex justify-center gap-4 flex-wrap">
        <a href="/kvkk-aydinlatma.html" className="hover:text-yellow-400 transition-colors">
          {language === 'tr' ? 'KVKK Aydınlatma Metni' : 'Privacy Policy (KVKK)'}
        </a>
        <span className="text-white/20">|</span>
        <a href="/iletisim" className="hover:text-yellow-400 transition-colors">
          {language === 'tr' ? 'İletişim' : 'Contact'}
        </a>
      </div>
      <p>&copy; 2026 {language === 'tr' ? 'Silifke Teknoloji Topluluğu' : 'Silifke Technology Community'}. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
    </footer>
  );
};

export default Footer;
