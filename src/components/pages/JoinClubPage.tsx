import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Send, User, Code, Palette, Brain, Users, FileText, Clock, Monitor, Printer, Camera, Mic, Cpu, MonitorSpeaker, AlertCircle } from 'lucide-react';
import { submitApplication, type ApplicationFormData } from '../../lib/supabaseClient';
import { useLanguage, type SupportedLanguage } from '../../i18n/LanguageContext';

interface JoinClubPageProps {
  onBack: () => void;
}

const joinFormContent = {
  tr: {
    back: 'Ana Sayfaya Dön',
    title: 'Topluluğa Katıl',
    subtitle: "Silifke Teknoloji Topluluğu'na katılmak için aşağıdaki formu doldur. Her adım seni daha yakından tanımamızı sağlayacak.",
    sections: [
      { title: 'Kişisel Bilgiler', description: 'Seni tanıyalım' },
      { title: 'İlgi Alanı', description: 'Hangi alanda katkı sağlamak istersin?' },
      { title: 'Küçük Görev', description: 'Yetkinliğini göster' },
      { title: 'Motivasyon', description: 'Neden katılmak istiyorsun?' },
      { title: 'Donanım', description: 'Teknik altyapın' }
    ],
    fields: {
      fullNameLabel: 'Ad Soyad *',
      fullNamePlaceholder: 'Adınız ve soyadınız',
      emailLabel: 'E-posta *',
      emailPlaceholder: 'ornek@email.com',
      phoneLabel: 'Telefon *',
      phonePlaceholder: '0555 123 45 67',
      ageLabel: 'Yaş *',
      agePlaceholder: 'Örn: 24',
      schoolLabel: 'Okul / Bölüm / Meslek *',
      schoolPlaceholder: 'Üniversite/Lise/Meslek bilginiz',
      interestsLabel: 'Hangi alanda katkı sağlamak istersin? *',
      sampleLabel: 'İlgi alanına göre küçük bir örnek paylaş *',
      samplePlaceholder: 'Yetkinliğini gösteren bir örnek paylaş...',
      motivationLabel: "Silifke Teknoloji Topluluğu'na katılmak isteme sebebin nedir? *",
      motivationPlaceholder: 'Motivasyonunu ve hedeflerini paylaş...',
      weeklyHoursLabel: 'Haftada kaç saat ayırabilirsin? *',
      weeklyHoursPlaceholder: 'Örn: 10-15 saat',
      meetingLabel: 'Haftalık toplantılara katılabilir misin? *',
      computerLabel: 'Bilgisayarın var mı? *',
      hardwareLabel: 'Topluluğa katkı sağlayacak ek donanımın var mı? *',
      sharingLabel: 'Donanımını toplulukta kullanıma açabilir misin? *',
      kvkkConsent: ' okudum ve kişisel verilerimin işlenmesine onay veriyorum *',
      kvkkNote: 'Ad, soyad, e-posta, telefon numarası ve diğer form verileriniz üyelik süreci için işlenecektir.'
    },
    sample: {
      examplesTitle: 'Örnekler:',
      examples: [
        { title: 'Kodlama:', description: ' GitHub linki / ekran görüntüsü' },
        { title: 'Tasarım:', description: ' Canva/Figma görsel linki' },
        { title: 'Yazarlık:', description: ' 2–3 repliklik kısa bir diyalog' },
        { title: 'Yönetim:', description: ' Daha önce görev aldığın bir proje/organizasyon' }
      ]
    },
    interestOptions: [
      { id: 'coding', label: 'Yazılım / Kodlama' },
      { id: 'design', label: 'Tasarım / Görsel içerik' },
      { id: 'ai', label: 'Yapay zekâ / Chatbot / Sesli Asistan' },
      { id: 'management', label: 'Proje yönetimi / Organizasyon' },
      { id: 'content', label: 'İçerik yazarlığı / Sosyal medya' }
    ],
    computerOptions: [
      { id: 'windows', label: 'Evet – Windows' },
      { id: 'macos', label: 'Evet – macOS' },
      { id: 'linux', label: 'Evet – Linux' },
      { id: 'none', label: 'Hayır' }
    ],
    hardwareOptions: [
      { id: '3d-printer', label: '3D Yazıcı' },
      { id: 'camera', label: 'Profesyonel kamera / drone' },
      { id: 'audio', label: 'Stüdyo mikrofonu / ses ekipmanı' },
      { id: 'maker', label: 'Raspberry Pi / Arduino / maker donanımları' },
      { id: 'monitor', label: 'Harici monitör / projeksiyon' },
      { id: 'none', label: 'Yok' }
    ],
    meetingOptions: [
      { id: 'yes', label: 'Evet' },
      { id: 'no', label: 'Hayır' },
      { id: 'online', label: 'Online tercih ederim' }
    ],
    sharingOptions: [
      { id: 'no', label: 'Hayır, sadece kendim için' },
      { id: 'sometimes', label: 'Bazen, randevuyla paylaşabilirim' },
      { id: 'yes', label: 'Evet, topluluk etkinliklerinde kullanılabilir' }
    ],
    buttons: {
      previous: 'Önceki',
      next: 'Sonraki',
      submit: 'Başvuruyu Gönder',
      submitting: 'Gönderiliyor...'
    },
    errors: {
      submissionFailed: 'Başvuru gönderilirken bir hata oluştu',
      unexpected: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
    },
    kvkk: {
      prefix: '',
      linkText: "KVKK Aydınlatma Metni'ni",
      suffix: " okudum ve kişisel verilerimin işlenmesine onay veriyorum *",
      note: 'Ad, soyad, e-posta, telefon numarası ve diğer form verileriniz üyelik süreci için işlenecektir.'
    },
    validation: {
      fullNameMin: 'Ad soyad en az 2 karakter olmalıdır',
      fullNameMax: 'Ad soyad en fazla 50 karakter olabilir',
      email: 'Geçerli bir e-posta adresi giriniz',
      phone: 'Geçerli bir telefon numarası giriniz',
      ageRequired: 'Yaş bilgisi zorunludur',
      ageInteger: 'Yaş tam sayı olmalıdır',
      ageMin: 'Yaş en az 18 olmalıdır',
      ageMax: 'Yaş en fazla 38 olabilir',
      schoolMin: 'Okul/iş bilgisi en az 5 karakter olmalıdır',
      schoolMax: 'Okul/iş bilgisi en fazla 100 karakter olabilir',
      interestsMin: 'En az bir ilgi alanı seçmelisiniz',
      interestsMax: 'En fazla 5 ilgi alanı seçebilirsiniz',
      portfolioMin: 'Örnek çalışma en az 20 karakter olmalıdır',
      portfolioMax: 'Örnek çalışma en fazla 500 karakter olabilir',
      motivationMin: 'Motivasyon açıklaması en az 50 karakter olmalıdır',
      motivationMax: 'Motivasyon açıklaması en fazla 1000 karakter olabilir',
      weeklyHours: 'Haftalık saat belirtmelisiniz',
      meetingPreference: 'Toplantı tercihini belirtmelisiniz',
      computerType: 'Bilgisayar durumunu belirtmelisiniz',
      hardwareSharing: 'Donanım paylaşım tercihini belirtmelisiniz',
      consent: 'KVKK onayı zorunludur'
    }
  },
  en: {
    back: 'Back to Home',
    title: 'Join the Community',
    subtitle: 'Fill out the form below to join Silifke Technology Community. Each step helps us get to know you better.',
    sections: [
      { title: 'Personal Details', description: 'Tell us about yourself' },
      { title: 'Interest Area', description: 'Where would you like to contribute?' },
      { title: 'Showcase', description: 'Share a sample of your skills' },
      { title: 'Motivation', description: 'Why would you like to join?' },
      { title: 'Hardware', description: 'Your technical setup' }
    ],
    fields: {
      fullNameLabel: 'Full Name *',
      fullNamePlaceholder: 'Your first and last name',
      emailLabel: 'Email *',
      emailPlaceholder: 'you@example.com',
      phoneLabel: 'Phone *',
      phonePlaceholder: '+90 555 123 45 67',
      ageLabel: 'Age *',
      agePlaceholder: 'e.g., 24',
      schoolLabel: 'School / Department / Profession *',
      schoolPlaceholder: 'Your school, major, or profession',
      interestsLabel: 'Which areas would you like to support? *',
      sampleLabel: 'Share a small sample based on your interest *',
      samplePlaceholder: 'Share a sample that showcases your skills...',
      motivationLabel: 'Why do you want to join Silifke Technology Community? *',
      motivationPlaceholder: 'Tell us about your motivation and goals...',
      weeklyHoursLabel: 'How many hours per week can you dedicate? *',
      weeklyHoursPlaceholder: 'E.g., 10-15 hours',
      meetingLabel: 'Can you attend weekly meetings? *',
      computerLabel: 'Do you currently have a computer? *',
      hardwareLabel: 'Do you have additional hardware the community can use? *',
      sharingLabel: 'Can you make your hardware available for community use? *',
      kvkkConsent: ' I have read and consent to the processing of my personal data *',
      kvkkNote: 'Your name, email, phone number, and other form data will be processed for the membership evaluation.'
    },
    sample: {
      examplesTitle: 'Examples:',
      examples: [
        { title: 'Coding:', description: ' GitHub link or screenshot' },
        { title: 'Design:', description: ' Canva/Figma visual link' },
        { title: 'Writing:', description: ' A short 2–3 line dialogue' },
        { title: 'Management:', description: ' A project or organisation you have supported' }
      ]
    },
    interestOptions: [
      { id: 'coding', label: 'Software / Coding' },
      { id: 'design', label: 'Design / Visual content' },
      { id: 'ai', label: 'AI / Chatbot / Voice assistant' },
      { id: 'management', label: 'Project management / Organisation' },
      { id: 'content', label: 'Content writing / Social media' }
    ],
    computerOptions: [
      { id: 'windows', label: 'Yes – Windows' },
      { id: 'macos', label: 'Yes – macOS' },
      { id: 'linux', label: 'Yes – Linux' },
      { id: 'none', label: 'No' }
    ],
    hardwareOptions: [
      { id: '3d-printer', label: '3D Printer' },
      { id: 'camera', label: 'Professional camera / drone' },
      { id: 'audio', label: 'Studio microphone / audio gear' },
      { id: 'maker', label: 'Raspberry Pi / Arduino / maker gear' },
      { id: 'monitor', label: 'External monitor / projector' },
      { id: 'none', label: 'None' }
    ],
    meetingOptions: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
      { id: 'online', label: 'I prefer online' }
    ],
    sharingOptions: [
      { id: 'no', label: 'No, only for myself' },
      { id: 'sometimes', label: 'Sometimes, with an appointment' },
      { id: 'yes', label: 'Yes, available for community activities' }
    ],
    buttons: {
      previous: 'Previous',
      next: 'Next',
      submit: 'Submit Application',
      submitting: 'Submitting...'
    },
    errors: {
      submissionFailed: 'Something went wrong while sending your application',
      unexpected: 'An unexpected error occurred. Please try again.'
    },
    kvkk: {
      prefix: 'I have read the ',
      linkText: 'KVKK Disclosure Statement',
      suffix: ' and consent to the processing of my personal data *',
      note: 'Your name, email, phone number, and other form data will be processed for the membership evaluation.'
    },
    validation: {
      fullNameMin: 'Full name must be at least 2 characters',
      fullNameMax: 'Full name can be at most 50 characters',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      ageRequired: 'Age is required',
      ageInteger: 'Age must be a whole number',
      ageMin: 'You must be at least 18 years old',
      ageMax: 'You must be 38 or younger',
      schoolMin: 'School/work information must be at least 5 characters',
      schoolMax: 'School/work information can be at most 100 characters',
      interestsMin: 'Select at least one interest area',
      interestsMax: 'You can select at most 5 interest areas',
      portfolioMin: 'Sample must be at least 20 characters',
      portfolioMax: 'Sample can be at most 500 characters',
      motivationMin: 'Motivation must be at least 50 characters',
      motivationMax: 'Motivation can be at most 1000 characters',
      weeklyHours: 'Please specify your weekly availability',
      meetingPreference: 'Please select your meeting preference',
      computerType: 'Please tell us about your computer access',
      hardwareSharing: 'Please choose your hardware sharing preference',
      consent: 'KVKK consent is required'
    }
  }
} as const;

type JoinFormContent = typeof joinFormContent[SupportedLanguage];
type JoinValidationMessages = JoinFormContent['validation'];

const createJoinClubSchema = (validation: JoinValidationMessages) => z.object({
  fullName: z.string().min(2, validation.fullNameMin).max(50, validation.fullNameMax),
  email: z.string().email(validation.email),
  phone: z.string().regex(/^[+]?[0-9\s()-]{10,15}$/, validation.phone),
  age: z.string()
    .min(1, validation.ageRequired)
    .regex(/^\d+$/, validation.ageInteger)
    .refine((value) => Number(value) >= 18, { message: validation.ageMin })
    .refine((value) => Number(value) <= 38, { message: validation.ageMax }),
  schoolWork: z.string().min(5, validation.schoolMin).max(100, validation.schoolMax),
  interests: z.array(z.string()).min(1, validation.interestsMin).max(5, validation.interestsMax),
  portfolioExample: z.string().min(20, validation.portfolioMin).max(500, validation.portfolioMax),
  motivation: z.string().min(50, validation.motivationMin).max(1000, validation.motivationMax),
  weeklyHours: z.string().min(1, validation.weeklyHours),
  meetingPreference: z.string().min(1, validation.meetingPreference),
  computerType: z.string().min(1, validation.computerType),
  additionalHardware: z.array(z.string()),
  hardwareSharing: z.string().min(1, validation.hardwareSharing),
  consentKvkk: z.boolean().refine((val) => val === true, validation.consent)
});

type JoinClubFormData = z.infer<ReturnType<typeof createJoinClubSchema>>;

const JoinClubPage: React.FC<JoinClubPageProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const t = joinFormContent[language];
  const joinClubSchema = useMemo(() => createJoinClubSchema(t.validation), [t]);

  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue
  } = useForm<JoinClubFormData>({
    resolver: zodResolver(joinClubSchema),
    mode: 'onChange'
  });

  React.useEffect(() => {
    setSubmitError(null);
  }, [language]);

  // Watch interests to handle checkbox array
  const watchedInterests = watch('interests') || [];
  const watchedHardware = watch('additionalHardware') || [];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const sectionIcons = useMemo(
    () => [
      <User className="w-6 h-6" />, 
      <Brain className="w-6 h-6" />, 
      <FileText className="w-6 h-6" />, 
      <Clock className="w-6 h-6" />, 
      <Monitor className="w-6 h-6" />
    ],
    []
  );

  const sections = useMemo(
    () => t.sections.map((section, index) => ({ ...section, icon: sectionIcons[index] })),
    [sectionIcons, t.sections]
  );

  const interestIconMap: Record<string, React.ReactNode> = useMemo(
    () => ({
      coding: <Code className="w-5 h-5" />,
      design: <Palette className="w-5 h-5" />,
      ai: <Brain className="w-5 h-5" />,
      management: <Users className="w-5 h-5" />,
      content: <FileText className="w-5 h-5" />
    }),
    []
  );

  const interestOptions = useMemo(
    () => t.interestOptions.map((option) => ({
      ...option,
      icon: interestIconMap[option.id]
    })),
    [interestIconMap, t.interestOptions]
  );

  const computerOptions = useMemo(() => t.computerOptions, [t.computerOptions]);

  const hardwareIconMap: Record<string, React.ReactNode> = useMemo(
    () => ({
      '3d-printer': <Printer className="w-5 h-5" />,
      camera: <Camera className="w-5 h-5" />,
      audio: <Mic className="w-5 h-5" />,
      maker: <Cpu className="w-5 h-5" />,
      monitor: <MonitorSpeaker className="w-5 h-5" />,
      none: null
    }),
    []
  );

  const hardwareOptions = useMemo(
    () => t.hardwareOptions.map((option) => ({
      ...option,
      icon: hardwareIconMap[option.id]
    })),
    [hardwareIconMap, t.hardwareOptions]
  );

  const meetingOptions = useMemo(() => t.meetingOptions, [t.meetingOptions]);
  const sharingOptions = useMemo(() => t.sharingOptions, [t.sharingOptions]);

  // Validate current section before proceeding
  const validateCurrentSection = async () => {
    let fieldsToValidate: (keyof JoinClubFormData)[] = [];

    switch (currentSection) {
      case 0: // Kişisel Bilgiler
        fieldsToValidate = ['fullName', 'email', 'phone', 'age', 'schoolWork'];
        break;
      case 1: // İlgi Alanı
        fieldsToValidate = ['interests'];
        break;
      case 2: // Küçük Görev
        fieldsToValidate = ['portfolioExample'];
        break;
      case 3: // Motivasyon
        fieldsToValidate = ['motivation', 'weeklyHours', 'meetingPreference'];
        break;
      case 4: // Donanım
        fieldsToValidate = ['computerType', 'hardwareSharing'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const nextSection = async () => {
    const isValid = await validateCurrentSection();
    if (isValid && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Handle form submission
  const onSubmit = async (data: JoinClubFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const numericAge = Number(data.age);

      // Transform data to match ApplicationFormData interface
      const applicationData: ApplicationFormData = {
        fullName: data.fullName,
        age: numericAge,
        email: data.email,
        phone: data.phone,
        schoolWork: data.schoolWork,
        interests: data.interests,
        portfolioExample: data.portfolioExample,
        motivation: data.motivation,
        weeklyHours: data.weeklyHours,
        meetingPreference: data.meetingPreference,
        computerType: data.computerType,
        additionalHardware: data.additionalHardware,
        hardwareSharing: data.hardwareSharing,
        consentKvkk: data.consentKvkk
      };

      const result = await submitApplication(applicationData);

      if (result.success) {
        // Redirect to thank you page with application ID
        window.location.href = `/tesekkurler?applicationId=${result.applicationId}`;
      } else {
        setSubmitError(result.error || t.errors.submissionFailed);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(t.errors.unexpected);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: // Kişisel Bilgiler
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                {t.fields.fullNameLabel}
              </label>
              <input
                type="text"
                {...register('fullName')}
                className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 ${
                  errors.fullName ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
                placeholder={t.fields.fullNamePlaceholder}
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                {t.fields.emailLabel}
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 ${
                  errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
                placeholder={t.fields.emailPlaceholder}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                {t.fields.phoneLabel}
              </label>
              <input
                type="tel"
                {...register('phone')}
                className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 ${
                  errors.phone ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
                placeholder={t.fields.phonePlaceholder}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                {t.fields.ageLabel}
              </label>
              <input
                type="number"
                min={18}
                max={38}
                step={1}
                inputMode="numeric"
                {...register('age')}
                className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 ${
                  errors.age ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
                placeholder={t.fields.agePlaceholder}
              />
              {errors.age && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.age.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                {t.fields.schoolLabel}
              </label>
              <input
                type="text"
                {...register('schoolWork')}
                className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 ${
                  errors.schoolWork ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
                placeholder={t.fields.schoolPlaceholder}
              />
              {errors.schoolWork && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.schoolWork.message}
                </p>
              )}
            </div>
          </div>
        );

      case 1: // İlgi Alanı
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                {t.fields.interestsLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interestOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-4 bg-black/30 border border-gray-600 rounded-xl hover:bg-black/50 hover:border-yellow-400/50 cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={watchedInterests.includes(option.id)}
                      onChange={(e) => {
                        const currentInterests = watchedInterests || [];
                        if (e.target.checked) {
                          setValue('interests', [...currentInterests, option.id]);
                        } else {
                          setValue('interests', currentInterests.filter(id => id !== option.id));
                        }
                      }}
                      className="w-5 h-5 text-yellow-400 bg-transparent border-gray-400 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <div className="ml-3 flex items-center space-x-3">
                      <span className="text-yellow-400">{option.icon}</span>
                      <span className="text-white font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.interests && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.interests.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2: // Küçük Görev
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                {t.fields.sampleLabel}
              </label>
              <div className="text-sm text-gray-400 mb-4 p-4 bg-black/30 rounded-xl border border-gray-600">
                <p className="mb-2"><strong>{t.sample.examplesTitle}</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {t.sample.examples.map((example) => (
                    <li key={example.title}>
                      <strong>{example.title}</strong>
                      {example.description}
                    </li>
                  ))}
                </ul>
              </div>
              <textarea
                {...register('portfolioExample')}
                className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 min-h-[120px] resize-none ${
                  errors.portfolioExample ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
                placeholder={t.fields.samplePlaceholder}
              />
              {errors.portfolioExample && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.portfolioExample.message}
                </p>
              )}
            </div>
          </div>
        );

      case 3: // Motivasyon
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                {t.fields.motivationLabel}
              </label>
              <textarea
                {...register('motivation')}
                className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 min-h-[100px] resize-none ${
                  errors.motivation ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
                placeholder={t.fields.motivationPlaceholder}
              />
              {errors.motivation && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.motivation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                {t.fields.weeklyHoursLabel}
              </label>
              <input
                type="text"
                {...register('weeklyHours')}
                className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 ${
                  errors.weeklyHours ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-yellow-400'
                }`}
                placeholder={t.fields.weeklyHoursPlaceholder}
              />
              {errors.weeklyHours && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.weeklyHours.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                {t.fields.meetingLabel}
              </label>
              <div className="space-y-3">
                {meetingOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-3 bg-black/30 border border-gray-600 rounded-xl hover:bg-black/50 hover:border-yellow-400/50 cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="radio"
                      {...register('meetingPreference')}
                      value={option.id}
                      className="w-4 h-4 text-yellow-400 bg-transparent border-gray-400 focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="ml-3 text-white font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.meetingPreference && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.meetingPreference.message}
                </p>
              )}
            </div>
          </div>
        );

      case 4: // Donanım
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                {t.fields.computerLabel}
              </label>
              <div className="space-y-3">
                {computerOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-3 bg-black/30 border border-gray-600 rounded-xl hover:bg-black/50 hover:border-yellow-400/50 cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="radio"
                      {...register('computerType')}
                      value={option.id}
                      className="w-4 h-4 text-yellow-400 bg-transparent border-gray-400 focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="ml-3 text-white font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.computerType && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.computerType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                {t.fields.hardwareLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hardwareOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-4 bg-black/30 border border-gray-600 rounded-xl hover:bg-black/50 hover:border-yellow-400/50 cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={watchedHardware.includes(option.id)}
                      onChange={(e) => {
                        const currentHardware = watchedHardware || [];
                        if (e.target.checked) {
                          setValue('additionalHardware', [...currentHardware, option.id]);
                        } else {
                          setValue('additionalHardware', currentHardware.filter(id => id !== option.id));
                        }
                      }}
                      className="w-5 h-5 text-yellow-400 bg-transparent border-gray-400 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <div className="ml-3 flex items-center space-x-3">
                      {option.icon && <span className="text-yellow-400">{option.icon}</span>}
                      <span className="text-white font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                {t.fields.sharingLabel}
              </label>
              <div className="space-y-3">
                {sharingOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-3 bg-black/30 border border-gray-600 rounded-xl hover:bg-black/50 hover:border-yellow-400/50 cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="radio"
                      {...register('hardwareSharing')}
                      value={option.id}
                      className="w-4 h-4 text-yellow-400 bg-transparent border-gray-400 focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="ml-3 text-white font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.hardwareSharing && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.hardwareSharing.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start p-4 bg-black/30 border border-gray-600 rounded-xl hover:bg-black/50 hover:border-yellow-400/50 cursor-pointer transition-all duration-300">
                <input
                  type="checkbox"
                  {...register('consentKvkk')}
                  className="w-5 h-5 text-yellow-400 bg-transparent border-gray-400 rounded focus:ring-yellow-400 focus:ring-2 mt-0.5"
                />
                <div className="ml-3">
                  <span className="text-white font-medium">
                    {t.kvkk.prefix}
                    <a
                      href="/kvkk-aydinlatma.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-yellow-400/60 decoration-dotted underline-offset-4 hover:text-yellow-300 transition-colors"
                    >
                      {t.kvkk.linkText}
                    </a>
                    {t.kvkk.suffix}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">{t.kvkk.note}</p>
                </div>
              </label>
              {errors.consentKvkk && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.consentKvkk.message}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
              <span>{t.back}</span>
            </button>

            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center space-y-2 ${
                    index <= currentSection ? 'text-yellow-400' : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      index <= currentSection
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-gray-600 bg-gray-600/20'
                    }`}
                  >
                    {section.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{section.title}</p>
                    <p className="text-xs text-gray-400 hidden md:block">{section.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            key={currentSection}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md border border-gray-600 rounded-2xl p-8 mb-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                <span className="text-yellow-400">{sections[currentSection].icon}</span>
                <span>{sections[currentSection].title}</span>
              </h2>
              <p className="text-gray-400">{sections[currentSection].description}</p>
            </div>

            {renderCurrentSection()}
          </motion.div>

          {/* Error Message */}
          {submitError && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium">{submitError}</p>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-between items-center"
          >
            <button
              onClick={prevSection}
              disabled={currentSection === 0}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
            >
              {t.buttons.previous}
            </button>

            <span className="text-gray-400 text-sm">
              {currentSection + 1} / {sections.length}
            </span>

            {currentSection === sections.length - 1 ? (
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-yellow-500/30 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>{t.buttons.submitting}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t.buttons.submit}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextSection}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold rounded-xl transition-all duration-300"
              >
                {t.buttons.next}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JoinClubPage;
