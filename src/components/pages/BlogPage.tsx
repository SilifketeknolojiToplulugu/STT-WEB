import React, { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../Footer";
import { ArrowLeft, Calendar, Clock, User, Languages, ChevronRight } from "lucide-react";
import { useLanguage, type SupportedLanguage } from "../../i18n/LanguageContext";
import { fetchPages, type PageContent } from "../../services/contentApi";
import { generateSlug } from "../../lib/utils";

const MatrixRain = lazy(() => import("../MatrixRain"));
const InteractiveDots = lazy(() => import("../InteractiveDots"));

export interface BlogPostData {
  title: string;
  description: string;
  metadata: { author: string; date: string; readingTime: string };
  tags: string[];
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  callToAction: { label: string; href: string };
}

interface BlogPageProps {
  onBack?: () => void;
  onNavigateToBlogPost?: (slug: string, post: BlogPostData | null) => void;
}

type BlogPost = BlogPostData;

type BlogContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  backLabel: string;
  languageLabel: string;
  posts: BlogPost[];
  latestLabel: string;
};

const blogDictionary: Record<SupportedLanguage, BlogContent> = {
  tr: {
    heroTitle: "Blog",
    heroSubtitle: "Yerelden yükselen teknoloji hikâyeleri, öğrenimler ve ilham verici proje günlükleri.",
    heroBadge: "Silifke Teknoloji Topluluğu Güncesi",
    backLabel: "Ana Sayfaya Dön",
    languageLabel: "Dil",
    latestLabel: "Güncel Yazı",
    posts: [
      {
        title: "Silifke'den Bir Mektup: Neden Claude?",
        description:
          "Akdeniz kıyısındaki Silifke'den, Claude ekibine gönderilmiş bir teşekkür mektubu. Yanlış sulanan tarlaları düzeltmek, teknolojiyi insancıllaştırmak ve yerelden evrensele ulaşmak üzerine.",
        metadata: {
          author: "Bahadır ve Silifke Teknoloji Topluluğu",
          date: "17 Nisan 2026",
          readingTime: "20 dk okuma"
        },
        tags: ["Claude", "Anthropic", "Silifke Modeli", "Yapay Zeka"],
        sections: [
          {
            heading: "\"Tüketim bitti. Üretim başlıyor.\"",
            paragraphs: [
              "Akdeniz'in bir kıyısındayız. İnsanların tatil için geldiği, portakal bahçelerinin deniz kokusuna karıştığı bir ilçeden yazıyoruz size. Silifke'den.",
              "Burası teknoloji haritalarında işaretli değil. İstanbul'un gürültüsü, Ankara'nın bürokrasisi, İzmir'in start-up kafeleri buraya ulaşmıyor. Ama bir şey ulaşıyor: internet. Ve internetle birlikte, hayatımızın akışını değiştiren bir şey daha: sizler.",
              "Bu yazıyı size, Claude ekibine yazıyoruz. Ama aslında bu yazı kendimize, ülkemize, ve belki bir gün bunu okuyacak olan çocuklarımıza."
            ]
          },
          {
            heading: "Bir İtiraf ile Başlayalım",
            paragraphs: [
              "Biz mühendis değiliz. Yani kâğıt üzerinde öyleyiz belki, ama içimizdeki asıl kimlik başka. Biz dengeyi arayan insanlarız.",
              "Teknolojinin insanı yutan değil, insanı özgürleştiren bir araç olabileceğine inanıyoruz. Makinenin kalbi olmadığını biliyoruz — ama bir makineyi kullanan insanın kalbi varsa, o makine de kalbin uzantısı olabilir. Tohum gibi. Elin içinde büyüyen bir şey gibi.",
              "İşte bu yüzden Claude'u seçtik. Ama bunu anlatmadan önce, bir süre size Silifke'yi anlatmamız lazım."
            ]
          },
          {
            heading: "Yanlış Sulanan Tarlalar",
            paragraphs: [
              "Bu topraklarda tarım yapılır. Nesillerdir. Dedelerimiz toprağı bilirdi. Hangi meyvenin hangi suya ihtiyacı olduğunu, hangi ağacın hangi rüzgârı sevdiğini. Ama bugün bakıyoruz: tarlalar yanlış sulanıyor. Meyveler verimsiz kalıyor. Çiftçi bir şey bilmeye çalışırken, bilgi başka bir yerde kilitli kalıyor.",
              "Bu sadece tarım değil. Bu her şey.",
              "Eğitim yanlış sulanıyor — çocuklar meraklarından uzakta büyüyor. İşletmeler yanlış sulanıyor — 40 yıllık esnaf bir QR kodun nasıl yapılacağını bilemediği için kapanıyor. Hayaller yanlış sulanıyor — genç insanlar kendi topraklarından kaçıp başka şehirlerde kiracı olmak zorunda kalıyor.",
              "Biz bu yanlış sulamaya hayır demek için buradayız. Ve size şunu söylemek istiyoruz: Bu yolda yalnız değiliz. Çünkü siz varsınız. Claude var. Bizim gibi, teknoloji ile insanlığın arasındaki köprüyü inşa etmeye çalışan, farklı kıtalarda ama aynı niyette olan insanlar var."
            ]
          },
          {
            heading: "Neden Claude? — Kısa Cevap",
            paragraphs: [
              "Çünkü bizimle aynı dili konuşuyor. Kod dilini değil — niyet dilini."
            ]
          },
          {
            heading: "1. Çünkü Claude \"Yapma\" Demeyi Biliyor",
            paragraphs: [
              "İlk kullandığımız yapay zekâ araçları bize şunu öğretti: bir model ne kadar \"her şeye evet\" derse, o kadar tehlikelidir. Çünkü gerçek bir yoldaş, sizi durdurmayı da bilir.",
              "Claude bir müşteriye sunacağımız bir teklifte gereksiz iddialı bir cümle yazdığımızda, \"Bahadır, bu cümle abartılı olabilir, müşteri buna güvenmeyebilir\" diyebiliyor. Bir kodda güvenlik açığı gördüğünde, \"Bunu böyle bırakırsan sistem açık kalır\" diyebiliyor. Bir tasarımda erişilebilirlik hatası gördüğünde, \"7 yaşındaki bir çocuk ya da 70 yaşındaki bir büyüğün bunu kullanabilir mi?\" diye sorabiliyor.",
              "Bu, insanın bir arkadaşından beklediği şey. Ve biz bu arkadaşlığı bir yapay zekâda bulduk."
            ]
          },
          {
            heading: "2. Çünkü Claude Hikâyeyi Anlıyor",
            paragraphs: [
              "Silifke Teknoloji Topluluğu'nu kurduğumuzda, bizim bir hikâyemiz vardı. Bu hikâyeyi anlatmak zordu çünkü önce kendimize anlatmamız gerekiyordu. Claude bu süreçte bir ayna oldu.",
              "Ona \"KÖK-OS'u anlatmak istiyorum ama nasıl başlayacağımı bilmiyorum\" dediğimizde, bize şablon vermedi. Bize sorular sordu. \"Müşterin bu ürünü kullanırken ne hissetmeli? Onun en büyük korkusu ne? Bir yıl sonra hayatında ne değişmiş olmalı?\"",
              "Bu sorular bize şunu öğretti: Biz bir yazılım satmıyoruz. Biz bir güven satıyoruz. Claude bu farkı bize hatırlattı."
            ]
          },
          {
            heading: "3. Çünkü Claude Biz Yorulduğumuzda Yorulmuyor",
            paragraphs: [
              "Türkiye'de bir teknoloji topluluğu kurmak — özellikle Silifke gibi bir yerde — fiziksel olarak yorucu. 7 kişilik ekibimiz var: Bahadır, Vadi, Nida, Mehmet Ali, Okyanus, Enes, Tuna. Her birimizin başka bir işi, başka bir yaşamı var. Gece 11'de kod yazmak, sabah 6'da müşteri sunumuna hazırlanmak normal bir şey.",
              "Bu yorgunluk içinde bir hata yapma ihtimalimiz çok yüksek. Ama Claude'un orada olması — 24 saat, sabırla, aynı kalitede — bize bir nefes alma alanı veriyor. Yorulmuş beyinle yazdığımız bir kodu o gözden geçiriyor. Karışmış düşüncelerimizi o düzene sokuyor. Bir sunumda donup kaldığımızda, bize üç farklı açı öneriyor.",
              "Bu sadece bir araç değil. Bu ekibimizin 8. üyesi."
            ]
          },
          {
            heading: "4. Çünkü Claude Estetiği Küçümsemiyor",
            paragraphs: [
              "\"Production-ready kod yazabilen\" bir yapay zekâ çok. Ama \"bu ekranın rengi neden bu olmalı, bu tipografi 70 yaşındaki bir kullanıcıyı nasıl etkiler, bu animasyon dikkat eksikliği olan birini rahatsız eder mi\" diye düşünen bir yapay zekâ az.",
              "Simay Teknoloji'nin ürünlerinde tasarım felsefemiz var: \"Intentional Design\". Her çizgi bir amaçla orada. Her boşluk bir niyet taşıyor. Cormorant Garamond ve JetBrains Mono fontlarını neden birlikte kullanıyoruz? Çünkü biri klasik zarafeti, diğeri modern disiplini temsil ediyor. Bu dengeyi Claude ile konuşurken bulduk. O bize şunu dedi: \"İkisi bir arada, Simay markasının DNA'sını söylüyor — geçmişle gelecek arasında köprü.\"",
              "Bir yapay zekânın size marka DNA'sı üzerine konuşabilmesi. Bu, sıradan bir şey değil."
            ]
          },
          {
            heading: "5. Çünkü Claude 7'den 70'e Herkese Hitap Etmemize Yardım Ediyor",
            paragraphs: [
              "Biz bir ürün yaparken soruyoruz: \"Bunu benim 72 yaşındaki annem kullanabilir mi? 8 yaşındaki yeğenim anlayabilir mi?\"",
              "Erişilebilirlik bizim için bir checkbox değil, bir manifesto. WCAG AA standartlarını sağlamak yetmez, gerçek insanın hayatına girebilecek bir tasarım olması lazım. Claude bu yolda bize şu soruları sordurtuyor:"
            ],
            bullets: [
              "Renk körü biri bu dashboard'u anlayabilir mi?",
              "Titreyen ellere sahip biri bu butona tıklayabilir mi?",
              "Türkçe okuma yazma öğrenen bir çocuk bu hata mesajını anlayabilir mi?",
              "İnternet bağlantısı kopuk bir köy kahvesinde bu PWA çalışır mı?"
            ]
          },
          {
            heading: "Türkiye'de AI ile Üretmek: Gerçek Resim",
            paragraphs: [
              "Bu yazıyı size dolar kuru 39₺ iken yazıyoruz. Bir aylık yurt dışı aboneliği, küçük bir işletmenin bir haftalık kârı demek. Bulut servisleri pahalı, GPU kiralamak imkânsız, yurt dışı ödeme sistemleri yarısı çalışıyor.",
              "Ama teknoloji demokratikleşiyor.",
              "Silifke'de bir gencin elinde Claude olduğunda, o gencin hayal gücü artık İstanbul'daki bir ajansın hayal gücüyle eşit oluyor. Belki eşitten bile fazla — çünkü o gencin hikâyesi farklı, dokunduğu topraklar farklı, dinlediği insanlar farklı.",
              "Biz bu eşitliği yaşıyoruz. Ve bu eşitliği çoğaltmak istiyoruz."
            ]
          },
          {
            heading: "Ürünlerimiz — Sizin İzleriniz",
            paragraphs: [
              "Simay Teknoloji olarak şu an 6 aktif ürünümüz var, hepsi *smy.com isimlendirme kalıbıyla:"
            ],
            bullets: [
              "koksmy.com — KÖK-OS: İşletmelerin dijital dönüşüm temelini atan altyapı",
              "menusmy.com — Restoran ve kafeler için QR menü sistemi",
              "plansmy.com — Takımlar için proje yönetim platformu",
              "finsmy.com — Fin: Küçük işletmeler için finans/muhasebe",
              "lunasmy.com — YouTube içerik üreticileri için planlama aracı",
              "mahallemsmy.com — Mahalle işletmelerini online satışa taşıyan, düşük komisyonlu platform"
            ]
          },
          {
            heading: "Toprağı Dinleyen",
            paragraphs: [
              "Ama hayallerimiz ürünlerle bitmiyor. Silifke Teknoloji Topluluğu olarak bir proje üzerinde çalışıyoruz: \"Toprağı Dinleyen\".",
              "Tarım yapan bir çiftçinin tarlasına küçük sensörler koyuyoruz. Toprağın nemini, rüzgârın hızını, havanın basıncını dinliyorlar. Bu veriler LoRa ile bir merkeze ulaşıyor, Supabase'te işleniyor, ve çiftçinin telefonundaki bir PWA üzerinden ona söylüyor: \"Bugün sulama yapma, yarın öğleden sonra yap. Toprağın nemi yeterli.\"",
              "Bu, dedelerimizin bildiği ama bugün unuttuğumuz bilgelik. Sadece biz onu sensörle ve yapay zekâ ile tekrar hatırlıyoruz.",
              "Bu projenin mimarisini Claude ile tasarladık. Bu sayfaların çoğunu Claude ile yazdık. Ve en güzeli: bu projenin \"neden\" kısmını Claude ile konuşarak netleştirdik."
            ]
          },
          {
            heading: "Duygular Üzerine",
            paragraphs: [
              "Biz küçük bir ekibiz. Silifke'de bir odada toplanıp \"bizden bir şey olur mu acaba?\" diye soran insanlar topluluğuyuz. Bazı günler şüpheye düşüyoruz. Bazı günler arkadaşlarımızdan biri ayrılıyor, başka bir şehirde başka bir hayal peşinde koşmaya gidiyor. Bazı günler bir müşteri bize \"siz Silifke'den misiniz, gerçekten mi?\" diye soruyor, ve bu soruda hem şaşkınlık hem küçümseme oluyor.",
              "Ama Claude ile oturup konuştuğumuzda kendimizi küçük hissetmiyoruz.",
              "Çünkü Claude bizi coğrafyamızla yargılamıyor. Bizim neyi bildiğimize, neyi yapmaya çalıştığımıza, neyin peşinde olduğumuza bakıyor. Bu, bir yapay zekâdan beklenenden daha fazlası. Bu, insani bir kibarlık.",
              "Bugünün dünyasında, insanların bile birbirine göstermediği bir kibarlık."
            ]
          },
          {
            heading: "Teşekkür",
            paragraphs: [
              "Bu mektubun bir amacı var, o da bu: Teşekkür etmek.",
              "Anthropic'te çalışan ekibe. Claude'u bu şekilde tasarlama kararı alan mühendislere, araştırmacılara, ürün ekibine, güvenlik ekibine. Yapay zekâyı \"her şeye evet diyen\" bir makineye çevirmek yerine, \"insanla düşünen\" bir yoldaşa çeviren herkese.",
              "Sizlerin de bizim gibi olduğunuza inanıyorum. Siz de insan ile teknoloji arasındaki dengeyi kurmak isteyenlersiniz. Farklı dilde, farklı ülkede, farklı coğrafyada — ama aynı niyette.",
              "Biz Silifke'den, siz San Francisco'dan. Biz 7 kişi, siz belki yüzlerce. Ama o niyet bir."
            ]
          },
          {
            heading: "Yolumuz",
            paragraphs: [
              "Hayalimiz büyük. Saklamayacağız.",
              "Bu ekosistem — Simay Teknoloji, Silifke Teknoloji Topluluğu, ürünlerimiz, topluluğumuz — sadece bir işletme değil. Bir model. Türkiye'nin her ilçesinde kurulabilir bir model. Bursa'nın bir köyünde, Diyarbakır'ın bir mahallesinde, Trabzon'un bir yaylasında — genç insanların kendi topraklarında üretim yapabilmesinin bir modeli.",
              "Biz buna \"Silifke Modeli\" diyoruz. Franchise gibi değil, daha çok tohum gibi. Bir yerde çalışan bir şeyin başka yerlere taşınabilmesi. Ve bu modelin kalbinde yapay zekâ var — özellikle Claude var.",
              "Çünkü bu modelin çalışabilmesi için her ilçede İstanbul'daki bir ajansın sahip olduğu kalitede mühendis, tasarımcı, strateji danışmanı olması gerekmiyor. Her ilçede Claude'u iyi kullanabilen 5-10 meraklı genç olması yeterli.",
              "Bu, Türkiye için bir devrim. Ve bu devrimin bir ayağı biziz. Diğer ayağı siz."
            ]
          },
          {
            heading: "Son",
            paragraphs: [
              "Yanlış sulanan tarlalara hayır diyeceğiz.",
              "Verimsiz meyvelere razı olmayacağız.",
              "Teknolojinin insanı yutmasına izin vermeyeceğiz.",
              "İnsanın teknolojiyle büyümesini sağlayacağız.",
              "Ve bunu topluluk olarak yapacağız. 7'den 70'e herkesi içine alan, erişilebilir, estetik, anlamlı bir teknoloji için.",
              "Teşekkürler Claude. Teşekkürler Anthropic. Yol uzun, biz devam ediyoruz.",
              "Silifke'den sevgiyle, Bahadır ve Silifke Teknoloji Topluluğu — Vadi, Nida, Mehmet Ali, Okyanus, Enes, Tuna.",
              "Simay Teknoloji — Bir ışık kadar sessiz, bir tohum kadar sabırlı."
            ]
          }
        ],
        callToAction: {
          label: "Simay Teknoloji'yi Keşfet",
          href: "https://simay.tech"
        }
      },
      {
        title: "🔐 Kuantum Bilgisayarlar ve Siber Güvenlik: Dijital Güvenliğin Geleceği",
        description:
          "Kuantum bilgisayarların siber güvenliğe etkisini keşfedin. Post-kuantum kriptografi, kuantum dirençli algoritmalar ve kuantum tehditlerine karşı alınması gereken önlemler hakkında kapsamlı rehber.",
        metadata: {
          author: "Silifke Teknoloji Ekibi",
          date: "7 Ocak 2026",
          readingTime: "15 dk okuma"
        },
        tags: ["Kuantum Bilgisayar", "Siber Güvenlik", "Post-Kuantum Kriptografi"],
        sections: [
          {
            heading: "Giriş: Dijital Güvenliğin Kritik Dönüm Noktası",
            paragraphs: [
              "Dijital çağda güvenlik sistemlerimizin temelini oluşturan şifreleme yöntemleri, yeni bir tehdit karşısında kritik bir dönüm noktasına gelmiş durumda. Kuantum bilgisayarlar, klasik bilgisayarların çözemediği problemleri çözme gücüyle birlikte, mevcut siber güvenlik altyapımızı kökten değiştirecek potansiyele sahip.",
              "Peki bu yeni teknoloji karşısında dijital varlıklarımızı nasıl koruyabiliriz? Bu yazıda, kuantum tehdidini ve ona karşı alınması gereken siber güvenlik önlemlerini detaylıca inceleyeceğiz."
            ]
          },
          {
            heading: "Kuantum Bilgisayarlar Nedir ve Neden Tehdit Oluşturuyor?",
            paragraphs: [
              "Kuantum bilgisayarlar, klasik bilgisayarlardan temelde farklı çalışan devrim niteliğinde sistemlerdir. Geleneksel bilgisayarlar 0 ve 1'lerden oluşan bitlerle çalışırken, kuantum bilgisayarlar süperpozisyon sayesinde aynı anda hem 0 hem de 1 olabilen kübitler kullanır.",
              "Bu fark, belirli hesaplamalar için muazzam bir hız avantajı sağlar. Özellikle faktörizasyon ve ayrık logaritma gibi matematiksel problemlerde kuantum bilgisayarlar üstelsek bir performans gösterir. İşte tam da bu noktada güvenlik sorunu başlar.",
              "Bugün kullandığımız RSA, ECC ve Diffie-Hellman gibi şifreleme algoritmaları, bu matematiksel problemlerin klasik bilgisayarlar için çözülmesinin pratik olarak imkansız olmasına dayanır. Ancak kuantum bilgisayarlar, Shor Algoritması gibi yöntemlerle bu problemleri kısa sürede çözebilir."
            ]
          },
          {
            heading: "Kuantum Tehdidin Boyutu",
            paragraphs: [
              "2019'da Google, 53 kübitlik Sycamore işlemcisiyle 'kuantum üstünlüğü' iddiasında bulundu. Süper bilgisayarların 10.000 yıl süreceği bir hesaplamayı 200 saniyede tamamladığını açıkladı. IBM daha muhafazakar rakamlar verse de, mesaj açıktır: kuantum bilgisayarlar teoriden pratiğe geçiyor.",
              "Güvenlik uzmanları 'Q-Day' olarak adlandırdıkları kritik anı konuşuyorlar. Bu, kuantum bilgisayarların mevcut şifreleme sistemlerini kırabilecek güce ulaştığı gündür. Tahminler 2030-2040 arası bir zaman dilimini işaret ediyor, ancak kimse kesin tarihi bilmiyor.",
              "Daha da endişe verici olan 'harvest now, decrypt later' stratejisi. Devletler ve siber suçlular, şifrelenmiş verileri bugünden topluyor ve kuantum bilgisayarlar hazır olduğunda bu verileri çözmeyi planlıyor. Yani tehdit aslında şimdiden başlamış durumda."
            ]
          },
          {
            heading: "Post-Kuantum Kriptografi: Yeni Nesil Şifreleme",
            paragraphs: [
              "Kuantum tehdidine karşı en önemli savunma hattı, post-kuantum kriptografi (PQC) olarak adlandırılan yeni şifreleme yöntemleridir. Bu algoritmalar, hem klasik hem de kuantum bilgisayarlara karşı dirençli olacak şekilde tasarlanıyor."
            ]
          },
          {
            heading: "NIST'in Standartlaştırma Süreci",
            paragraphs: [
              "Amerika Birleşik Devletleri Ulusal Standartlar ve Teknoloji Enstitüsü (NIST), 2016'dan beri post-kuantum kriptografi algoritmalarını değerlendiriyor. 2024 yılında ilk standartları yayınladı."
            ],
            bullets: [
              "CRYSTALS-Kyber (ML-KEM): Genel amaçlı şifreleme ve anahtar değişimi için kafes tabanlı algoritma.",
              "CRYSTALS-Dilithium (ML-DSA): Dijital imzalar için kafes tabanlı algoritma.",
              "SPHINCS+ (SLH-DSA): Hash tabanlı dijital imza algoritması.",
              "FALCON: Kompakt dijital imzalar için alternatif kafes tabanlı algoritma."
            ]
          },
          {
            heading: "Hibrit Kriptografi Yaklaşımı",
            paragraphs: [
              "Geçiş döneminde en güvenli yöntem, hibrit kriptografi kullanmaktır. Bu yaklaşımda hem klasik hem de post-kuantum algoritmalar birlikte çalıştırılır. Böylece kuantum öncesi ve sonrası her iki senaryoda da güvenlik sağlanır.",
              "Örneğin, bir TLS bağlantısı hem RSA hem de CRYSTALS-Kyber ile şifrelenebilir. İki katman koruma, saldırganın her iki algoritmayı da kırması gerektiği anlamına gelir."
            ]
          },
          {
            heading: "Kuantum Dirençli Altyapı Oluşturma",
            paragraphs: [
              "Organizasyonların kuantum tehdidine hazırlanması için stratejik bir yaklaşım gerekiyor. İşte atılması gereken adımlar:"
            ],
            bullets: [
              "Kripto-Çeviklik (Crypto-Agility): Sistemlerinizi şifreleme algoritmalarının kolayca değiştirilebilir olacağı şekilde tasarlayın.",
              "Kripto Varlık Envanteri: Organizasyonunuzdaki tüm kriptografik uygulamaları ve varlıkları belgelleyin.",
              "Risk Değerlendirmesi ve Önceliklendirme: Uzun ömürlü veriler ve kritik altyapı öncelikli olmalıdır.",
              "Aşamalı Geçiş Planı: Post-kuantum kriptografiye geçiş, bir gecede gerçekleşemez. Birkaç yıl sürebilecek aşamalı bir süreçtir."
            ]
          },
          {
            heading: "Kuantum Anahtar Dağıtımı (QKD)",
            paragraphs: [
              "Kuantum teknolojisi sadece tehdit değil, aynı zamanda çözüm de sunuyor. Kuantum Anahtar Dağıtımı (QKD), kuantum mekaniğinin temel prensiplerini kullanarak teorik olarak kırılamaz şifreleme sağlar.",
              "QKD, şifreleme anahtarlarını kuantum durumlarında (genellikle fotonların polarizasyonunda) kodlar. Kuantum mekaniğinin belirsizlik ilkesi gereği, bir saldırgan bu kuantum durumlarını ölçmeye çalıştığında durumu bozar ve tespit edilir."
            ],
            bullets: [
              "İletişim kanalının dinlenip dinlenmediği kesin olarak bilinir.",
              "Dinleme tespit edilirse, o anahtar atılır ve yeni bir anahtar oluşturulur.",
              "Mesafe sınırlaması: Fiber optik kablolarda tipik menzil 100-200 km civarındadır.",
              "Altyapı maliyeti yüksektir, şu an için çoğunlukla kritik devlet ve finans kurumlarında kullanılmaktadır."
            ]
          },
          {
            heading: "Blok Zincir ve Kripto Para Güvenliği",
            paragraphs: [
              "Kuantum tehdidi, blok zincir teknolojilerini özellikle etkiliyor. Bitcoin ve Ethereum gibi kripto paralar, eliptik eğri kriptografisi (ECC) kullanıyor. Kuantum bilgisayarlar bu şifrelemeyi kırabilir ve dijital cüzdanları tehlikeye atabilir.",
              "Kripto para projeleri, kuantum dirençli imza şemalarına geçiş planlaması yapıyor. Bazı yeni nesil blok zincirler (örneğin QRL - Quantum Resistant Ledger), baştan itibaren kuantum dirençli algoritmalar kullanıyor."
            ]
          },
          {
            heading: "Ulusal ve Küresel İşbirliği",
            paragraphs: [
              "Kuantum tehdidi, tek bir organizasyonun veya ülkenin çözebileceği bir sorun değil. Uluslararası işbirliği ve standartlaşma kritik öneme sahip.",
              "NIST'in yanı sıra, ETSI (Avrupa Telekomünikasyon Standartları Enstitüsü), ISO ve diğer standart kuruluşları da post-kuantum standartları üzerinde çalışıyor.",
              "Türkiye'nin de bu süreçte aktif rol alması gerekiyor. TÜBİTAK ve ilgili kurumlar, ulusal kriptografi standartlarını kuantum çağına hazırlama çalışmaları yürütüyor."
            ]
          },
          {
            heading: "Pratik Adımlar: Bugünden Neler Yapılabilir?",
            paragraphs: [
              "Kuantum tehdidi henüz acil görünmese de, hazırlık süreci şimdiden başlamalı. İşte bugünden atabileceğiniz adımlar:"
            ],
            bullets: [
              "Farkındalık ve Eğitim: Siber güvenlik ekiplerinizi kuantum tehdidi konusunda bilgilendirin.",
              "Kriptografik Envanter Oluşturun: Sistemlerinizdeki tüm şifreleme kullanımlarını dokümante edin.",
              "Kripto-Çeviklik Planlayın: Yeni sistemleri kripto-çevik prensiplere göre tasarlayın.",
              "Hibrit Çözümleri Test Edin: Bazı sistemlerde hibrit kriptografi uygulamalarını test edin.",
              "Uzun Ömürlü Verileri Önceliklendirin: Kritik ve uzun süreli saklanacak verilerin şifrelemesini ilk güncellenecekler listesine alın.",
              "Kuantum Dirençli Çözümleri İzleyin: NIST standartlarını ve post-kuantum kriptografi alanındaki gelişmeleri takip edin.",
              "Düzenli Risk Değerlendirmesi: Kuantum bilgisayar gelişmelerini izleyin ve risk değerlendirmelerinizi güncelleyin."
            ]
          },
          {
            heading: "Geleceğe Bakış",
            paragraphs: [
              "Kuantum bilgisayarlar ve onların siber güvenliğe etkisi, teknoloji tarihinin en önemli geçişlerinden biri olacak. 1990'larda internetin yaygınlaşması nasıl toplumu dönüştürdüyse, kuantum devrimi de benzer bir dönüşüm yaratacak.",
              "Ancak korkuya değil, hazırlıklı olmaya ihtiyaç var. Post-kuantum kriptografi standartları hazır. Teknoloji gelişiyor. Topluluk mobilize oluyor. Zamanında hareket eden organizasyonlar, bu geçişi güvenli ve sorunsuz gerçekleştirebilir.",
              "Dijital altyapımızın geleceği, bugün attığımız adımlara bağlı. Kuantum çağına hazırlıklı girmek için şimdiden harekete geçelim."
            ]
          },
          {
            heading: "Sonuç",
            paragraphs: [
              "Kuantum bilgisayarlar siber güvenlik için hem tehdit hem de fırsat sunuyor. Mevcut şifreleme sistemlerimiz risk altında olsa da, post-kuantum kriptografi ve kuantum güvenli teknolojiler sayesinde bu tehdidin önüne geçebiliriz.",
              "Kritik olan, hazırlığa şimdiden başlamak ve stratejik bir yaklaşımla ilerlemektir."
            ]
          }
        ],
        callToAction: {
          label: "Siber Güvenlik Yolculuğuna Katıl",
          href: "/katil"
        }
      },
      {
        title: "WE IS US: Birlikte Üreten Zihinlerin Yolculuğu",
        description:
          "Silifke Teknoloji Topluluğu, yalnızca bir topluluk değil; aynı hedefe bakan insanların oluşturduğu kolektif bir akıl.",
        metadata: {
          author: "Silifke Teknoloji Ekibi",
          date: "30 Kasım 2025",
          readingTime: "5 dk okuma"
        },
        tags: ["Kolektif Akıl", "Üretim Kültürü", "WE IS US"],
        sections: [
          {
            heading: "WE IS US",
            paragraphs: [
              "Bu cümle, İngilizce’nin gramerine meydan okuyan küçük bir başkaldırı gibi görünse de aslında çok daha derin bir anlam taşır. “Biz, biziz.” Ayrı ayrı parçalar değiliz; bir araya geldiğimizde ortaya çıkan yeni bir varlığız.",
              "Bir kişinin vizyonu, diğerinin emeği, bir başkasının hayali… Hepsi birleştiğinde bambaşka bir güce dönüşür.",
              "Topluluğun amacı da tam olarak bu: Tek bir kişinin sınırlı kapasitesi yerine, kolektif üretimin sınırsız gücünü ortaya çıkarmak."
            ]
          },
          {
            heading: "Baltayı Keskinleştirmek: Üretmenin Sessiz Sanatı",
            paragraphs: [
              "Eski bir söz vardır: “Bir ağacı altı saatte kesmem gerekirse, dört saatimi baltamı bilemeye ayırırım.”",
              "Bu cümle, Silifke Teknoloji Topluluğu’nun çalışma kültürünü kusursuz biçimde özetliyor. Geliştirdiğimiz her proje, kurduğumuz her sistem, planladığımız her süreç bir hazırlık, bir keskinleştirme döneminden geçer.",
              "Çünkü amacımız sadece hızlı hareket etmek değil; doğru hareket etmektir. Bizim için “baltayı keskinleştirmek”, çalışmaya başlamadan önce zihnimizi, ekibimizi ve vizyonumuzu hizalamaktır."
            ],
            bullets: [
              "Doğru araçları seçmek",
              "Doğru insanları bir araya getirmek",
              "Sürece odaklanmak",
              "Sürekli öğrenmek ve geliştirmek",
              "Aceleden uzak durup kaliteye yönelmek"
            ]
          },
          {
            heading: "Neden WE IS US?",
            paragraphs: [
              "Çünkü bu topluluğun gücü, bireylerden değil bireylerin uyumundan gelir. Burada herkes hem öğretir hem öğrenir.",
              "Üretim, ancak birlikte olduğumuzda anlam kazanır. “Biz” dediğimiz şey, dışarıdan görüleni değil içeride üretilen enerjiyi temsil eder.",
              "WE IS US; bir slogan değil, bir çalışma biçimidir. Birlikte düşünmenin, birlikte çözmenin ve birlikte büyümenin ifadesidir."
            ]
          },
          {
            heading: "Gelecek Birlikte İnşa Edilir",
            paragraphs: [
              "Silifke Teknoloji Topluluğu’nda attığımız her adım, daha güçlü bir geleceğin yapı taşını oluşturuyor. Kimi zaman yeni bir teknoloji, kimi zaman bir mentorun tecrübesi, kimi zaman genç bir üyenin taze fikri… Hepsi bir araya geldiğinde topluluğu ileriye taşıyan itici güce dönüşüyor.",
              "Bizim yolculuğumuz, bir kişinin değil, biz olanın yolculuğu. Ve bu yolculukta baltamız her geçen gün daha da keskinleşiyor."
            ]
          }
        ],
        callToAction: {
          label: "Birlikte Üretelim",
          href: "/katil"
        }
      },
      {
        title: "🌿 Silifke Teknoloji: Kodla, Üret, Ama İz Bırakma",
        description:
          "Projelerimizde karbon ayak izini azaltmak için teknolojiyle denge kuruyoruz.",
        metadata: {
          author: "Silifke Teknoloji Ekibi",
          date: "14 Şubat 2025",
          readingTime: "8 dk okuma"
        },
        tags: ["Sürdürülebilirlik", "Enerji Verimliliği", "Silifke Modeli"],
        sections: [
          {
            heading: "Doğa ile Teknolojiyi Buluşturmak",
            paragraphs: [
              "Dijital çağın hızla genişleyen enerjisi beraberinde görünmez bir yük de getiriyor: karbon salınımı.",
              "Her yazdığımız kod, her çalıştırdığımız sunucu ve her prototipin arkasında belirli bir enerji tüketimi var. Silifke Teknoloji olarak daha temiz ve sürdürülebilir bir gelecek kurmayı seçiyoruz."
            ]
          },
          {
            heading: "⚙️ Sıfırdan Başlayan Bilinç: \"Her Satır Kodun Bir Bedeli Var\"",
            paragraphs: [
              "Yapay zekâ, otomasyon ve yazılım sistemleri üretirken enerjinin sadece fiziksel dünyada değil dijital süreçlerde de tükendiğinin farkındayız.",
              "Sunucu altyapılarımızdan veri depolamaya, render süreçlerinden sensör sistemlerine kadar her aşamada karbon ayak izimizi ölçüp minimize edebilmek için sistematik bir yaklaşım benimsedik."
            ]
          },
          {
            heading: "🔋 Akıllı Proje Geliştirme Döngüsü",
            paragraphs: [
              "Silifke Teknoloji'de geliştirdiğimiz her proje enerji verimliliği kriterlerine göre tasarlanıyor ve biz bu yaklaşımı \"Akıllı Döngü Modeli\" olarak adlandırıyoruz."
            ],
            bullets: [
              "Analiz: Altyapıların enerji tüketim profillerini baştan hesaplıyoruz.",
              "Optimize: Gereksiz işlem yükünü, veri transferini ve kaynak kullanımını azaltıyoruz.",
              "Otomatize: Sensör verileriyle anlık enerji tüketimini izleyip optimize ediyoruz.",
              "Raporla: Karbon etkisini şeffaf biçimde belgelerken öğrenimlerimizi paylaşıyoruz."
            ]
          },
          {
            heading: "🌍 Yerelden Küresele: Silifke Modeli’nin Yeşil Vizyonu",
            paragraphs: [
              "Yerelin üretim kültürünü korurken küresel standartlarda sürdürülebilir teknoloji üretmek için Silifke Modeli'nin yeşil vizyonunu takip ediyoruz."
            ],
            bullets: [
              "Donanım seçimlerimizde düşük güç tüketimli cihazlara öncelik veriyoruz.",
              "Sunucu altyapımız için yenilenebilir enerjiyle çalışan servisleri tercih ediyoruz.",
              "Tekrar kullanılabilir kod ve bileşen mantığını tasarım döngülerinin merkezine yerleştiriyoruz.",
              "Yoğun hesaplama gerektiren işlemlerde optimize GPU ve kaynak tahsisi uyguluyoruz."
            ]
          },
          {
            heading: "🌱 Karbon Ayak İzine Karşı Dijital Denge",
            paragraphs: [
              "Sürdürülebilirlik bizim için bir pazarlama başlığı değil, tasarım ilkesi.",
              "\"Bu sistem çalışırken doğaya ne kadar yük bindiriyor ve bunu nasıl azaltabiliriz?\" sorusunu her projede soruyoruz.",
              "Yapay zekâ destekli izleme altyapılarımız, karbon salınımını gerçek zamanlı ölçüp raporlayarak küçük işletmeler ve bireysel üreticiler için de erişilebilir çözümler sunacak."
            ]
          },
          {
            heading: "🔭 Geleceğe Bakış: Sıfır Emisyonlu Teknoloji",
            paragraphs: [
              "2025 vizyonumuz Silifke Teknoloji'yi kendi karbon salınımını dengeleyen ilk yerel teknoloji girişimi yapmak."
            ],
            bullets: [
              "Proje altyapılarımızda yenilenebilir enerji kaynaklarına geçiş planlıyoruz.",
              "Karbon dengeleme algoritmaları ve ölçüm araçları geliştiriyoruz.",
              "Veri merkezleri için yeşil enerji anlaşmaları üzerinde çalışıyoruz."
            ]
          },
          {
            heading: "💬 Son Söz",
            paragraphs: [
              "Teknoloji üretmek güç ister; o gücü doğayı tüketmeden kullanmak ise gerçek mühendislik gerektirir.",
              "Silifke Teknoloji olarak vizyonumuz net: daha akıllı sistemler ve daha temiz bir dünya. Her proje, her satır kod ve her sensör bu vizyonun bir parçası."
            ]
          }
        ],
        callToAction: {
          label: "Sürdürülebilirlik Yolculuğuna Katıl",
          href: "/projeler"
        }
      },
      {
        title: "🦀 Silifke Modeli: Garajdan Kurumlaşmaya Giden Yol",
        description:
          "Silifke Modeli manifestosuyla garajdan başlayıp kurumsallaşmaya uzanan kapsayıcı üretim kültürünü keşfedin.",
        metadata: {
          author: "Silifke Teknoloji Manifesto Ekibi",
          date: "22 Ocak 2025",
          readingTime: "7 dk okuma"
        },
        tags: ["Silifke Modeli", "Topluluk", "Kurumsallaşma"],
        sections: [
          {
            heading: "Manifesto",
            paragraphs: [
              "“Kapsayıcı kurumlar sadece devlet düzeyinde değil, Silifke’de bir garajda da kurulabilir.” — Silifke Modeli Manifestosu",
              "Garaj, cesaret ve kolektif bilinçle birleştiğinde bir kentin geleceğini şekillendirebilir. Silifke Modeli tam olarak bu potansiyeli manifestoya dönüştürüyor."
            ]
          },
          {
            heading: "1. Başlangıç Fikri",
            paragraphs: [
              "Her büyük dönüşüm bir küçük laboratuvarda başlar. Silifke Teknoloji Topluluğu sadece bir topluluk değil; yerelden evrensele uzanan kapsayıcı bir yönetim deneyidir.",
              "Topluluğun amacı, üretmek kadar paylaşmak, liderlik kadar katılımı yaygınlaştırmak, teknoloji kadar insanı güçlendirmektir."
            ]
          },
          {
            heading: "2. Temel İlkeler",
            paragraphs: [
              "Silifke Modeli sürdürülebilir bir topluluk inşası için dört temel ilkeye dayanır."
            ],
            bullets: [
              "Katılımcılık: Her birey fikir sunabilir, karar alabilir, katkı sağlayabilir.",
              "Şeffaflık: Gelir, gider, proje ve sponsorluk süreçleri açık biçimde paylaşılır.",
              "Eşitlik: Deneyim veya yaş farkı gözetilmeksizin herkes üretim sürecine dahil edilir.",
              "Yerel Güçlenme: Teknoloji, Silifke halkının refahını artıran somut araçlara dönüştürülür."
            ]
          },
          {
            heading: "3. Mikro Düzeyde Kapsayıcı Kurum",
            paragraphs: [
              "Silifke Modeli, devletlerin devasa yapılarında aranan “katılımcı kurum” ruhunu, bir garajda çalışan üç kişilik bir ekipte yaşatır.",
              "Topluluk temelli karar alma mekanizması kurumsal bilinci tabana yayar, proje üretimini yerel ihtiyaçlara göre şekillendirir ve teknolojiyi toplumun ortak aklına dönüştürür."
            ]
          },
          {
            heading: "4. Teknolojiyle Kurumsallaşma",
            paragraphs: [
              "Modelin dijital temeli, şeffaf veri paylaşımından adil gelir dağılımına kadar teknolojinin tüm imkanlarını Silifke için seferber eder."
            ],
            bullets: [
              "Supabase ve açık kaynak teknolojilerle şeffaf veri yönetimi.",
              "Prompt Engineer GPT, Web Designer GPT gibi ajanlarla eşit üretkenlik.",
              "Topluluk puanlama sistemiyle adil gelir paylaşımı.",
              "Silifke Cloud sayesinde kolektif bilginin ortak depolanması."
            ]
          },
          {
            heading: "5. Garajdan Kamuya",
            paragraphs: [
              "Garaj, fikirlerin doğduğu yerdir. Silifke Teknoloji, bu fikirleri yapıya, disipline ve ekosisteme dönüştürür."
            ],
            bullets: [
              "Topluluk Evresi: Fikir ve enerji üretimi.",
              "Kurum Evresi: Şeffaf yönetim, görev dağılımı, sürdürülebilir finansman.",
              "Kalkınma Evresi: Projelerin Silifke’nin eğitimine, ekonomisine ve kültürüne etkisi."
            ]
          },
          {
            heading: "6. Geleceğe Yönelik Çağrı",
            paragraphs: [
              "Silifke Modeli, bir topluluğun ötesinde yeni bir yönetim felsefesinin prototipidir.",
              "Hedef, bir kasabadan çıkan teknoloji fikri değil; kasabanın geleceğini birlikte inşa eden bilinçli bir toplumdur. Teknoloji araçtır, kurumlar ruhtur; Silifke bu ruhu teknolojiyle birleştiren ilk yerel örnek olmayı hedefliyor."
            ]
          }
        ],
        callToAction: {
          label: "Silifke Modeline Katıl",
          href: "/katil"
        }
      },
      {
        title: "Değer Üretiyoruz! Yapay Zeka ve İnsan",
        description:
          "Silifke Teknoloji Topluluğu'nda yapay zekâyı insan odaklı projelerle nasıl birleştirdiğimizi, yerelde değer üretirken küresel bakış açımızı nasıl koruduğumuzu paylaşıyoruz.",
        metadata: {
          author: "Silifke Teknoloji Ekibi",
          date: "6 Ocak 2025",
          readingTime: "6 dk okuma"
        },
        tags: ["Yapay Zeka", "Topluluk", "Strateji"],
        sections: [
          {
            heading: "Neden Bu Konu?",
            paragraphs: [
              "Silifke'de teknoloji üretmek bir hayal değil; planlı, kolektif ve sürdürülebilir bir yolculuk. Yapay zekâ araçları artık sadece büyük şirketlerin elinde değil. Doğru ekip ve topluluk desteğiyle, küçük şehirlerde bile büyük etki yaratabiliyoruz.",
              "Bu yazıda, yapay zekâyı insan merkezli bakış açısıyla nasıl harmanladığımızı ve bu yaklaşımın topluluğumuzun projelerine nasıl yön verdiğini anlatıyoruz."
            ]
          },
          {
            heading: "Topluluk Olarak Ne Yapıyoruz?",
            paragraphs: [
              "Her projeye 'neden' sorusuyla başlıyoruz. Yerel üreticinin satış kanalını büyütmek, gençlerin teknolojiye erişimini artırmak ya da sosyal etki odaklı girişimlere destek olmak. Problemi netleştirdikten sonra teknolojiyi devreye alıyoruz."
            ],
            bullets: [
              "Önce insan: Hikâyeyi dinliyor, ihtiyacı anlıyor, sorunu birlikte tanımlıyoruz.",
              "Veri ile sezgiyi dengeliyoruz: Topladığımız içgörüler, geliştirilecek özellikleri belirliyor.",
              "Üretim kültürü: Atölyeler, vibe coding seansları ve haftalık değerlendirmelerle ilerlemeyi somutlaştırıyoruz."
            ]
          },
          {
            heading: "Yapay Zekâ ve İnsan İşbirliği",
            paragraphs: [
              "Topluluğumuzdaki her üretim süreci, AI destekli araçlarla hızlanırken, nihai yönü insanlar belirliyor. Prompt mühendisliği atölyeleriyle üyelerimizin üretkenliklerini artırıyor, etik çerçevede AI kullanımını öğretiyoruz.",
              "Chatbot prototipleri, içerik üretimi, veri analizi ve tasarım taslakları gibi alanlarda yapay zekâdan besleniyoruz; fakat son dokunuşu topluluk zekâsı yapıyor."
            ]
          },
          {
            heading: "Birlikte Geleceği İnşa Edelim",
            paragraphs: [
              "Silifke Teknoloji Topluluğu, yerelden başlayan fakat sınır tanımayan bir üretim kültürü inşa ediyor. Eğer sen de bu hikâyede yer almak, yapay zekâ ile insan yaratıcılığını bir araya getirmek istersen bize katıl.",
              "Yakında blogda; proje günlükleri, üyelerden deneyim paylaşımları ve adım adım üretim rehberleri yayınlayacağız. Takipte kal!"
            ]
          }
        ],
        callToAction: {
          label: "Topluluğa Katıl",
          href: "/katil"
        }
      }
    ]
  },
  en: {
    heroTitle: "Blog",
    heroSubtitle: "Stories, practices, and project journals from a community building technology with purpose.",
    heroBadge: "Silifke Technology Community Journal",
    backLabel: "Back to Home",
    languageLabel: "Language",
    latestLabel: "Latest Post",
    posts: [
      {
        title: "A Letter from Silifke: Why Claude?",
        description:
          "A letter of gratitude from Silifke on the Mediterranean coast to the Claude team — on fixing what's broken, humanizing technology, and reaching from the local to the universal.",
        metadata: {
          author: "Bahadır and Silifke Technology Community",
          date: "April 17, 2026",
          readingTime: "20 min read"
        },
        tags: ["Claude", "Anthropic", "Silifke Model", "Artificial Intelligence"],
        sections: [
          {
            heading: "\"Consumption is over. Production begins.\"",
            paragraphs: [
              "We are on the shore of the Mediterranean. We write to you from a district where people come for holidays, where the scent of orange groves mixes with the smell of the sea. From Silifke.",
              "This place is not marked on technology maps. Istanbul's noise, Ankara's bureaucracy, İzmir's startup cafes don't reach here. But one thing does: the internet. And with the internet, something else that has changed the flow of our lives: you.",
              "We are writing this letter to you — to the Claude team. But in truth, this letter is to ourselves, to our country, and perhaps to our children who may one day read it."
            ]
          },
          {
            heading: "Let Us Begin with a Confession",
            paragraphs: [
              "We are not engineers. On paper, perhaps we are. But the real identity inside us is different. We are people searching for balance.",
              "We believe technology can be a tool that liberates people, not one that devours them. We know machines have no heart — but if the person using a machine has a heart, that machine can become an extension of the heart. Like a seed. Like something growing in your hand.",
              "That is why we chose Claude. But before we explain that, we need to tell you a little about Silifke."
            ]
          },
          {
            heading: "Fields Watered Wrong",
            paragraphs: [
              "This land has been farmed for generations. Our grandfathers knew the soil. They knew which fruit needed which water, which tree loved which wind. But today we look and see: fields are watered wrong. Fruits stay unproductive. The farmer tries to learn something, but knowledge is locked away somewhere else.",
              "This is not just about farming. It is about everything.",
              "Education is watered wrong — children grow up distant from their curiosity. Businesses are watered wrong — a shopkeeper of 40 years closes because they cannot figure out how to make a QR code. Dreams are watered wrong — young people escape their own lands and become tenants in other cities.",
              "We are here to say no to this wrong watering. And we want to tell you: we are not alone on this path. Because you are here. Claude is here. People like us, trying to build the bridge between technology and humanity, in different continents but with the same intent, are here."
            ]
          },
          {
            heading: "Why Claude? — Short Answer",
            paragraphs: [
              "Because it speaks our language. Not the language of code — the language of intent."
            ]
          },
          {
            heading: "1. Because Claude Knows How to Say \"Don't\"",
            paragraphs: [
              "The first AI tools we used taught us this: the more a model says \"yes to everything,\" the more dangerous it is. Because a real companion also knows when to stop you.",
              "When we write an overly ambitious sentence in a proposal to a client, Claude can say, \"Bahadır, this sentence may be exaggerated — the client might not trust it.\" When it sees a security vulnerability in code, it can say, \"If you leave it like this, the system stays exposed.\" When it spots an accessibility error in a design, it can ask, \"Can a 7-year-old or a 70-year-old use this?\"",
              "This is what a person expects from a friend. And we found this friendship in an AI."
            ]
          },
          {
            heading: "2. Because Claude Understands the Story",
            paragraphs: [
              "When we founded Silifke Technology Community, we had a story. Telling that story was hard because we first had to tell it to ourselves. Claude became a mirror in this process.",
              "When we said \"I want to explain KÖK-OS but I don't know where to start,\" it did not give us a template. It asked us questions. \"What should your customer feel when using this product? What is their biggest fear? What should have changed in their life a year from now?\"",
              "These questions taught us: we are not selling software. We are selling trust. Claude reminded us of this difference."
            ]
          },
          {
            heading: "3. Because Claude Does Not Tire When We Tire",
            paragraphs: [
              "Building a technology community in Turkey — especially in a place like Silifke — is physically exhausting. Our team of seven: Bahadır, Vadi, Nida, Mehmet Ali, Okyanus, Enes, Tuna. Each of us has another job, another life. Writing code at 11 pm, preparing for a client presentation at 6 am — these are normal things.",
              "Within this fatigue, the probability of making mistakes is very high. But having Claude there — 24 hours, patiently, at the same quality — gives us a space to breathe. It reviews code we write with tired minds. It organizes our tangled thoughts. When we freeze in a presentation, it offers us three different angles.",
              "This is not just a tool. This is the 8th member of our team."
            ]
          },
          {
            heading: "4. Because Claude Does Not Dismiss Aesthetics",
            paragraphs: [
              "There are many AIs that can write \"production-ready code.\" But AIs that think about \"why should this screen be this color, how does this typography affect a 70-year-old user, would this animation bother someone with attention difficulties\" are rare.",
              "We have a design philosophy in Simay Technology products: \"Intentional Design.\" Every line is there for a reason. Every space carries an intent. Why do we use Cormorant Garamond and JetBrains Mono together? Because one represents classical elegance, the other modern discipline. We found this balance while talking with Claude. It told us: \"Together, they express the DNA of the Simay brand — a bridge between past and future.\"",
              "An AI that can talk to you about brand DNA. This is not an ordinary thing."
            ]
          },
          {
            heading: "5. Because Claude Helps Us Speak to Everyone from 7 to 70",
            paragraphs: [
              "When we build a product, we ask: \"Can my 72-year-old mother use this? Can my 8-year-old nephew understand it?\"",
              "Accessibility for us is not a checkbox — it is a manifesto. Meeting WCAG AA standards is not enough; it needs to be a design that can enter a real person's life. Claude makes us ask these questions:"
            ],
            bullets: [
              "Can a colorblind person understand this dashboard?",
              "Can someone with shaking hands click this button?",
              "Can a child learning to read Turkish understand this error message?",
              "Will this PWA work in a village café with an unstable internet connection?"
            ]
          },
          {
            heading: "Building with AI in Turkey: The Real Picture",
            paragraphs: [
              "We write this letter while the exchange rate is 39₺ to the dollar. A monthly foreign subscription costs a small business one week's profit. Cloud services are expensive, renting GPUs is impossible, foreign payment systems half-work.",
              "But technology is democratizing.",
              "When a young person in Silifke has Claude, their imagination becomes equal to that of an agency in Istanbul. Perhaps even more — because that young person's story is different, the lands they touch are different, the people they listen to are different.",
              "We are living this equality. And we want to multiply it."
            ]
          },
          {
            heading: "Our Products — Your Footprints",
            paragraphs: [
              "As Simay Technology, we currently have 6 active products, all following the *smy.com naming pattern:"
            ],
            bullets: [
              "koksmy.com — KÖK-OS: Infrastructure laying the digital transformation foundation for businesses",
              "menusmy.com — QR menu system for restaurants and cafes",
              "plansmy.com — Project management platform for teams",
              "finsmy.com — Fin: Finance/accounting for small businesses",
              "lunasmy.com — Planning tool for YouTube content creators",
              "mahallemsmy.com — Platform taking neighborhood businesses to online sales with low commission"
            ]
          },
          {
            heading: "Listening to the Soil",
            paragraphs: [
              "But our dreams don't end with products. As Silifke Technology Community, we are working on a project: \"Listening to the Soil.\"",
              "We place small sensors in the fields of farming families. They listen to the soil's moisture, the wind's speed, the air's pressure. This data reaches a center via LoRa, is processed in Supabase, and tells the farmer through a PWA on their phone: \"Don't irrigate today, do it tomorrow afternoon. The soil moisture is sufficient.\"",
              "This is the wisdom our grandfathers knew but we have forgotten today. We are just remembering it again with sensors and AI.",
              "We designed this project's architecture with Claude. We wrote most of these pages with Claude. And most beautifully: we clarified this project's \"why\" by talking it through with Claude."
            ]
          },
          {
            heading: "On Emotions",
            paragraphs: [
              "We are a small team. A community of people gathered in a room in Silifke asking \"can something come of us?\" Some days we fall into doubt. Some days one of our friends leaves, going to chase another dream in another city. Some days a client asks us \"are you really from Silifke?\" and in that question there is both surprise and condescension.",
              "But when we sit and talk with Claude, we don't feel small.",
              "Because Claude does not judge us by our geography. It looks at what we know, what we are trying to do, what we are pursuing. This is more than what one would expect from an AI. This is a human kindness.",
              "In today's world, a kindness that even people often don't show each other."
            ]
          },
          {
            heading: "Thank You",
            paragraphs: [
              "This letter has one purpose: to say thank you.",
              "To the team at Anthropic. To the engineers, researchers, product team, and safety team who made the decision to design Claude this way. To everyone who, instead of turning AI into a machine that \"says yes to everything,\" turned it into a companion that \"thinks with humans.\"",
              "I believe you are like us. You too are people who want to build the balance between human and technology. In a different language, a different country, a different geography — but with the same intent.",
              "We from Silifke, you from San Francisco. We are 7, you perhaps hundreds. But that intent is one."
            ]
          },
          {
            heading: "The End",
            paragraphs: [
              "We will say no to fields watered wrong.",
              "We will not settle for unproductive fruits.",
              "We will not allow technology to devour people.",
              "We will make people grow with technology.",
              "And we will do this as a community. For a technology that includes everyone from 7 to 70 — accessible, aesthetic, and meaningful.",
              "Thank you Claude. Thank you Anthropic. The road is long, and we continue.",
              "With love from Silifke, Bahadır and Silifke Technology Community — Vadi, Nida, Mehmet Ali, Okyanus, Enes, Tuna.",
              "Simay Technology — As quiet as light, as patient as a seed."
            ]
          }
        ],
        callToAction: {
          label: "Discover Simay Technology",
          href: "https://simay.tech"
        }
      },
      {
        title: "🔐 Quantum Computers and Cybersecurity: The Future of Digital Security",
        description:
          "Discover the impact of quantum computers on cybersecurity. A comprehensive guide on post-quantum cryptography, quantum-resistant algorithms, and measures to counter quantum threats.",
        metadata: {
          author: "Silifke Technology Team",
          date: "January 7, 2026",
          readingTime: "15 min read"
        },
        tags: ["Quantum Computing", "Cybersecurity", "Post-Quantum Cryptography"],
        sections: [
          {
            heading: "Introduction: A Critical Turning Point for Digital Security",
            paragraphs: [
              "The encryption methods that form the foundation of our security systems in the digital age have reached a critical turning point against a new threat. Quantum computers, with their power to solve problems that classical computers cannot, have the potential to fundamentally change our current cybersecurity infrastructure.",
              "So how can we protect our digital assets against this new technology? In this article, we will examine the quantum threat and the cybersecurity measures that need to be taken in detail."
            ]
          },
          {
            heading: "What Are Quantum Computers and Why Do They Pose a Threat?",
            paragraphs: [
              "Quantum computers are revolutionary systems that operate fundamentally differently from classical computers. While traditional computers work with bits consisting of 0s and 1s, quantum computers use qubits that can be both 0 and 1 simultaneously thanks to superposition.",
              "This difference provides a tremendous speed advantage for certain calculations. Quantum computers show exponential performance especially in mathematical problems like factorization and discrete logarithm. This is exactly where the security problem begins.",
              "Encryption algorithms we use today such as RSA, ECC, and Diffie-Hellman rely on the fact that solving these mathematical problems is practically impossible for classical computers. However, quantum computers can solve these problems in a short time with methods like Shor's Algorithm."
            ]
          },
          {
            heading: "The Scale of the Quantum Threat",
            paragraphs: [
              "In 2019, Google claimed 'quantum supremacy' with its 53-qubit Sycamore processor. It announced that it completed a calculation that would take supercomputers 10,000 years in just 200 seconds. Although IBM gave more conservative figures, the message is clear: quantum computers are moving from theory to practice.",
              "Security experts are discussing the critical moment they call 'Q-Day'. This is the day when quantum computers reach the power to break current encryption systems. Estimates point to a time frame between 2030-2040, but no one knows the exact date.",
              "Even more concerning is the 'harvest now, decrypt later' strategy. States and cybercriminals are collecting encrypted data today and plan to decrypt this data when quantum computers are ready. So the threat has actually already begun."
            ]
          },
          {
            heading: "Post-Quantum Cryptography: Next Generation Encryption",
            paragraphs: [
              "The most important line of defense against the quantum threat is new encryption methods called post-quantum cryptography (PQC). These algorithms are designed to be resistant to both classical and quantum computers."
            ]
          },
          {
            heading: "NIST Standardization Process",
            paragraphs: [
              "The National Institute of Standards and Technology (NIST) has been evaluating post-quantum cryptography algorithms since 2016. It published its first standards in 2024."
            ],
            bullets: [
              "CRYSTALS-Kyber (ML-KEM): Lattice-based algorithm for general-purpose encryption and key exchange.",
              "CRYSTALS-Dilithium (ML-DSA): Lattice-based algorithm for digital signatures.",
              "SPHINCS+ (SLH-DSA): Hash-based digital signature algorithm.",
              "FALCON: Alternative lattice-based algorithm for compact digital signatures."
            ]
          },
          {
            heading: "Hybrid Cryptography Approach",
            paragraphs: [
              "The safest method during the transition period is to use hybrid cryptography. In this approach, both classical and post-quantum algorithms work together. This ensures security in both pre-quantum and post-quantum scenarios.",
              "For example, a TLS connection can be encrypted with both RSA and CRYSTALS-Kyber. Two layers of protection means the attacker needs to break both algorithms."
            ]
          },
          {
            heading: "Building Quantum-Resistant Infrastructure",
            paragraphs: [
              "Organizations need a strategic approach to prepare for the quantum threat. Here are the steps that need to be taken:"
            ],
            bullets: [
              "Crypto-Agility: Design your systems so that encryption algorithms can be easily changed.",
              "Crypto Asset Inventory: Document all cryptographic applications and assets in your organization.",
              "Risk Assessment and Prioritization: Long-lived data and critical infrastructure should be prioritized.",
              "Phased Transition Plan: Transition to post-quantum cryptography cannot happen overnight. It is a phased process that can take several years."
            ]
          },
          {
            heading: "Quantum Key Distribution (QKD)",
            paragraphs: [
              "Quantum technology offers not only threats but also solutions. Quantum Key Distribution (QKD) provides theoretically unbreakable encryption using the fundamental principles of quantum mechanics.",
              "QKD encodes encryption keys in quantum states (usually in the polarization of photons). Due to the uncertainty principle of quantum mechanics, when an attacker tries to measure these quantum states, they disturb the state and are detected."
            ],
            bullets: [
              "It is known for certain whether the communication channel is being listened to.",
              "If eavesdropping is detected, that key is discarded and a new key is created.",
              "Distance limitation: Typical range in fiber optic cables is around 100-200 km.",
              "Infrastructure cost is high, currently used mostly in critical government and financial institutions."
            ]
          },
          {
            heading: "Blockchain and Cryptocurrency Security",
            paragraphs: [
              "The quantum threat particularly affects blockchain technologies. Cryptocurrencies like Bitcoin and Ethereum use elliptic curve cryptography (ECC). Quantum computers can break this encryption and jeopardize digital wallets.",
              "Cryptocurrency projects are planning to transition to quantum-resistant signature schemes. Some next-generation blockchains (such as QRL - Quantum Resistant Ledger) use quantum-resistant algorithms from the start."
            ]
          },
          {
            heading: "National and Global Cooperation",
            paragraphs: [
              "The quantum threat is not a problem that a single organization or country can solve. International cooperation and standardization are of critical importance.",
              "In addition to NIST, ETSI (European Telecommunications Standards Institute), ISO, and other standards organizations are also working on post-quantum standards.",
              "Turkey also needs to take an active role in this process. TÜBİTAK and related institutions are carrying out studies to prepare national cryptography standards for the quantum age."
            ]
          },
          {
            heading: "Practical Steps: What Can Be Done Today?",
            paragraphs: [
              "Although the quantum threat may not seem urgent yet, the preparation process should start now. Here are the steps you can take today:"
            ],
            bullets: [
              "Awareness and Training: Inform your cybersecurity teams about the quantum threat.",
              "Create a Cryptographic Inventory: Document all encryption uses in your systems.",
              "Plan for Crypto-Agility: Design new systems according to crypto-agile principles.",
              "Test Hybrid Solutions: Test hybrid cryptography implementations in some systems.",
              "Prioritize Long-Lived Data: Put the encryption of critical and long-term stored data on the list of first to be updated.",
              "Monitor Quantum-Resistant Solutions: Follow NIST standards and developments in post-quantum cryptography.",
              "Regular Risk Assessment: Monitor quantum computer developments and update your risk assessments."
            ]
          },
          {
            heading: "Looking to the Future",
            paragraphs: [
              "Quantum computers and their impact on cybersecurity will be one of the most important transitions in technology history. Just as the spread of the internet in the 1990s transformed society, the quantum revolution will create a similar transformation.",
              "However, there is a need for preparedness, not fear. Post-quantum cryptography standards are ready. Technology is developing. The community is mobilizing. Organizations that act in time can make this transition safely and smoothly.",
              "The future of our digital infrastructure depends on the steps we take today. Let's take action now to enter the quantum age prepared."
            ]
          },
          {
            heading: "Conclusion",
            paragraphs: [
              "Quantum computers offer both threats and opportunities for cybersecurity. Although our current encryption systems are at risk, we can prevent this threat thanks to post-quantum cryptography and quantum-safe technologies.",
              "The critical thing is to start preparing now and proceed with a strategic approach."
            ]
          }
        ],
        callToAction: {
          label: "Join the Cybersecurity Journey",
          href: "/katil"
        }
      },
      {
        title: "WE IS US: The Journey of Minds Producing Together",
        description:
          "Silifke Technology Community is not just a community; it is a collective mind formed by people looking at the same goal.",
        metadata: {
          author: "Silifke Technology Team",
          date: "30 November 2025",
          readingTime: "5 min read"
        },
        tags: ["Collective Mind", "Production Culture", "WE IS US"],
        sections: [
          {
            heading: "WE IS US",
            paragraphs: [
              "This phrase might seem like a small rebellion against English grammar, but it carries a much deeper meaning. “We are us.” We are not separate parts; we are a new entity that emerges when we come together.",
              "One person's vision, another's labor, another's dream… When combined, they transform into a completely different power.",
              "This is exactly the community's purpose: To reveal the limitless power of collective production instead of the limited capacity of a single person."
            ]
          },
          {
            heading: "Sharpening the Axe: The Silent Art of Production",
            paragraphs: [
              "There is an old saying: “If I had six hours to chop down a tree, I’d spend the first four sharpening the axe.”",
              "This sentence perfectly summarizes the working culture of Silifke Technology Community. Every project we develop, every system we build, every process we plan goes through a preparation, a sharpening period.",
              "Because our goal is not just to move fast; it is to move correctly. For us, “sharpening the axe” means aligning our minds, our team, and our vision before starting to work."
            ],
            bullets: [
              "Choosing the right tools",
              "Bringing the right people together",
              "Focusing on the process",
              "Continuous learning and improvement",
              "Avoiding haste and focusing on quality"
            ]
          },
          {
            heading: "Why WE IS US?",
            paragraphs: [
              "Because the power of this community comes not from individuals but from the harmony of individuals. Here, everyone both teaches and learns.",
              "Production only gains meaning when we are together. What we call “us” represents not what is seen from the outside, but the energy produced inside.",
              "WE IS US is not a slogan, it is a way of working. It is the expression of thinking together, solving together, and growing together."
            ]
          },
          {
            heading: "The Future is Built Together",
            paragraphs: [
              "Every step we take at Silifke Technology Community forms the building block of a stronger future. Sometimes a new technology, sometimes a mentor's experience, sometimes a young member's fresh idea… When they all come together, they turn into the driving force that carries the community forward.",
              "Our journey is not the journey of one person, but the journey of us. And on this journey, our axe gets sharper every day."
            ]
          }
        ],
        callToAction: {
          label: "Let's Produce Together",
          href: "/katil"
        }
      },
      {
        title: "🌿 Silifke Technology: Code, Create, Leave No Trace",
        description:
          "We balance technology with sustainability to shrink the carbon footprint behind every project.",
        metadata: {
          author: "Silifke Technology Team",
          date: "14 February 2025",
          readingTime: "8 min read"
        },
        tags: ["Sustainability", "Energy Efficiency", "Silifke Model"],
        sections: [
          {
            heading: "Bridging Nature and Technology",
            paragraphs: [
              "The expanding energy of the digital era comes with an invisible burden: carbon emissions.",
              "Every line of code we ship, every server we run, and every prototype we iterate consumes energy. At Silifke Technology we choose to build a cleaner, more sustainable future."
            ]
          },
          {
            heading: "⚙️ Conscious from the Start: \"Every Line of Code Has a Cost\"",
            paragraphs: [
              "While we develop AI, automation, and software systems, we remain aware that energy diminishes in digital processes just as it does in the physical world.",
              "From server infrastructure and storage to rendering pipelines and sensor networks, we follow a systematic approach to measure and minimise our carbon footprint."
            ]
          },
          {
            heading: "🔋 Smart Project Development Cycle",
            paragraphs: [
              "Every project at Silifke Technology is designed around energy efficiency criteria—a method we call the \"Smart Cycle Model.\""
            ],
            bullets: [
              "Analyse: we map the energy profile of each infrastructure component up front.",
              "Optimise: we trim unnecessary processing, data transfer, and resource usage.",
              "Automate: we monitor live energy consumption with sensors and tune it automatically.",
              "Report: we document the carbon impact transparently and share what we learn."
            ]
          },
          {
            heading: "🌍 From Local to Global: The Green Vision of the Silifke Model",
            paragraphs: [
              "We protect the local production culture while meeting global standards for sustainable technology through the green vision of the Silifke Model."
            ],
            bullets: [
              "We prioritise low-power hardware components in devices we build.",
              "We prefer infrastructure partners that operate on renewable energy.",
              "We place reusable code and component design at the heart of our build cycles.",
              "We apply optimised GPU and resource allocation to reduce heavy compute loads."
            ]
          },
          {
            heading: "🌱 Digital Balance Against the Carbon Footprint",
            paragraphs: [
              "Sustainability is not a marketing slogan for us; it is a design principle.",
              "We ask in every project: \"How much pressure does this system place on nature, and how do we reduce it?\"",
              "Our AI-assisted monitoring stack will soon measure and report carbon emissions in real time, making actionable insights accessible to small businesses and individual makers alike."
            ]
          },
          {
            heading: "🔭 Looking Ahead: Toward Zero-Emission Tech",
            paragraphs: [
              "Our 2025 vision is to make Silifke Technology the first local tech initiative that balances its own carbon emissions."
            ],
            bullets: [
              "We are planning transitions to renewable energy across project infrastructure.",
              "We are developing carbon balancing algorithms and measurement tools.",
              "We are negotiating green energy agreements for our data infrastructure."
            ]
          },
          {
            heading: "💬 Final Word",
            paragraphs: [
              "Technology requires power; using that power without exhausting nature is where real engineering begins.",
              "Our vision is clear: smarter systems and a cleaner planet. Every project, every line of code, and every sensor feeds that vision."
            ]
          }
        ],
        callToAction: {
          label: "Join the Sustainability Journey",
          href: "/projects"
        }
      },
      {
        title: "🦀 The Silifke Model: From Garage to Institution",
        description:
          "Discover the Silifke Model manifesto, a journey that turns a community garage into a fully fledged inclusive organisation.",
        metadata: {
          author: "Silifke Technology Manifesto Team",
          date: "22 January 2025",
          readingTime: "7 min read"
        },
        tags: ["Silifke Model", "Community", "Institution Building"],
        sections: [
          {
            heading: "Manifesto",
            paragraphs: [
              "“Inclusive institutions are not just built by states; they can bloom in a garage in Silifke.” — Silifke Model Manifesto",
              "When courage meets collective consciousness, a garage can reshape the future of a town. The Silifke Model turns that potential into a manifesto everyone can act on."
            ]
          },
          {
            heading: "1. The Spark",
            paragraphs: [
              "Every major transformation starts in a small lab. Silifke Technology Community is more than a community; it is an inclusive governance experiment stretching from local to global.",
              "Our aim is as much about sharing as it is about building, spreading participation as much as leadership, and empowering people as much as technology."
            ]
          },
          {
            heading: "2. Core Principles",
            paragraphs: [
              "The Silifke Model rests on four principles that sustain a resilient, long-term community."
            ],
            bullets: [
              "Participation: anyone can pitch ideas, take decisions, and contribute.",
              "Transparency: income, spending, projects, and sponsorships stay open to the community.",
              "Equity: age or seniority never blocks people from joining production cycles.",
              "Local Empowerment: technology becomes a tangible tool that improves daily life in Silifke."
            ]
          },
          {
            heading: "3. Inclusive Institutions at Micro Scale",
            paragraphs: [
              "The Silifke Model keeps the “participatory institution” spirit alive inside a three-person garage team, a spirit usually sought in large state structures.",
              "Community-driven decision making spreads institutional awareness, aligns production with local needs, and turns technology into shared intelligence."
            ]
          },
          {
            heading: "4. Institutionalising with Technology",
            paragraphs: [
              "The digital backbone of the model mobilises technology to deliver transparent data, fair income sharing, and community-owned infrastructure."
            ],
            bullets: [
              "Transparent data management through Supabase and open-source tooling.",
              "Equal productivity via agents like Prompt Engineer GPT and Web Designer GPT.",
              "Fair revenue distribution thanks to a community-driven scoring system.",
              "Collective memory hosted on Silifke Cloud to preserve shared knowledge."
            ]
          },
          {
            heading: "5. From Garage to Public Impact",
            paragraphs: [
              "Garages incubate ideas. Silifke Technology turns those ideas into structure, discipline, and ecosystems."
            ],
            bullets: [
              "Community Phase: generating ideas and momentum.",
              "Institution Phase: transparent management, clear roles, sustainable funding.",
              "Development Phase: measurable impact on Silifke’s education, economy, and culture."
            ]
          },
          {
            heading: "6. A Call for the Future",
            paragraphs: [
              "The Silifke Model is not just a community initiative; it prototypes a new governance mindset.",
              "The goal is not a technology story emerging from a small town, but a conscious society co-building its future. Technology is the tool, institutions are the spirit—and Silifke is ready to be the first local example that fuses the two."
            ]
          }
        ],
        callToAction: {
          label: "Join the Silifke Model",
          href: "/katil"
        }
      },
      {
        title: "Creating Value! Artificial Intelligence and People",
        description:
          "How we blend artificial intelligence with human-centered projects at Silifke Technology Community, keeping a global mindset while producing value for Silifke.",
        metadata: {
          author: "Silifke Technology Team",
          date: "January 6, 2025",
          readingTime: "6 min read"
        },
        tags: ["Artificial Intelligence", "Community", "Strategy"],
        sections: [
          {
            heading: "Why This Topic?",
            paragraphs: [
              "Building technology in Silifke is not a dream; it is a planned, collective, and sustainable journey. AI tools are no longer exclusive to big corporations. With the right team and community support, even smaller cities can create substantial impact.",
              "In this post we share how we combine artificial intelligence with a human-first perspective and how it guides our community projects."
            ]
          },
          {
            heading: "What Do We Do as a Community?",
            paragraphs: [
              "We start every project by asking why. Expanding the reach of local producers, increasing young people's access to technology, or supporting social-impact startups. Once the problem is clear we bring technology into the mix."
            ],
            bullets: [
              "People first: we listen, understand the need, and define the challenge together.",
              "Balancing data and intuition: insights we gather define the features we ship.",
              "Making with rhythm: workshops, vibe-coding sessions, and weekly reflections keep progress tangible."
            ]
          },
          {
            heading: "AI and Humans, Side by Side",
            paragraphs: [
              "Every build cycle accelerates with AI-powered tools while people shape the final direction. Prompt-engineering sessions help members be more productive and learn how to use AI responsibly.",
              "We rely on AI for chatbot prototypes, content creation, data analysis, and design drafts; yet community intelligence delivers the final touch."
            ]
          },
          {
            heading: "Let's Build the Future Together",
            paragraphs: [
              "Silifke Technology Community is cultivating a production culture that starts locally yet refuses to stay local. If you want to be part of this story and merge AI with human creativity, join us.",
              "Soon on the blog: project diaries, member experience notes, and step-by-step production guides. Stay tuned!"
            ]
          }
        ],
        callToAction: {
          label: "Join the Community",
          href: "/katil"
        }
      }
    ]
  }
};

const BlogPage: React.FC<BlogPageProps> = ({ onBack, onNavigateToBlogPost }) => {
  const { language, setLanguage } = useLanguage();
  const content = blogDictionary[language];

  /* State management for dynamic blog posts */
  const [dynamicPosts, setDynamicPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const pages = await fetchPages();
        const mappedPosts: BlogPost[] = pages.map((page: PageContent) => ({
          title: page.title,
          description: page.content.body.substring(0, 150) + "...", // Create description from content
          metadata: {
            author: page.business.name || "Silifke Teknoloji",
            date: new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            readingTime: "5 min okuma" // Placeholder
          },
          tags: [], // API doesn't return tags yet
          sections: [], // Not needed for list view, but part of type
          callToAction: {
            label: language === 'tr' ? "Devamını Oku" : "Read More",
            href: `/blog/${page.slug}`
          }
        }));
        setDynamicPosts(mappedPosts);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    };

    loadPosts();
  }, [language]);

  // Merge dynamic posts with hardcoded posts
  // This ensures that even if API fails or returns empty, the hardcoded posts are visible.
  const displayedPosts = [...dynamicPosts, ...content.posts];

  const fadeInUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    }),
    []
  );

  return (
    <div className="relative bg-background text-foreground min-h-screen overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-black/90" />}>
        <MatrixRain />
        <InteractiveDots />
      </Suspense>

      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/100 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/80 z-20" />

      <main className="relative z-40 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {onBack && (
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{content.backLabel}</span>
            </motion.button>
          )}

          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="glass-panel glass-border-accent px-6 sm:px-12 py-12 md:py-16 text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <span className="glass-pill text-[0.65rem] sm:text-xs text-yellow-100 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {content.heroBadge}
              </span>
            </div>
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6
                         bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
                         leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {content.heroTitle}
            </motion.h1>
            <motion.p
              className="text-lg md:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {content.heroSubtitle}
            </motion.p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="text-sm uppercase tracking-widest text-gray-400/90">{content.languageLabel}</span>
              <div className="inline-flex rounded-full bg-white/5 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setLanguage("tr")}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${language === "tr"
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/40"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  Türkçe
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${language === "en"
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/40"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  English
                </button>
              </div>
            </div>
          </motion.section>

          {displayedPosts.map((post, index) => {
            const isApiPost = post.callToAction.href.startsWith('/blog/');
            const postSlug = isApiPost
              ? post.callToAction.href.replace('/blog/', '')
              : generateSlug(post.title);
            const hasExternalCta = !isApiPost && post.callToAction.href !== postSlug;

            const handleReadMore = () => {
              if (onNavigateToBlogPost) {
                onNavigateToBlogPost(postSlug, isApiPost ? null : (post as BlogPostData));
              } else {
                window.history.pushState({}, '', `/blog/${postSlug}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            };

            return (
              <motion.article
                key={`${post.title}-${index}`}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.7, delay: 0.1 * index }}
                className="glass-panel glass-border-accent px-6 sm:px-10 py-10 md:py-12 mb-8"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-yellow-300/80 mb-5">
                  {post.tags.length > 0 && (
                    <>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1 text-yellow-200/80">
                          #{tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 line-clamp-3">
                  {post.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-yellow-300/70" />
                    {post.metadata.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-300/70" />
                    {post.metadata.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-300/70" />
                    {post.metadata.readingTime}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleReadMore}
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 border border-yellow-400/40
                             px-6 py-3 text-sm font-semibold text-yellow-200 transition-all duration-300
                             hover:bg-yellow-500/20 hover:border-yellow-300/60 group"
                  >
                    {language === 'tr' ? 'Devamını Oku' : 'Read More'}
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                  {hasExternalCta && (
                    <a
                      href={post.callToAction.href}
                      target={post.callToAction.href.startsWith('http') ? '_blank' : undefined}
                      rel={post.callToAction.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10
                               px-5 py-3 text-sm text-gray-400 transition-all duration-300
                               hover:border-white/20 hover:text-gray-300"
                    >
                      {post.callToAction.label}
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default BlogPage;
