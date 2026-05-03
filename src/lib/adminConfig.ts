import { isSupabaseConfigured, supabase } from './supabaseClient';

export const ADMIN_STORAGE_KEY = 'silifke-tech-admin-session';

export type AdminSession = {
  token: string;
  expiresAt: number;
  userId?: string;
};

export type AdminAuthErrorCode = 'CONFIG' | 'INVALID_CREDENTIALS' | 'NOT_ADMIN' | 'NETWORK' | 'UNKNOWN';

export class AdminAuthError extends Error {
  code: AdminAuthErrorCode;

  constructor(code: AdminAuthErrorCode, message: string) {
    super(message);
    this.name = 'AdminAuthError';
    this.code = code;
  }
}

/**
 * Verifies that the given Supabase auth user has an entry in the public.admins table.
 * Returns true if the user is an admin, false otherwise.
 */
async function verifyIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Failed to verify admin status', error);
      return false;
    }

    return Boolean(data);
  } catch (error) {
    console.warn('Failed to verify admin status', error);
    return false;
  }
}

function buildSession(token: string, expiresAtSec: number | null | undefined, userId?: string): AdminSession {
  const expiresAt = typeof expiresAtSec === 'number' ? expiresAtSec * 1000 : Date.now() + 60 * 60 * 1000;
  return { token, expiresAt, userId };
}

/** Returns the active admin session if the user is signed in via Supabase auth. */
export async function getStoredAdminSession(): Promise<AdminSession | null> {
  if (typeof window === 'undefined') return null;

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;

    return buildSession(
      data.session.access_token,
      data.session.expires_at,
      data.session.user.id,
    );
  } catch (error) {
    console.warn('Failed to read Supabase session', error);
    return null;
  }
}

/** Removes the local Supabase auth session. */
export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  // Best-effort sign-out; ignored if it fails.
  void supabase.auth.signOut().catch(() => undefined);
  // Legacy key cleanup (from the old custom JWT flow)
  try {
    window.localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Authenticate via Supabase auth (email + password) and verify that the user is in the admins table.
 * The `username` parameter accepts an email address.
 */
export async function loginAsAdmin(username: string, password: string): Promise<AdminSession> {
  if (!isSupabaseConfigured) {
    throw new AdminAuthError(
      'CONFIG',
      'Supabase is not configured. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable admin login.',
    );
  }

  const email = username.trim();
  if (!email) {
    throw new AdminAuthError('INVALID_CREDENTIALS', 'Email is required.');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const msg = error.message?.toLowerCase() ?? '';
      if (msg.includes('invalid') || msg.includes('credentials')) {
        throw new AdminAuthError('INVALID_CREDENTIALS', 'Email or password is incorrect.');
      }
      console.error('Admin login failed', error);
      throw new AdminAuthError('UNKNOWN', error.message || 'Unable to authorise administrator.');
    }

    if (!data.session || !data.user) {
      throw new AdminAuthError('UNKNOWN', 'No session returned from Supabase.');
    }

    const isAdmin = await verifyIsAdmin(data.user.id);
    if (!isAdmin) {
      // Sign the user out so they don't keep a non-admin session around.
      await supabase.auth.signOut().catch(() => undefined);
      throw new AdminAuthError(
        'NOT_ADMIN',
        'This account does not have admin privileges.',
      );
    }

    return buildSession(data.session.access_token, data.session.expires_at, data.user.id);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      throw error;
    }

    console.error('Admin login request failed', error);
    throw new AdminAuthError('NETWORK', 'Unable to reach the authentication service.');
  }
}

/** Confirms the stored Supabase session is still valid AND belongs to an admin user. */
export async function validateAdminSession(session: AdminSession): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  if (!session || typeof session.token !== 'string') return false;
  if (session.expiresAt <= Date.now()) return false;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return false;

    return await verifyIsAdmin(data.user.id);
  } catch (error) {
    console.warn('Failed to validate admin session', error);
    return false;
  }
}

/** Signs the admin out via Supabase auth. The `token` param is accepted for backwards compatibility. */
export async function logoutAdminSession(_token?: string) {
  if (!isSupabaseConfigured) {
    clearAdminSession();
    return;
  }

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('Failed to sign out from Supabase', error);
  }

  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
