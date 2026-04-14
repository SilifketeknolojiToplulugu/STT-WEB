// Security middleware for enhanced protection
export function securityHeaders() {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://i.ytimg.com https://img.youtube.com; connect-src 'self' https://*.supabase.co https://*.supabase.in; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  }
}

// Rate limiting helper (basic implementation)
const requestCounts = new Map()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 100 // max requests per minute

export function rateLimit(ip) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  // Clean old entries
  for (const [key, data] of requestCounts.entries()) {
    if (data.lastRequest < windowStart) {
      requestCounts.delete(key)
    }
  }
  
  const key = ip
  const current = requestCounts.get(key) || { count: 0, lastRequest: now }
  
  if (current.lastRequest < windowStart) {
    current.count = 1
    current.lastRequest = now
  } else {
    current.count++
  }
  
  requestCounts.set(key, current)
  
  return current.count <= RATE_LIMIT_MAX
}
