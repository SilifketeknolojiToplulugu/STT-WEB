import { createClient } from '@supabase/supabase-js';

const SUPABASE_PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const SUPABASE_PLACEHOLDER_KEY = 'placeholder-key';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_PLACEHOLDER_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_PLACEHOLDER_KEY;

// Development mode için geçici çözüm
export const isSupabaseConfigured =
  supabaseUrl !== SUPABASE_PLACEHOLDER_URL && supabaseAnonKey !== SUPABASE_PLACEHOLDER_KEY;

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase environment variables not set. Please create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Application {
  id: string;
  created_at: string;
  updated_at: string;
  age: number;
  full_name: string;
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
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  level: 'community' | 'contributor' | 'core';
  consent_kvkk: boolean;
  consent_date: string | null;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  score: number;
  score_breakdown: Record<string, number>;
}

export interface Member {
  id: string;
  created_at: string;
  updated_at: string;
  application_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  school_work: string | null;
  level: 'community' | 'contributor' | 'core';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  join_date: string;
  last_activity: string;
  total_points: number;
  monthly_points: number;
  interests: string[];
  meeting_preference: string | null;
  hardware_sharing: string | null;
  notes: string | null;
  assigned_by: string | null;
  consent_kvkk: boolean;
  consent_date: string;
}

export interface Activity {
  id: string;
  created_at: string;
  member_id: string;
  activity_type: 'project_contribution' | 'meeting_attendance' | 'event_organization' | 'mentoring' | 'content_creation' | 'hardware_sharing' | 'community_help' | 'leadership' | 'other';
  title: string;
  description: string | null;
  points_awarded: number;
  points_reason: string | null;
  activity_date: string;
  duration_hours: number | null;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  metadata: Record<string, unknown>;
  status: 'active' | 'cancelled' | 'disputed';
}

// Application form data type (matches the form schema)
export interface ApplicationFormData {
  fullName: string;
  age: number;
  email: string;
  phone: string;
  schoolWork: string;
  interests: string[];
  portfolioExample: string;
  motivation: string;
  weeklyHours: string;
  meetingPreference: string;
  computerType: string;
  additionalHardware: string[];
  hardwareSharing: string;
  consentKvkk: boolean;
}

// Helper function to submit application
export async function submitApplication(data: ApplicationFormData): Promise<{ success: boolean; error?: string; applicationId?: string }> {
  try {
    // Validate KVKK consent
    if (!data.consentKvkk) {
      return { success: false, error: 'KVKK onayı zorunludur' };
    }

    // Validate age range
    if (typeof data.age !== 'number' || Number.isNaN(data.age)) {
      return { success: false, error: 'Yaş bilgisi geçerli değil' };
    }

    if (data.age < 18 || data.age > 38) {
      return { success: false, error: 'Yaş 18 ile 38 arasında olmalıdır' };
    }

    // Check if Supabase is properly configured
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
      // Development mode - simulate success
      console.log('Development mode: Simulating application submission');
      return {
        success: true,
        applicationId: 'dev-' + Date.now().toString()
      };
    }

    // Transform form data to match database schema
    const applicationData = {
      full_name: data.fullName,
      age: data.age,
      email: data.email,
      phone: data.phone,
      school_work: data.schoolWork,
      interests: data.interests,
      portfolio_example: data.portfolioExample,
      motivation: data.motivation,
      weekly_hours: data.weeklyHours,
      meeting_preference: data.meetingPreference,
      computer_type: data.computerType,
      additional_hardware: data.additionalHardware,
      hardware_sharing: data.hardwareSharing,
      consent_kvkk: data.consentKvkk,
      consent_date: new Date().toISOString()
    };

    const { data: result, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: 'Başvuru gönderilirken bir hata oluştu' };
    }

    // Trigger Discord notification via Edge Function
    try {
      const { error: functionError } = await supabase.functions.invoke('on_application_submitted', {
        body: { record: { ...applicationData, id: result.id } }
      });

      if (functionError) {
        console.error('Discord notification error:', functionError);
        // Don't fail the application submission if Discord notification fails
      }
    } catch (notificationError) {
      console.error('Discord notification failed:', notificationError);
      // Don't fail the application submission if Discord notification fails
    }

    return { success: true, applicationId: result.id };
  } catch (error) {
    console.error('Application submission error:', error);
    return { success: false, error: 'Beklenmeyen bir hata oluştu' };
  }
}

// Helper function to get application status (for thank you page)
export async function getApplicationStatus(applicationId: string): Promise<{ status?: string; level?: string; score?: number }> {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('status, level, score')
      .eq('id', applicationId)
      .single();

    if (error) {
      console.error('Error fetching application status:', error);
      return {};
    }

    return {
      status: data.status,
      level: data.level,
      score: data.score
    };
  } catch (error) {
    console.error('Error fetching application status:', error);
    return {};
  }
}

// Statistics interface
export interface ClubStatistics {
  totalMembers: number;
  totalApplications: number;
  approvedApplications: number; // Changed from pendingApplications - shows approved count (= member count)
}

// Team member count - this should match the AboutPage team members list
export const TEAM_MEMBER_COUNT = 7;

// Baseline application count (before Supabase tracking started)
const BASELINE_APPLICATION_COUNT = 29;

// Helper function to get club statistics
// teamMemberCount parameter allows overriding the member count (e.g., from AboutPage)
export async function getClubStatistics(teamMemberCount: number = TEAM_MEMBER_COUNT): Promise<ClubStatistics> {
  try {
    // Check if Supabase is properly configured
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
      // Development mode - return mock data
      console.log('Development mode: Returning mock statistics');
      return {
        totalMembers: teamMemberCount,
        totalApplications: BASELINE_APPLICATION_COUNT,
        approvedApplications: 11 // Requested to stay at 11 explicitly
      };
    }

    // Get total applications count from Supabase
    let totalApplications = 0;

    // Try to use the public statistics view first
    try {
      const { data, error } = await supabase
        .from('public_statistics')
        .select('*')
        .single();

      if (!error && data) {
        totalApplications = data.total_applications || 0;
      }
    } catch (viewError) {
      console.log('Statistics view not available, falling back to function:', viewError);
    }

    // Fallback to function if view didn't work
    if (totalApplications === 0) {
      try {
        const { data, error } = await supabase
          .rpc('get_public_statistics');

        if (!error && data && data.length > 0) {
          totalApplications = data[0].total_applications || 0;
        }
      } catch (functionError) {
        console.log('Statistics function not available, falling back to direct queries:', functionError);
      }
    }

    // Final fallback: direct query for applications count
    if (totalApplications === 0) {
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      if (!applicationsError && applicationsCount !== null) {
        totalApplications = applicationsCount;
      }
    }

    // Member count comes from the team list, not from database
    // Approved applications = member count (all members were approved applicants)
    return {
      totalMembers: teamMemberCount,
      totalApplications: BASELINE_APPLICATION_COUNT + totalApplications,
      approvedApplications: 11 // Requested to stay at 11 explicitly
    };
  } catch (error) {
    console.error('Error fetching club statistics:', error);
    return {
      totalMembers: teamMemberCount,
      totalApplications: BASELINE_APPLICATION_COUNT,
      approvedApplications: 11 // Requested to stay at 11 explicitly
    };
  }
}

// Helper function to subscribe to real-time statistics updates
export function subscribeToStatisticsUpdates(
  callback: (stats: ClubStatistics) => void
): () => void {
  try {
    // Check if Supabase is properly configured
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
      console.log('Development mode: Real-time updates not available');
      return () => { }; // Return empty unsubscribe function
    }

    // Subscribe to applications table changes
    const applicationsSubscription = supabase
      .channel('applications-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        async () => {
          // Fetch updated statistics when applications change
          const stats = await getClubStatistics();
          callback(stats);
        }
      )
      .subscribe();

    // Subscribe to members table changes
    const membersSubscription = supabase
      .channel('members-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        async () => {
          // Fetch updated statistics when members change
          const stats = await getClubStatistics();
          callback(stats);
        }
      )
      .subscribe();

    // Subscribe to public_statistics view changes (if available)
    const statisticsSubscription = supabase
      .channel('statistics-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'public_statistics' },
        async () => {
          // Fetch updated statistics when statistics view changes
          const stats = await getClubStatistics();
          callback(stats);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      applicationsSubscription.unsubscribe();
      membersSubscription.unsubscribe();
      statisticsSubscription.unsubscribe();
    };
  } catch (error) {
    console.error('Error setting up statistics subscription:', error);
    return () => { }; // Return empty unsubscribe function
  }
}
