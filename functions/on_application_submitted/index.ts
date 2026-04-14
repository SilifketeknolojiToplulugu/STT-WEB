import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ApplicationData {
  id: string;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  school_work: string;
  interests: string[];
  portfolio_example: string;
  motivation: string;
  weekly_hours: string;
  meeting_preference: string;
  computer_type: string;
  additional_hardware: string[];
  hardware_sharing: string;
  consent_kvkk: boolean;
  consent_date: string;
}

interface ScoringBreakdown {
  portfolio_quality: number;
  motivation_strength: number;
  technical_skills: number;
  availability: number;
  hardware_contribution: number;
  total: number;
}

Deno.serve(async (req: Request) => {
  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const discordWebhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the application data from the request
    const { record } = await req.json();
    const application: ApplicationData = record;

    console.log('Processing application:', application.id);

    // Calculate scoring
    const scoring = calculateApplicationScore(application);
    
    // Update application with score
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        score: scoring.total,
        score_breakdown: scoring,
        status: 'under_review'
      })
      .eq('id', application.id);

    if (updateError) {
      console.error('Error updating application score:', updateError);
      throw updateError;
    }

    // Send Discord notification without exposing sensitive data
    if (discordWebhookUrl) {
      await sendDiscordNotification(application, scoring, discordWebhookUrl);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        application_id: application.id,
        score: scoring.total,
        status: 'under_review'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error processing application:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function calculateApplicationScore(application: ApplicationData): ScoringBreakdown {
  let portfolio_quality = 0;
  let motivation_strength = 0;
  let technical_skills = 0;
  let availability = 0;
  let hardware_contribution = 0;

  // Portfolio Quality (0-25 points)
  const portfolioLength = application.portfolio_example.length;
  if (portfolioLength >= 200) portfolio_quality += 15;
  else if (portfolioLength >= 100) portfolio_quality += 10;
  else if (portfolioLength >= 50) portfolio_quality += 5;

  // Check for technical indicators in portfolio
  const techKeywords = ['github', 'code', 'programming', 'development', 'project', 'website', 'app'];
  const hasTechKeywords = techKeywords.some(keyword => 
    application.portfolio_example.toLowerCase().includes(keyword)
  );
  if (hasTechKeywords) portfolio_quality += 10;

  // Motivation Strength (0-20 points)
  const motivationLength = application.motivation.length;
  if (motivationLength >= 300) motivation_strength += 15;
  else if (motivationLength >= 150) motivation_strength += 10;
  else if (motivationLength >= 75) motivation_strength += 5;

  // Check for positive motivation keywords
  const positiveKeywords = ['öğrenmek', 'gelişmek', 'katkı', 'topluluk', 'teknoloji', 'proje'];
  const positiveCount = positiveKeywords.filter(keyword => 
    application.motivation.toLowerCase().includes(keyword)
  ).length;
  motivation_strength += Math.min(positiveCount * 2, 5);

  // Technical Skills (0-20 points)
  const interestCount = application.interests.length;
  technical_skills += Math.min(interestCount * 4, 12);

  // Computer type bonus
  if (application.computer_type !== 'none') {
    technical_skills += 8;
  }

  // Availability (0-15 points)
  const weeklyHours = application.weekly_hours.toLowerCase();
  if (weeklyHours.includes('15') || weeklyHours.includes('20') || weeklyHours.includes('+')) {
    availability += 15;
  } else if (weeklyHours.includes('10') || weeklyHours.includes('12')) {
    availability += 10;
  } else if (weeklyHours.includes('5') || weeklyHours.includes('8')) {
    availability += 5;
  }

  // Meeting preference bonus
  if (application.meeting_preference === 'yes') {
    availability += 5;
  } else if (application.meeting_preference === 'online') {
    availability += 3;
  }

  // Hardware Contribution (0-20 points)
  const hardwareCount = application.additional_hardware.filter(h => h !== 'none').length;
  hardware_contribution += Math.min(hardwareCount * 5, 15);

  // Hardware sharing bonus
  if (application.hardware_sharing === 'yes') {
    hardware_contribution += 10;
  } else if (application.hardware_sharing === 'sometimes') {
    hardware_contribution += 5;
  }

  const total = portfolio_quality + motivation_strength + technical_skills + availability + hardware_contribution;

  return {
    portfolio_quality: Math.min(portfolio_quality, 25),
    motivation_strength: Math.min(motivation_strength, 20),
    technical_skills: Math.min(technical_skills, 20),
    availability: Math.min(availability, 15),
    hardware_contribution: Math.min(hardware_contribution, 20),
    total: Math.min(total, 100)
  };
}

async function sendDiscordNotification(
  application: ApplicationData, 
  scoring: ScoringBreakdown, 
  webhookUrl: string
) {
  try {
    const embed = {
      title: "🆕 Yeni Üyelik Başvurusu",
      color: 0xffaa00,
      description: `Skor: ${scoring.total}/100 | ID: ${application.id}`,
      fields: [
        {
          name: "👤 Başvuran",
          value: maskFullName(application.full_name),
          inline: true
        },
        {
          name: "📧 E-posta",
          value: maskEmail(application.email),
          inline: true
        },
        {
          name: "🎂 Yaş",
          value: Number.isFinite(application.age) ? `${application.age}` : 'Belirtilmemiş',
          inline: true
        },
        {
          name: "🎯 İlgi Alanları",
          value: formatInterestList(application.interests),
          inline: false
        },
        {
          name: "💻 Bilgisayar",
          value: application.computer_type || 'Belirtilmemiş',
          inline: true
        },
        {
          name: "⏰ Haftalık Saat",
          value: application.weekly_hours || 'Belirtilmemiş',
          inline: true
        },
        {
          name: "📊 Puan",
          value: `${scoring.total}/100`,
          inline: true
        },
        {
          name: "📈 Puan Özeti",
          value: `Portfolio: ${scoring.portfolio_quality}/25\nMotivasyon: ${scoring.motivation_strength}/20\nTeknik: ${scoring.technical_skills}/20\nMüsaitlik: ${scoring.availability}/15\nDonanım: ${scoring.hardware_contribution}/20`,
          inline: false
        }
      ],
      footer: {
        text: 'Kişisel veriler maskelenmiştir'
      },
      timestamp: new Date().toISOString()
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    console.log('Discord notification sent successfully');
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}

function maskFullName(fullName: string): string {
  if (!fullName) return 'Belirtilmedi';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return 'Belirtilmedi';

  const [first, ...rest] = parts;
  const initials = rest.map((part) => (part ? `${part.charAt(0).toUpperCase()}.` : '')).filter(Boolean).join(' ');
  return initials ? `${first} ${initials}` : first;
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  const [localPart, domain] = email.split('@');
  if (!localPart) return `***@${domain}`;

  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}${'*'.repeat(Math.max(3, localPart.length - visible.length))}@${domain}`;
}

function formatInterestList(interests: string[]): string {
  if (!interests || interests.length === 0) {
    return 'Belirtilmemiş';
  }

  const list = interests.slice(0, 5).join(', ');
  const remaining = interests.length - 5;
  return remaining > 0 ? `${list} (+${remaining})` : list;
}
