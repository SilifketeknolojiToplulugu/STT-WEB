# Silifke Teknoloji Kulübü

Modern ve interaktif Silifke Teknoloji Kulübü web sitesi. Hibrit üyelik sistemi ile topluluk, katkıcı ve çekirdek üye seviyeleri.

## 🚀 Özellikler

### Frontend
- 🎨 Modern ve minimal tasarım
- ⚡ Yüksek performans optimizasyonu
- 📱 Responsive tasarım
- 🎪 Interaktif animasyonlar
- 🌟 Matrix efekti arka plan
- 🎯 Kullanıcı dostu arayüz

### Üyelik Sistemi
- 📝 Çok adımlı başvuru formu
- 🔐 KVKK uyumlu veri işleme
- 📊 Otomatik puanlama sistemi
- 🎯 3 seviye üyelik (Topluluk/Katkıcı/Çekirdek)
- 🔔 Discord webhook bildirimleri
- 👨‍💼 Admin yönetim paneli

## 🛠 Teknolojiler

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Lucide React** - Icons

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security (RLS)** - Data Protection
- **Edge Functions** - Serverless Functions
- **Real-time Subscriptions** - Live Updates

## 📋 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd silifke-teknoloji
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables
```bash
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Discord Webhook (for notifications)
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# Admin Panel Credentials
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_PASSWORD=your_admin_password
```

### 4. Supabase Kurulumu

#### 4.1 Yeni Proje Oluşturun
1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adı: `silifke-teknoloji`
4. Database password oluşturun
5. Region seçin (Europe West - Frankfurt önerilir)

#### 4.2 Migration'ları Çalıştırın
Supabase SQL Editor'da sırasıyla şu dosyaları çalıştırın:
```sql
-- 1. Applications table
migrations/001_create_applications_table.sql

-- 2. Members table  
migrations/002_create_members_table.sql

-- 3. Activities table
migrations/003_create_activities_table.sql

-- 4. RLS Policies
migrations/004_setup_rls_policies.sql
```

#### 4.3 Edge Function Deploy
```bash
# Supabase CLI kurulumu (eğer yoksa)
npm install -g supabase

# Login
supabase login

# Project link
supabase link --project-ref your-project-ref

# Edge function deploy
supabase functions deploy on_application_submitted
```

### 5. Discord Webhook Kurulumu
1. Discord sunucunuzda bir kanal oluşturun
2. Kanal ayarları > Integrations > Webhooks
3. "Create Webhook" butonuna tıklayın
4. Webhook URL'ini kopyalayın
5. `.env` dosyasına `DISCORD_WEBHOOK_URL` olarak ekleyin

### 6. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

## 🏗 Build ve Deploy

### Production Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Vercel Deploy
```bash
# Vercel CLI kurulumu
npm install -g vercel

# Deploy
vercel --prod
```

## 📊 Veritabanı Şeması

### Applications Table
- Başvuru formları
- Kişisel bilgiler
- Puanlama sistemi
- KVKK onayları

### Members Table  
- Onaylanmış üyeler
- Seviye bilgileri
- Puan sistemi
- Aktivite takibi

### Activities Table
- Üye aktiviteleri
- Puan kazanma sistemi
- Doğrulama mekanizması

## 🔐 Güvenlik

### Row Level Security (RLS)
- Applications: Sadece admin ve edge functions erişebilir
- Members: Kullanıcılar sadece kendi verilerini görebilir
- Activities: Kullanıcılar sadece kendi aktivitelerini görebilir

### KVKK Uyumu
- Açık rıza mekanizması
- Veri işleme şeffaflığı
- Kullanıcı hakları koruması

## 🎯 Üyelik Seviyeleri

### 🌍 Topluluk (Community)
- Açık etkinliklere katılım
- Temel topluluk hakları
- Otomatik onay (70+ puan)

### ⭐ Katkıcı (Contributor)  
- Projelere aktif katkı
- Mentorluk fırsatları
- Manuel değerlendirme

### 👑 Çekirdek (Core)
- Kulüp yönetiminde söz hakkı
- Stratejik kararlarda etki
- Özel etkinliklere erişim

## 📱 Sayfalar

- `/` - Ana sayfa
- `/katil` - Üyelik başvuru formu
- `/tesekkurler` - Başvuru sonrası teşekkür sayfası
- `/yonetim` - Admin yönetim paneli
- `/hakkimizda` - Hakkımızda
- `/iletisim` - İletişim
- `/projeler` - Projeler
- `/etkinlikler` - Etkinlikler

## 🧪 Test

### Smoke Test Adımları
1. ✅ Ana sayfa yükleniyor
2. ✅ "Kulübe Katıl" butonu çalışıyor
3. ✅ Form validasyonu çalışıyor
4. ✅ KVKK onayı zorunlu
5. ✅ Başvuru gönderimi çalışıyor
6. ✅ Teşekkür sayfası görüntüleniyor
7. ✅ Admin paneli erişilebilir
8. ✅ Başvuru listesi yükleniyor
9. ✅ Puanlama sistemi çalışıyor
10. ✅ Discord bildirimi gönderiliyor

### Test Verisi
```sql
-- Test başvurusu eklemek için
INSERT INTO applications (
  full_name, email, phone, school_work, interests, 
  portfolio_example, motivation, weekly_hours, 
  meeting_preference, computer_type, additional_hardware, 
  hardware_sharing, consent_kvkk, consent_date
) VALUES (
  'Test Kullanıcı', 'test@example.com', '05551234567', 
  'Test Üniversitesi', '["coding", "design"]',
  'Test portfolio örneği', 'Test motivasyon metni', 
  '10-15 saat', 'yes', 'windows', '["3d-printer"]', 
  'yes', true, NOW()
);
```

## 🚨 Rollback Planı

### Acil Durum Rollback
1. **Veritabanı**: Supabase dashboard'dan backup restore
2. **Edge Function**: Önceki versiyona geri dön
3. **Frontend**: Git ile önceki commit'e dön

### Rollback Komutları
```bash
# Git rollback
git reset --hard HEAD~1

# Supabase function rollback
supabase functions deploy on_application_submitted --no-verify-jwt

# Database rollback (Supabase dashboard'dan)
```

## 📞 Destek

- **E-posta**: info@silifketeknoloji.com
- **Discord**: [Silifke Teknoloji Discord](https://discord.gg/silifketeknoloji)
- **GitHub Issues**: [Repository Issues](https://github.com/silifke-teknoloji/issues)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not**: Bu sistem KVKK uyumlu olarak tasarlanmıştır. Kişisel verilerin işlenmesi için açık rıza alınmaktadır.
