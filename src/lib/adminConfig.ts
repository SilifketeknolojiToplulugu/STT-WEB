import { isSupabaseConfigured, supabase } from './supabaseClient';

export const ADMIN_STORAGE_KEY = 'silifke-tech-admin-session';

export type AdminSession = {
  token: string;
  expiresAt: number;
};

export type AdminAuthErrorCode = 'CONFIG' | 'INVALID_CREDENTIALS' | 'NETWORK' | 'UNKNOWN';

export class AdminAuthError extends Error {
  code: AdminAuthErrorCode;

  constructor(code: AdminAuthErrorCode, message: string) {
    super(message);
    this.name = 'AdminAuthError';
    this.code = code;
  }
}

function parseStoredSession(rawValue: string | null): AdminSession | null {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as Partial<AdminSession>;
    if (!parsed || typeof parsed.token !== 'string') return null;

    const expiresAt = typeof parsed.expiresAt === 'number' ? parsed.expiresAt : Date.now();
    return { token: parsed.token, expiresAt };
  } catch (error) {
    console.error('Failed to parse stored admin session', error);
    return null;
  }
}

export function getStoredAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  return parseStoredSession(window.localStorage.getItem(ADMIN_STORAGE_KEY));
}

export function storeAdminSession(session: AdminSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_STORAGE_KEY);
}

export async function loginAsAdmin(username: string, password: string): Promise<AdminSession> {
  if (!isSupabaseConfigured) {
    throw new AdminAuthError(
      'CONFIG',
      'Supabase is not configured. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable admin login.',
    );
  }

  try {
    const { data, error } = await supabase.functions.invoke('admin_session', {
      body: {
        action: 'login',
        username,
        password,
      },
    });

    if (error) {
      if (error.message?.toLowerCase().includes('invalid credentials')) {
        throw new AdminAuthError('INVALID_CREDENTIALS', 'Username or password is incorrect.');
      }

      console.error('Admin login failed', error);
      throw new AdminAuthError('UNKNOWN', 'Unable to authorise administrator.');
    }

    if (!data || typeof data.token !== 'string') {
      throw new AdminAuthError('UNKNOWN', 'No session token returned from server.');
    }

    const expiresAt = typeof data.expiresAt === 'number' ? data.expiresAt : Date.now() + 60 * 60 * 1000;
    const session: AdminSession = { token: data.token, expiresAt };

    storeAdminSession(session);
    return session;
  } catch (error) {
    if (error instanceof AdminAuthError) {
      throw error;
    }

    console.error('Admin login request failed', error);
    throw new AdminAuthError('NETWORK', 'Unable to reach the authentication service.');
  }
}

export async function validateAdminSession(session: AdminSession): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false;
  }

  if (!session || typeof session.token !== 'string') {
    return false;
  }

  if (session.expiresAt <= Date.now()) {
    return false;
  }

  try {
    const { data, error } = await supabase.functions.invoke('admin_session', {
      body: {
        action: 'validate',
        token: session.token,
      },
    });

    if (error) {
      console.warn('Admin session validation failed', error);
      return false;
    }

    if (data?.valid && typeof data.expiresAt === 'number') {
      const refreshedSession: AdminSession = { token: session.token, expiresAt: data.expiresAt };
      storeAdminSession(refreshedSession);
    }

    return Boolean(data?.valid);
  } catch (error) {
    console.warn('Failed to validate admin session', error);
    return false;
  }
}

export async function logoutAdminSession(token?: string) {
  clearAdminSession();

  if (!isSupabaseConfigured || !token) {
    return;
  }

  try {
    await supabase.functions.invoke('admin_session', {
      body: {
        action: 'logout',
        token,
      },
    });
  } catch (error) {
    console.warn('Failed to notify admin logout', error);
  }
}
