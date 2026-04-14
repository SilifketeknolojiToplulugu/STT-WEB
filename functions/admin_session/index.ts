import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface AdminSessionLoginRequest {
  action: 'login';
  username: string;
  password: string;
}

interface AdminSessionValidateRequest {
  action: 'validate';
  token: string;
}

interface AdminSessionLogoutRequest {
  action: 'logout';
  token?: string;
}

type AdminSessionRequest =
  | AdminSessionLoginRequest
  | AdminSessionValidateRequest
  | AdminSessionLogoutRequest;

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const DEFAULT_TTL_SECONDS = Number(Deno.env.get('ADMIN_SESSION_TTL_SECONDS') ?? '3600');

Deno.serve(async (req) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers },
    );
  }

  let body: AdminSessionRequest;
  try {
    body = await req.json();
  } catch (error) {
    console.error('Invalid JSON body received', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid request body' }),
      { status: 400, headers },
    );
  }

  const secret = Deno.env.get('ADMIN_JWT_SECRET');
  const expectedUsername = Deno.env.get('ADMIN_USERNAME');
  const expectedPassword = Deno.env.get('ADMIN_PASSWORD');

  if (!secret || !expectedUsername || !expectedPassword) {
    console.error('Admin authentication environment variables are missing');
    return new Response(
      JSON.stringify({ success: false, error: 'Admin authentication is not configured' }),
      { status: 500, headers },
    );
  }

  const normalizedUsername = expectedUsername.trim().toLowerCase();
  const usernameHashReference = await hashString(normalizedUsername);
  const normalizedPassword = expectedPassword.trim();
  const passwordHashReference = await hashString(normalizedPassword);
  const passwordHashReferenceBytes = hexToUint8(passwordHashReference);

  switch (body.action) {
    case 'login': {
      const suppliedUsername = body.username?.trim().toLowerCase();
      const suppliedPassword = body.password ?? '';

      if (!suppliedUsername || !suppliedPassword) {
        return new Response(
          JSON.stringify({ success: false, error: 'Username and password are required' }),
          { status: 400, headers },
        );
      }

      const suppliedUsernameHash = await hashString(suppliedUsername);
      if (!timingSafeEqual(hexToUint8(suppliedUsernameHash), hexToUint8(usernameHashReference))) {
        return unauthorized(headers);
      }

      const suppliedPasswordHash = await hashString(suppliedPassword);
      const suppliedPasswordHashBytes = hexToUint8(suppliedPasswordHash);
      if (!timingSafeEqual(suppliedPasswordHashBytes, passwordHashReferenceBytes)) {
        return unauthorized(headers);
      }

      const { token, expiresAt } = await createJwtToken(normalizedUsername, secret, DEFAULT_TTL_SECONDS);

      return new Response(
        JSON.stringify({ success: true, token, expiresAt }),
        { status: 200, headers },
      );
    }

    case 'validate': {
      const token = body.token ?? '';
      if (!token) {
        return new Response(
          JSON.stringify({ success: false, error: 'Token is required' }),
          { status: 400, headers },
        );
      }

      const verification = await verifyJwtToken(token, secret);
      if (!verification.valid) {
        return unauthorized(headers, verification.error);
      }

      const payload = verification.payload as JwtPayload;
      if (typeof payload.sub !== 'string') {
        return unauthorized(headers, 'Invalid token payload');
      }

      const payloadUsernameHash = await hashString(payload.sub.trim().toLowerCase());
      if (!timingSafeEqual(hexToUint8(payloadUsernameHash), hexToUint8(usernameHashReference))) {
        return unauthorized(headers, 'Invalid token subject');
      }

      const expiresAt = payload.exp * 1000;
      if (Date.now() >= expiresAt) {
        return unauthorized(headers, 'Token expired');
      }

      return new Response(
        JSON.stringify({ success: true, valid: true, expiresAt }),
        { status: 200, headers },
      );
    }

    case 'logout': {
      // No server-side state to clear yet; return success to allow client cleanup.
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers },
      );
    }

    default:
      return new Response(
        JSON.stringify({ success: false, error: 'Unsupported action' }),
        { status: 400, headers },
      );
  }
});

async function hashString(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return bufferToHex(new Uint8Array(digest));
}

async function createJwtToken(subject: string, secret: string, ttlSeconds: number) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + Math.max(ttlSeconds, 300);
  const payload: JwtPayload = {
    sub: subject,
    iat: issuedAt,
    exp: expiresAt,
  };

  const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = await sign(signingInput, secret);
  const token = `${signingInput}.${signature}`;

  return { token, expiresAt: expiresAt * 1000 };
}

async function verifyJwtToken(token: string, secret: string) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed token' };
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signatureValid = await verify(signingInput, encodedSignature, secret);
  if (!signatureValid) {
    return { valid: false, error: 'Invalid signature' };
  }

  try {
    const payloadJson = decoder.decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(payloadJson) as JwtPayload;

    if (typeof payload.exp !== 'number') {
      return { valid: false, error: 'Invalid token payload' };
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload };
  } catch (error) {
    console.error('Failed to parse JWT payload', error);
    return { valid: false, error: 'Invalid token payload' };
  }
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}

async function verify(data: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  try {
    return await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlDecode(signature),
      encoder.encode(data),
    );
  } catch (error) {
    console.error('Failed to verify signature', error);
    return false;
  }
}

function base64UrlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function hexToUint8(hex: string): Uint8Array {
  const normalized = hex.trim().toLowerCase();
  if (normalized.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    bytes[i / 2] = parseInt(normalized.slice(i, i + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a[i] ^ b[i];
  }
  return mismatch === 0;
}

function unauthorized(headers: Record<string, string>, message = 'Invalid credentials') {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status: 401, headers },
  );
}
