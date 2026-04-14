import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { AdminAuthError, loginAsAdmin } from '../lib/adminConfig';

type AdminLoginProps = {
  onSuccess: () => void;
  onBack: () => void;
};

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const { language } = useLanguage();
  const isTR = language === 'tr';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      await loginAsAdmin(trimmedUsername, trimmedPassword);
      setIsSubmitting(false);
      onSuccess();
    } catch (error) {
      let message = isTR
        ? 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.'
        : 'Unable to sign in. Please check your credentials.';

      if (error instanceof AdminAuthError) {
        switch (error.code) {
          case 'CONFIG':
            message = isTR
              ? 'Yönetici girişi yapılandırılmamış. Supabase ve yönetici şifre değişkenlerini tanımlayın.'
              : 'Admin login is not configured. Please provide the Supabase and admin credential environment variables.';
            break;
          case 'INVALID_CREDENTIALS':
            message = isTR
              ? 'Kullanıcı adı veya şifre hatalı.'
              : 'Username or password is incorrect.';
            break;
          case 'NETWORK':
            message = isTR
              ? 'Kimlik doğrulama servisine ulaşamıyoruz. Daha sonra tekrar deneyin.'
              : 'Unable to reach the authentication service. Please try again later.';
            break;
          default:
            break;
        }
      }

      setTimeout(() => {
        setError(message);
        setIsSubmitting(false);
      }, 300);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/92 to-black/98" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70" />

      <div className="relative z-40 flex flex-col min-h-screen">
        <div className="container mx-auto max-w-4xl px-6 pt-12 pb-16 flex-1 flex flex-col">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{isTR ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
          </motion.button>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-black/30 via-black/40 to-black/60 border border-yellow-400/10 rounded-3xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex flex-col items-center text-center space-y-4 mb-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-20 h-20 rounded-3xl bg-yellow-500/10 border border-yellow-400/30 flex items-center justify-center backdrop-blur-lg"
              >
                <LockKeyhole className="w-10 h-10 text-yellow-300" />
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                {isTR ? 'Yönetim Paneli Girişi' : 'Admin Panel Login'}
              </h1>
              <p className="text-gray-300 max-w-xl">
                {isTR
                  ? 'Yönetim paneline erişmek için yetkili kullanıcı adı ve şifreyi girin. Bu bilgiler kulüp yönetimi tarafından paylaşılır.'
                  : 'Enter the authorised username and password to access the admin panel. These credentials are shared by the club management.'}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-gray-300">{isTR ? 'Kullanıcı Adı' : 'Username'}</label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={isTR ? 'Yönetici kullanıcı adını girin' : 'Enter administrator username'}
                  className="w-full rounded-xl border border-gray-700 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition"
                  autoComplete="username"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-gray-300">{isTR ? 'Şifre' : 'Password'}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isTR ? 'Yönetici şifresini girin' : 'Enter administrator password'}
                  className="w-full rounded-xl border border-gray-700 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center space-x-3 rounded-2xl border border-yellow-400/40 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 px-6 py-3 text-lg font-bold text-black shadow-2xl transition focus:outline-none focus:ring-2 focus:ring-yellow-400/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center space-x-3">
                  <ShieldCheck className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? (isTR ? 'Doğrulanıyor...' : 'Verifying...') : isTR ? 'Giriş Yap' : 'Sign In'}</span>
                </div>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
