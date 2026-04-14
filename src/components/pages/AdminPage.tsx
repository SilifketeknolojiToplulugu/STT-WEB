import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  Star,
  UserCheck,
  UserX,
  LogOut,
} from 'lucide-react';
import { supabase, type Application } from '../../lib/supabaseClient';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminPageProps {
  onBack: () => void;
  onLogout?: () => void;
}

interface ApplicationWithDetails extends Application {
  days_since_created: number;
}

const adminCopy = {
  tr: {
    back: 'Ana Sayfaya Dön',
    heading: 'Yönetim Paneli',
    subtitle: 'Üyelik başvurularını yönetin ve değerlendirin',
    refresh: 'Yenile',
    logout: 'Çıkış',
    stats: {
      total: 'Toplam Başvuru',
      pending: 'Bekleyen',
      approved: 'Onaylanan',
      core: 'Çekirdek Üye'
    },
    filters: {
      searchLabel: 'Arama',
      searchPlaceholder: 'Ad, e-posta ara...',
      statusLabel: 'Durum',
      levelLabel: 'Seviye',
      clear: 'Temizle'
    },
    statusOptions: {
      all: 'Tümü',
      pending: 'Bekliyor',
      under_review: 'İnceleniyor',
      approved: 'Onaylandı',
      rejected: 'Reddedildi'
    },
    levelOptions: {
      all: 'Tümü',
      community: 'Topluluk',
      contributor: 'Katkıcı',
      core: 'Çekirdek'
    },
    table: {
      applicant: 'Başvuran',
      email: 'E-posta',
      status: 'Durum',
      level: 'Seviye',
      score: 'Puan',
      date: 'Tarih',
      actions: 'İşlemler'
    },
    loading: 'Başvurular yükleniyor...',
    empty: {
      title: 'Başvuru bulunamadı',
      description: 'Arama kriterlerinizi değiştirip tekrar deneyin.'
    },
    statusText: {
      pending: 'Bekliyor',
      under_review: 'İnceleniyor',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      default: 'Bekliyor'
    },
    levelText: {
      community: 'Topluluk',
      contributor: 'Katkıcı',
      core: 'Çekirdek',
      default: 'Belirtilmedi'
    },
    actions: {
      viewTitle: 'Detayları Görüntüle',
      approveTitle: 'Onayla',
      rejectTitle: 'Reddet',
      approve: 'Onayla',
      reject: 'Reddet'
    },
    detail: {
      title: 'Başvuru Detayları',
      personal: 'Kişisel Bilgiler',
      application: 'Başvuru Bilgileri',
      interests: 'İlgi Alanları',
      portfolio: 'Portfolio Örneği',
      motivation: 'Motivasyon',
      technical: 'Teknik Bilgiler',
      hardware: 'Donanım',
      fullName: 'Ad Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      age: 'Yaş',
      schoolWork: 'Okul/İş',
      createdAt: 'Başvuru Tarihi',
      daysAgo: (days: number) => `${days} gün önce`,
      weeklyHours: 'Haftalık Saat',
      meetingPreference: 'Toplantı Tercihi',
      computerType: 'Bilgisayar',
      additionalHardware: 'Ek Donanım',
      hardwareSharing: 'Donanım Paylaşımı',
      scoreLabel: 'Başvuru Puanınız'
    },
    info: {
      evaluation: {
        label: 'Değerlendirme Süreci',
        value: '1-3 iş günü'
      },
      email: {
        label: 'İletişim',
        value: 'E-posta adresinize bilgi gönderilecek'
      },
      nextStep: {
        label: 'Sonraki Adım',
        value: 'Onay sonrası Discord sunucumuza davet'
      }
    },
    noPortfolio: 'İçerik yok',
    noMotivation: 'İçerik yok',
    meetingPreference: {
      yes: 'Evet',
      no: 'Hayır',
      online: 'Online tercih ederim'
    },
    computerTypes: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
      none: 'Yok'
    },
    hardwareSharing: {
      no: 'Hayır, sadece kendim için',
      sometimes: 'Bazen, randevuyla paylaşabilirim',
      yes: 'Evet, kulüp etkinliklerinde kullanılabilir'
    },
    interestLabels: {
      coding: 'Yazılım / Kodlama',
      design: 'Tasarım / Görsel içerik',
      ai: 'Yapay zekâ / Chatbot / Sesli Asistan',
      management: 'Proje yönetimi / Organizasyon',
      content: 'İçerik yazarlığı / Sosyal medya'
    },
    hardwareLabels: {
      '3d-printer': '3D Yazıcı',
      camera: 'Profesyonel kamera / drone',
      audio: 'Stüdyo mikrofonu / ses ekipmanı',
      maker: 'Raspberry Pi / Arduino / maker donanımları',
      monitor: 'Harici monitör / projeksiyon',
      none: 'Yok'
    }
  },
  en: {
    back: 'Back to Home',
    heading: 'Admin Panel',
    subtitle: 'Review and manage membership applications',
    refresh: 'Refresh',
    logout: 'Sign Out',
    stats: {
      total: 'Total Applications',
      pending: 'Pending',
      approved: 'Approved',
      core: 'Core Members'
    },
    filters: {
      searchLabel: 'Search',
      searchPlaceholder: 'Search by name or email...',
      statusLabel: 'Status',
      levelLabel: 'Level',
      clear: 'Clear'
    },
    statusOptions: {
      all: 'All',
      pending: 'Pending',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected'
    },
    levelOptions: {
      all: 'All',
      community: 'Community',
      contributor: 'Contributor',
      core: 'Core'
    },
    table: {
      applicant: 'Applicant',
      email: 'Email',
      status: 'Status',
      level: 'Level',
      score: 'Score',
      date: 'Date',
      actions: 'Actions'
    },
    loading: 'Loading applications...',
    empty: {
      title: 'No applications found',
      description: 'Adjust your filters and try again.'
    },
    statusText: {
      pending: 'Pending',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      default: 'Pending'
    },
    levelText: {
      community: 'Community',
      contributor: 'Contributor',
      core: 'Core',
      default: 'Not specified'
    },
    actions: {
      viewTitle: 'View details',
      approveTitle: 'Approve',
      rejectTitle: 'Reject',
      approve: 'Approve',
      reject: 'Reject'
    },
    detail: {
      title: 'Application Details',
      personal: 'Personal Information',
      application: 'Application Information',
      interests: 'Interest Areas',
      portfolio: 'Portfolio Sample',
      motivation: 'Motivation',
      technical: 'Technical Information',
      hardware: 'Hardware',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      age: 'Age',
      schoolWork: 'School / Work',
      createdAt: 'Submitted',
      daysAgo: (days: number) => `${days} days ago`,
      weeklyHours: 'Weekly Availability',
      meetingPreference: 'Meeting Preference',
      computerType: 'Computer',
      additionalHardware: 'Additional Hardware',
      hardwareSharing: 'Hardware Sharing',
      scoreLabel: 'Your Application Score'
    },
    info: {
      evaluation: {
        label: 'Review Timeline',
        value: '1-3 business days'
      },
      email: {
        label: 'Communication',
        value: 'We will email you an update'
      },
      nextStep: {
        label: 'Next Step',
        value: 'Receive a Discord invite after approval'
      }
    },
    noPortfolio: 'No content provided',
    noMotivation: 'No content provided',
    meetingPreference: {
      yes: 'Yes',
      no: 'No',
      online: 'I prefer online'
    },
    computerTypes: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
      none: 'None'
    },
    hardwareSharing: {
      no: 'No, only for myself',
      sometimes: 'Sometimes, with an appointment',
      yes: 'Yes, available for club activities'
    },
    interestLabels: {
      coding: 'Software / Coding',
      design: 'Design / Visual content',
      ai: 'AI / Chatbot / Voice assistant',
      management: 'Project management / Organisation',
      content: 'Content writing / Social media'
    },
    hardwareLabels: {
      '3d-printer': '3D Printer',
      camera: 'Professional camera / drone',
      audio: 'Studio microphone / audio gear',
      maker: 'Raspberry Pi / Arduino / maker gear',
      monitor: 'External monitor / projector',
      none: 'None'
    }
  }
} as const;

const AdminPage: React.FC<AdminPageProps> = ({ onBack, onLogout }) => {
  const { language } = useLanguage();
  const copy = adminCopy[language];
  const isTR = language === 'tr';
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      
      // Check if Supabase is properly configured
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Development mode - show mock data
        console.log('Development mode: Showing mock applications');
        const mockApplications = [
          {
            id: 'dev-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            full_name: 'Test Kullanıcı',
            email: 'test@example.com',
            phone: '05551234567',
            age: 24,
            school_work: 'Test Üniversitesi',
            interests: ['coding', 'design'],
            portfolio_example: 'Test portfolio örneği',
            motivation: 'Test motivasyon metni',
            weekly_hours: '10-15 saat',
            meeting_preference: 'yes',
            computer_type: 'windows',
            additional_hardware: ['3d-printer'],
            hardware_sharing: 'yes',
            status: 'pending' as const,
            level: 'community' as const,
            consent_kvkk: true,
            consent_date: new Date().toISOString(),
            admin_notes: null,
            reviewed_by: null,
            reviewed_at: null,
            score: 75,
            score_breakdown: { portfolio_quality: 20, motivation_strength: 15, technical_skills: 20, availability: 10, hardware_contribution: 10, total: 75 },
            days_since_created: 0
          }
        ];
        setApplications(mockApplications);
        return;
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      const applicationsWithDays = data.map(app => ({
        ...app,
        days_since_created: Math.floor((Date.now() - new Date(app.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }));

      setApplications(applicationsWithDays);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = useCallback(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(app => app.level === levelFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, levelFilter]);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);

  const updateApplicationStatus = async (
    id: string,
    status: Application['status'],
    level?: Application['level'],
    notes?: Application['admin_notes'] | null
  ) => {
    try {
      setIsUpdating(true);
      const updateData: {
        status: Application['status'];
        reviewed_at: string;
        level?: Application['level'];
        admin_notes?: Application['admin_notes'];
      } = { 
        status,
        reviewed_at: new Date().toISOString()
      };
      
      if (level !== undefined) updateData.level = level;
      if (notes !== undefined) updateData.admin_notes = notes;

      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating application:', error);
        return;
      }

      // Refresh applications
      await fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'under_review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'core':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'contributor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'community':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = copy.statusText as Record<string, string>;
    return labels[status] ?? labels.default;
  };

  const getLevelLabel = (level: string) => {
    const labels = copy.levelText as Record<string, string>;
    return labels[level] ?? labels.default;
  };

  const formatDaysAgo = (days: number) => copy.detail.daysAgo(days);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/100" />
      
      <div className="relative z-40 pt-8 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{copy.back}</span>
            </button>

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent mb-2">
                  {copy.heading}
                </h1>
                <p className="text-lg text-gray-300">
                  {copy.subtitle}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchApplications}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{copy.refresh}</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
                    type="button"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{copy.logout}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{applications.length}</p>
                  <p className="text-gray-400">{copy.stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {applications.filter(app => app.status === 'pending' || app.status === 'under_review').length}
                  </p>
                  <p className="text-gray-400">{copy.stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                  <p className="text-gray-400">{copy.stats.approved}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {applications.filter(app => app.level === 'core').length}
                  </p>
                  <p className="text-gray-400">{copy.stats.core}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{copy.filters.searchLabel}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={copy.filters.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{copy.filters.statusLabel}</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400"
                >
                  {Object.entries(copy.statusOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{copy.filters.levelLabel}</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400"
                >
                  {Object.entries(copy.levelOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setLevelFilter('all');
                  }}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                >
                  {copy.filters.clear}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Applications List */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-xl overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">{copy.loading}</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div>
                  <p className="text-gray-400 font-semibold">{copy.empty.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{copy.empty.description}</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{copy.table.applicant}</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{copy.table.email}</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{copy.table.status}</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{copy.table.level}</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{copy.table.score}</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{copy.table.date}</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">{copy.table.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{application.full_name}</p>
                            <p className="text-sm text-gray-400">{application.school_work}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{application.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span>{getStatusLabel(application.status)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(application.level)}`}>
                            {getLevelLabel(application.level)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{application.score}</span>
                            <span className="text-gray-400 text-sm">/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          <div>
                            <p className="text-sm">{new Date(application.created_at).toLocaleDateString(isTR ? 'tr-TR' : 'en-GB')}</p>
                            <p className="text-xs text-gray-500">{formatDaysAgo(application.days_since_created)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedApplication(application)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                              title={copy.actions.viewTitle}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'approved', application.level)}
                              disabled={isUpdating || application.status === 'approved'}
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={copy.actions.approveTitle}
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              disabled={isUpdating || application.status === 'rejected'}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={copy.actions.rejectTitle}
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/90 backdrop-blur-md border border-gray-600 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">{copy.detail.title}</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">{copy.detail.personal}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.fullName}</label>
                    <p className="text-white">{selectedApplication.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.email}</label>
                    <p className="text-white">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.phone}</label>
                    <p className="text-white">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.age}</label>
                    <p className="text-white">{selectedApplication.age}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.schoolWork}</label>
                    <p className="text-white">{selectedApplication.school_work}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">{copy.detail.application}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">{copy.table.status}</label>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusIcon(selectedApplication.status)}
                      <span>{getStatusLabel(selectedApplication.status)}</span>
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.table.level}</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(selectedApplication.level)}`}>
                      {getLevelLabel(selectedApplication.level)}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.table.score}</label>
                    <p className="text-white font-medium">{selectedApplication.score}/100</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.createdAt}</label>
                    <p className="text-white">{new Date(selectedApplication.created_at).toLocaleString(isTR ? 'tr-TR' : 'en-GB')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{copy.detail.interests}</h4>
              <div className="flex flex-wrap gap-2">
                {selectedApplication.interests.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {copy.interestLabels[interest as keyof typeof copy.interestLabels] || interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{copy.detail.portfolio}</h4>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {selectedApplication.portfolio_example?.trim() || copy.noPortfolio}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">{copy.detail.motivation}</h4>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {selectedApplication.motivation?.trim() || copy.noMotivation}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">{copy.detail.technical}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.weeklyHours}</label>
                    <p className="text-white">{selectedApplication.weekly_hours}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.meetingPreference}</label>
                    <p className="text-white">
                      {copy.meetingPreference[selectedApplication.meeting_preference as keyof typeof copy.meetingPreference] || copy.meetingPreference.no}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.computerType}</label>
                    <p className="text-white">
                      {copy.computerTypes[selectedApplication.computer_type as keyof typeof copy.computerTypes] || copy.computerTypes.none}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">{copy.detail.hardware}</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.additionalHardware}</label>
                    {(selectedApplication.additional_hardware?.length ?? 0) > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.additional_hardware?.map((hardware, index) => (
                          <span key={index} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                            {copy.hardwareLabels[hardware as keyof typeof copy.hardwareLabels] || hardware}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">{copy.noPortfolio}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{copy.detail.hardwareSharing}</label>
                    <p className="text-white">
                      {copy.hardwareSharing[selectedApplication.hardware_sharing as keyof typeof copy.hardwareSharing] || copy.hardwareSharing.no}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                disabled={isUpdating}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                <UserX className="w-4 h-4" />
                <span>{copy.actions.reject}</span>
              </button>
              <button
                onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', selectedApplication.level)}
                disabled={isUpdating}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{copy.actions.approve}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
