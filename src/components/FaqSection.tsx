import React from "react";
import { motion } from "framer-motion";

type FaqSectionProps = {
  isTR: boolean;
};

type FaqItem = {
  id: string;
  emoji: string;
  title: string;
  answer: React.ReactNode;
};

const paragraphClass =
  "text-left text-sm sm:text-base leading-relaxed text-gray-200";
const listClass =
  "text-left text-sm sm:text-base leading-relaxed text-gray-200";

const getFaqItems = (isTR: boolean): FaqItem[] => {
  if (isTR) {
    return [
      {
        id: "faq-1",
        emoji: "👥",
        title: "1. Kimler katılabilir?",
        answer: (
          <>
            <p className={paragraphClass}>
              Silifke Teknoloji Topluluğu’na 18–38 yaş arası, teknolojiye ve
              üretmeye meraklı herkes katılabilir. Eğitim veya meslek farkı
              gözetilmez; önemli olan öğrenmeye ve üretmeye istekli olmaktır.
            </p>
          </>
        ),
      },
      {
        id: "faq-2",
        emoji: "💰",
        title: "2. Ücretli mi?",
        answer: (
          <>
            <p className={paragraphClass}>
              Hayır, topluluk tamamen ücretsizdir. Hiçbir üyelik, eğitim veya
              katılım ücreti alınmaz.
            </p>
            <p className={paragraphClass}>
              Aksine, topluluk içinde geliştirilen projelerden gelir elde etme
              imkânı vardır. Katkı sağlayan her üye, proje gelirlerinden pay
              alır.
            </p>
          </>
        ),
      },
      {
        id: "faq-3",
        emoji: "🚀",
        title: "3. Hangi alanlarda eğitim veriliyor?",
        answer: (
          <>
            <p className={paragraphClass}>
              Topluluğumuzda “Vibe Coding” yöntemiyle uygulamalı, yapay zekâ
              destekli üretim odaklı eğitimler verilir. Eğitim başlıklarımız:
            </p>
            <ul
              className={`${listClass} mt-3 list-disc space-y-2 pl-6 marker:text-yellow-300`}
            >
              <li>Web geliştirme (React, Supabase, otomasyon sistemleri)</li>
              <li>Yapay zekâ uygulamaları ve üretken yapay zekâ araçları</li>
              <li>Girişimcilik, marka ve içerik üretimi</li>
              <li>Dijital tasarım, medya, 3D modelleme</li>
              <li>Yerel işletmelere yönelik teknoloji çözümleri</li>
            </ul>
          </>
        ),
      },
      {
        id: "faq-4",
        emoji: "💡",
        title: "4. Vibe Coding nedir?",
        answer: (
          <>
            <p className={paragraphClass}>
              Vibe Coding, klasik kodlama eğitiminden farklı olarak hayal gücü,
              sezgi ve yapay zekâyı birleştirir. Katılımcılar kahvesini içerken,
              müzik eşliğinde bile fikirlerini AI destekli araçlarla gerçeğe
              dönüştürebilir.
            </p>
            <p className={paragraphClass}>
              Amaç sadece kod yazmak değil; fikirden ürüne giden sezgisel bir
              süreç inşa etmektir.
            </p>
          </>
        ),
      },
      {
        id: "faq-5",
        emoji: "📍",
        title: "5. Nerede bulunuyorsunuz?",
        answer: (
          <>
            <p className={paragraphClass}>
              Silifke Teknoloji Topluluğu’nun merkezi Silifke / Mersin’dedir. Tüm
              ana toplantılar ve üretim süreçleri Silifke’de fiziksel olarak
              yürütülür.
            </p>
            <p className={paragraphClass}>
              Çünkü amacımız sadece dijital üretim değil, Silifke’de fiziksel
              değer ve topluluk oluşturmak. Bazı projelerde uzaktan katılım
              mümkündür, fakat öncelik daima Silifke’de aktif olarak
              bulunabilen üyelere verilir.
            </p>
          </>
        ),
      },
      {
        id: "faq-6",
        emoji: "🧠",
        title: "6. Katılmak için teknik bilgi gerekir mi?",
        answer: (
          <>
            <p className={paragraphClass}>
              Hayır. Topluluğumuzda hem başlangıç hem ileri seviye için özel eğitim
              programları vardır. AI destekli araçlar sayesinde herkes kendi
              seviyesine göre hızla ilerleyebilir.
            </p>
            <p className={paragraphClass}>
              Yeter ki üretmek ve öğrenmek iste.
            </p>
          </>
        ),
      },
      {
        id: "faq-7",
        emoji: "💼",
        title: "7. Gelir paylaşımı nasıl sağlanıyor?",
        answer: (
          <>
            <p className={paragraphClass}>
              Topluluk içerisinde geliştirilen projeler (örneğin web siteleri,
              otomasyon sistemleri, medya üretimleri vb.) gelir elde ettiğinde,
              bu gelir katkı oranına göre üyeler arasında paylaştırılır.
            </p>
            <p className={paragraphClass}>
              Bu sistem, üyelerin hem öğrenerek deneyim kazanmasını hem de
              ürettikçe kazanç elde etmesini sağlar.
            </p>
          </>
        ),
      },
      {
        id: "faq-8",
        emoji: "🕓",
        title: "8. Toplantılar ne sıklıkta yapılıyor?",
        answer: (
          <>
            <p className={paragraphClass}>
              Toplantılar genellikle haftalık olarak Silifke’de fiziksel
              yapılır.
            </p>
            <p className={paragraphClass}>
              Ek olarak bazı çevrim içi toplantılar proje koordinasyonu için
              düzenlenebilir. Her katılımcıya toplantı takvimi düzenli olarak
              iletilir.
            </p>
          </>
        ),
      },
      {
        id: "faq-9",
        emoji: "🧩",
        title: "9. Üyelik süreci nasıl işliyor?",
        answer: (
          <>
            <p className={paragraphClass}>
              Silifke Teknoloji Topluluğu’na katılım süreci dört aşamadan oluşur:
            </p>
            <ol
              className={`${listClass} mt-4 list-decimal space-y-3 pl-6 marker:text-yellow-300`}
            >
              <li>
                <strong>Başvuru:</strong>{" "}
                <span>
                  <span aria-hidden="true" className="mr-1">
                    👉
                  </span>
                  <a
                    href="https://silifketeknoloji.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-yellow-200 underline-offset-4 hover:underline"
                  >
                    silifketeknoloji.org
                  </a>{" "}
                  adresindeki formu doldurarak başvurunu yaparsın. Formda ilgi
                  alanlarını (örneğin yazılım, tasarım, otomasyon, yapay zekâ
                  vb.) belirtmen değerlendirme için önemlidir.
                </span>
              </li>
              <li>
                <strong>Ekip değerlendirmesi:</strong>{" "}
                Başvurun ekibimiz tarafından incelenir. Hangi alanda katkı
                sağlayabileceğin ve hangi ekibe uygun olduğun belirlenir.
              </li>
              <li>
                <strong>Tanışma toplantısı:</strong>{" "}
                Uygun görülen adaylara kısa bir tanışma / yönlendirme toplantısı
                için tarih belirlenir. Bu toplantı genellikle Silifke’de fiziksel
                olarak yapılır. Burada topluluk yapısı, üretim süreci ve seni en iyi
                yansıtacak alan konuşulur.
              </li>
              <li>
                <strong>Üretim süreci (onay sonrası):</strong>{" "}
                Toplantı sonrası başvurun onaylandığında aktif üyeliğin başlar.
                Seni uygun bir proje ekibine dahil ederiz ve gerçek üretim
                süreci başlar. Artık fikirlerini hayata geçirir, projelerden
                gelir elde etmeye adım atarsın.
              </li>
            </ol>
          </>
        ),
      },
      {
        id: "faq-10",
        emoji: "🌍",
        title: "10. Topluluğun vizyonu nedir?",
        answer: (
          <>
            <p className={paragraphClass}>Bizim vizyonumuz:</p>
            <blockquote className="mt-3 border-l-4 border-yellow-400/60 pl-4 text-left text-base sm:text-lg leading-relaxed text-gray-100 italic">
              “İleri görüşlü bir bakış açısı benimseyip, güçlü fikirleri kolayca
              paylaşmak — Silifke’den başlayarak yerelde değer üreten, gençleri
              teknolojiyle birleştiren bir ekosistem kurmak.”
            </blockquote>
            <p className={`${paragraphClass} mt-4`}>
              Silifke Teknoloji Topluluğu, sadece bir topluluk değil; yerel
              işletmelerin dijitalleştiği, gençlerin fikirlerini girişime
              dönüştürdüğü ve Silifke’nin Türkiye’nin teknoloji sahnesinde örnek
              bir model hâline geldiği bir platformdur.
            </p>
          </>
        ),
      },
      {
        id: "faq-11",
        emoji: "📲",
        title: "11. Nasıl başvurabilirim?",
        answer: (
          <>
            <p className={paragraphClass}>
              <span aria-hidden="true" className="mr-1">
                👉
              </span>
              <a
                href="https://silifketeknoloji.org"
                target="_blank"
                rel="noreferrer"
                className="text-yellow-200 underline-offset-4 hover:underline"
              >
                silifketeknoloji.org
              </a>{" "}
              adresindeki başvuru formunu doldurman yeterli. Ekibimiz kısa süre
              içinde seninle iletişime geçer ve tanışma süreci başlar.
            </p>
          </>
        ),
      },
      {
        id: "faq-12",
        emoji: "🦀",
        title: `12. Topluluğun simgesindeki “Yengeç” neyi temsil ediyor?`,
        answer: (
          <>
            <p className={paragraphClass}>
              Yengeç, Silifke’nin Akdeniz’le olan bağını ve topluluğun dayanıklı,
              yaratıcı, çok yönlü yapısını temsil eder. Teknoloji kabuğuyla
              donatılmış bu simge, “yerelden doğan küresel vizyonu” anlatır — tıpkı
              Silifke Teknoloji’nin hedefi gibi.
            </p>
          </>
        ),
      },
      {
        id: "faq-13",
        emoji: "🎯",
        title: "13. Katılımcılardan ne bekleniyor?",
        answer: (
          <>
            <p className={paragraphClass}>
              Silifke Teknoloji bir okul değil; üreten bir topluluktur. Bu yüzden
              katılımcılardan şunları bekliyoruz:
            </p>
            <ul
              className={`${listClass} mt-3 list-disc space-y-2 pl-6 marker:text-yellow-300`}
            >
              <li>Toplantılara düzenli katılım</li>
              <li>Ekip içinde sorumluluk alma</li>
              <li>Üretim kültürüne katkı sağlama</li>
              <li>İş birliği ve paylaşım ruhuna sahip olma</li>
            </ul>
          </>
        ),
      },
      {
        id: "faq-14",
        emoji: "💬",
        title: "14. Toplulukta ne tür projeler üretiliyor?",
        answer: (
          <>
            <p className={paragraphClass}>Ürettiğimiz proje örnekleri:</p>
            <ul
              className={`${listClass} mt-3 list-disc space-y-2 pl-6 marker:text-yellow-300`}
            >
              <li>Yerel işletmelere otomasyon çözümleri</li>
              <li>Web &amp; mobil uygulamalar</li>
              <li>Yapay zekâ tabanlı mini araçlar</li>
              <li>Sosyal medya içerikleri ve tanıtım kampanyaları</li>
              <li>Mahallefy, Simay Teknoloji ve diğer yerel girişimlerle ortak projeler</li>
            </ul>
          </>
        ),
      },
      {
        id: "faq-15",
        emoji: "🔗",
        title: "15. İş birliği yapmak istiyorum, mümkün mü?",
        answer: (
          <>
            <p className={paragraphClass}>
              Elbette! Topluluğumuz, yerel işletmeler, okullar ve teknoloji
              girişimleriyle ortak projeler geliştirmektedir.
            </p>
            <p className={paragraphClass}>
              İş birliği teklifleri için:{" "}
              <a
                href="mailto:info@silifketeknoloji.org"
                className="text-yellow-200 underline-offset-4 hover:underline"
              >
                info@silifketeknoloji.org
              </a>
            </p>
          </>
        ),
      },
      {
        id: "faq-16",
        emoji: "❤️",
        title: "16. Silifke Teknoloji neden kuruldu?",
        answer: (
          <>
            <p className={paragraphClass}>
              Çünkü biz inanıyoruz ki, teknoloji büyük şehirlerde değil, büyük
              fikirlerde başlar. Silifke Teknoloji; yereldeki potansiyeli, üretim
              ve yenilik gücüyle dünyaya taşımak için kuruldu.
            </p>
            <p className={paragraphClass}>
              Bu topluluk, Silifke’den yükselen bir ilham modeli olmayı hedefliyor.
            </p>
          </>
        ),
      },
    ];
  }

  return [
    {
      id: "faq-1",
      emoji: "👥",
      title: "1. Who can join?",
      answer: (
        <>
          <p className={paragraphClass}>
            Anyone aged 18–38 who is curious about technology and making things
            can join Silifke Technology Community. Education or profession does
            not matter; the only requirement is the desire to learn and build.
          </p>
        </>
      ),
    },
    {
      id: "faq-2",
      emoji: "💰",
      title: "2. Is there a fee?",
      answer: (
        <>
          <p className={paragraphClass}>
            No, the community is completely free. We do not charge any membership,
            training, or participation fees.
          </p>
          <p className={paragraphClass}>
            On the contrary, there is an opportunity to earn income from
            projects developed within the community. Every contributing member gets a
            share of the project revenue.
          </p>
        </>
      ),
    },
    {
      id: "faq-3",
      emoji: "🚀",
      title: "3. Which topics do you cover?",
      answer: (
        <>
          <p className={paragraphClass}>
            We run hands-on, AI-assisted, production-oriented sessions through
            the “Vibe Coding” approach. Our training topics include:
          </p>
          <ul
            className={`${listClass} mt-3 list-disc space-y-2 pl-6 marker:text-yellow-300`}
          >
            <li>Web development (React, Supabase, automation systems)</li>
            <li>AI applications and generative AI tools</li>
            <li>Entrepreneurship, branding, and content creation</li>
            <li>Digital design, media, and 3D modeling</li>
            <li>Technology solutions for local businesses</li>
          </ul>
        </>
      ),
    },
    {
      id: "faq-4",
      emoji: "💡",
      title: "4. What is Vibe Coding?",
      answer: (
        <>
          <p className={paragraphClass}>
            Vibe Coding blends imagination, intuition, and AI. Participants can
            sip their coffee, enjoy music, and still turn ideas into reality
            using AI-powered tools.
          </p>
          <p className={paragraphClass}>
            The goal is not only to write code; it is to build an intuitive path
            from idea to product.
          </p>
        </>
      ),
    },
    {
      id: "faq-5",
      emoji: "📍",
      title: "5. Where are you located?",
      answer: (
        <>
          <p className={paragraphClass}>
            Silifke Technology Community is headquartered in Silifke, Mersin. All
            main meetings and production processes are carried out physically in
            Silifke.
          </p>
          <p className={paragraphClass}>
            Our aim is to create not only digital output but also a physical
            community and value in Silifke. Some projects allow remote
            participation, yet priority goes to members who can stay active on
            site.
          </p>
        </>
      ),
    },
    {
      id: "faq-6",
      emoji: "🧠",
      title: "6. Do I need technical knowledge?",
      answer: (
        <>
          <p className={paragraphClass}>
            No. We offer dedicated programs for both beginners and advanced
            members. With the help of AI-supported tools, everyone can progress
            quickly at their own pace.
          </p>
          <p className={paragraphClass}>
            All you need is the motivation to build and learn.
          </p>
        </>
      ),
    },
    {
      id: "faq-7",
      emoji: "💼",
      title: "7. How does revenue sharing work?",
      answer: (
        <>
          <p className={paragraphClass}>
            When projects developed inside the community (websites, automation
            systems, media productions, etc.) generate income, the revenue is
            distributed among members based on their contribution.
          </p>
          <p className={paragraphClass}>
            This model helps members gain experience while getting paid as they
            create.
          </p>
        </>
      ),
    },
    {
      id: "faq-8",
      emoji: "🕓",
      title: "8. How often do you meet?",
      answer: (
        <>
          <p className={paragraphClass}>
            Meetings usually take place weekly in Silifke.
          </p>
          <p className={paragraphClass}>
            Additional online sessions may be organized for project
            coordination, and the calendar is shared with every participant on a
            regular basis.
          </p>
        </>
      ),
    },
    {
      id: "faq-9",
      emoji: "🧩",
      title: "9. How does the membership process work?",
      answer: (
        <>
          <p className={paragraphClass}>
            Joining Silifke Technology Community consists of four stages:
          </p>
          <ol
            className={`${listClass} mt-4 list-decimal space-y-3 pl-6 marker:text-yellow-300`}
          >
            <li>
              <strong>Application:</strong>{" "}
              <span>
                <span aria-hidden="true" className="mr-1">
                  👉
                </span>
                <a
                  href="https://silifketeknoloji.org"
                  target="_blank"
                  rel="noreferrer"
                  className="text-yellow-200 underline-offset-4 hover:underline"
                >
                  silifketeknoloji.org
                </a>{" "}
                Fill out the form and highlight your interests (software, design,
                automation, AI, etc.) so we can evaluate you properly.
              </span>
            </li>
            <li>
              <strong>Team evaluation:</strong> Our team reviews your
              application, identifies where you can contribute, and the squad
              that fits you best.
            </li>
            <li>
              <strong>Orientation meeting:</strong> Selected candidates receive
              an invitation for a short intro meeting, usually held physically in
              Silifke. We explain the community structure, production process, and the
              roles that match you.
            </li>
            <li>
              <strong>Production phase (after approval):</strong> Once approved,
              your active membership starts. You join a project team, turn ideas
              into products, and step into revenue-sharing projects.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "faq-10",
      emoji: "🌍",
      title: "10. What is the community’s vision?",
      answer: (
        <>
          <p className={paragraphClass}>Our vision is:</p>
          <blockquote className="mt-3 border-l-4 border-yellow-400/60 pl-4 text-left text-base sm:text-lg leading-relaxed text-gray-100 italic">
            “Adopting a forward-looking mindset and sharing strong ideas with
            ease — building an ecosystem that creates local value and connects
            young people with technology, starting from Silifke.”
          </blockquote>
          <p className={`${paragraphClass} mt-4`}>
            Silifke Technology Community is more than a community; it is a platform
            where local businesses go digital, young people turn ideas into
            ventures, and Silifke becomes a role model on Turkey’s tech stage.
          </p>
        </>
      ),
    },
    {
      id: "faq-11",
      emoji: "📲",
      title: "11. How can I apply?",
      answer: (
        <>
          <p className={paragraphClass}>
            <span aria-hidden="true" className="mr-1">
              👉
            </span>
            <a
              href="https://silifketeknoloji.org"
              target="_blank"
              rel="noreferrer"
              className="text-yellow-200 underline-offset-4 hover:underline"
            >
              silifketeknoloji.org
            </a>{" "}
            Complete the application form and we will reach out shortly to start
            the onboarding process.
          </p>
        </>
      ),
    },
    {
      id: "faq-12",
      emoji: "🦀",
      title: "12. What does the “Crab” symbol stand for?",
      answer: (
        <>
          <p className={paragraphClass}>
            The crab represents Silifke’s bond with the Mediterranean and the
            community’s resilient, creative, multi-faceted spirit. With its
            technology-infused shell, it tells the story of a global vision born
            from the local — just like Silifke Technology’s mission.
          </p>
        </>
      ),
    },
    {
      id: "faq-13",
      emoji: "🎯",
      title: "13. What do you expect from members?",
      answer: (
        <>
          <p className={paragraphClass}>
            Silifke Technology is not a school; it is a production-driven
            community. We expect members to:
          </p>
          <ul
            className={`${listClass} mt-3 list-disc space-y-2 pl-6 marker:text-yellow-300`}
          >
            <li>Attend meetings regularly</li>
            <li>Take responsibility within the team</li>
            <li>Contribute to the maker culture</li>
            <li>Embrace collaboration and knowledge sharing</li>
          </ul>
        </>
      ),
    },
    {
      id: "faq-14",
      emoji: "💬",
      title: "14. What kind of projects do you build?",
      answer: (
        <>
          <p className={paragraphClass}>Example projects we produce:</p>
          <ul
            className={`${listClass} mt-3 list-disc space-y-2 pl-6 marker:text-yellow-300`}
          >
            <li>Automation solutions for local businesses</li>
            <li>Web and mobile applications</li>
            <li>AI-driven mini tools</li>
            <li>Social media content and promotional campaigns</li>
            <li>Joint projects with Mahallefy, Simay Teknoloji, and local ventures</li>
          </ul>
        </>
      ),
    },
    {
      id: "faq-15",
      emoji: "🔗",
      title: "15. Can we collaborate?",
      answer: (
        <>
          <p className={paragraphClass}>
            Absolutely. We co-create initiatives with local businesses, schools,
            and technology startups.
          </p>
          <p className={paragraphClass}>
            For collaboration proposals, reach out at{" "}
            <a
              href="mailto:info@silifketeknoloji.org"
              className="text-yellow-200 underline-offset-4 hover:underline"
            >
              info@silifketeknoloji.org
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "faq-16",
      emoji: "❤️",
      title: "16. Why was Silifke Technology founded?",
      answer: (
        <>
          <p className={paragraphClass}>
            Because we believe that technology starts with big ideas, not big
            cities. Silifke Technology was founded to carry local potential to
            the world through production and innovation.
          </p>
          <p className={paragraphClass}>
            The community aspires to become a model of inspiration rising from
            Silifke.
          </p>
        </>
      ),
    },
  ];
};

const FaqSection: React.FC<FaqSectionProps> = ({ isTR }) => {
  const faqItems = React.useMemo(() => getFaqItems(isTR), [isTR]);

  return (
    <section
      id="sss"
      className="relative z-20 mt-20 sm:mt-28 lg:mt-32 text-left"
      aria-labelledby="faq-heading"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 px-6 py-10 sm:px-10 sm:py-14 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-start gap-4 text-left"
        >
          <span className="inline-flex items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-yellow-200/90">
            {isTR ? "S.S.S" : "FAQ"}
          </span>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
          >
            {isTR
              ? "Sıkça Sorulan Sorular — Silifke Teknoloji Topluluğu"
              : "Frequently Asked Questions — Silifke Technology Community"}
          </h2>
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-gray-200">
            {isTR
              ? "Topluluğumuz hakkında en sık sorulan soruları ve yanıtlarını derledik. Aklına takılan başka bir konu olursa bize her zaman yazabilirsin."
              : "We collected the answers to the questions we hear most about the community. If you are still curious about something else, feel free to reach out."}
          </p>
          <div className="mt-2 h-px w-36 bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent" />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
          {faqItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 sm:p-8 shadow-lg shadow-black/25 backdrop-blur-md"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 via-transparent to-transparent" />
                <div className="absolute -top-12 right-10 h-32 w-32 rounded-full bg-yellow-400/10 blur-3xl" />
              </div>
              <div className="relative flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-2xl">
                    {item.emoji}
                  </span>
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-200/80">
                      {isTR ? "Soru" : "Question"}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="space-y-3 text-sm leading-relaxed text-gray-200 sm:text-base">
                  {item.answer}
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs uppercase tracking-[0.3em] text-yellow-200/60">
                  ⸻
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-yellow-400/25 opacity-30" />
        <div className="pointer-events-none absolute -left-12 bottom-6 h-32 w-32 rounded-full border border-white/15 opacity-20" />
      </div>
    </section>
  );
};

export default FaqSection;
