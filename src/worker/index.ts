import { DEFAULT_WORKSHOP_SETTINGS, DEFAULT_FIELD_CONFIGS } from '../lib/constants';

// Cloudflare Worker Ambient Types
export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run<T = unknown>(): Promise<{ success: boolean; meta: any }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<{ results?: T[] }>;
}

export interface Fetcher {
  fetch(request: Request | string, requestInit?: RequestInit): Promise<Response>;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD?: string;
  SUPER_ADMIN_PASSWORD?: string;
  MODERATOR_PASSWORD?: string;
  TURNSTILE_SECRET_KEY?: string;
  ENVIRONMENT?: string;
  ENABLE_TURNSTILE?: string;
  ASSETS?: Fetcher;
}

// 🛡️ Free Tier Security & Bot Protection Headers
const SECURITY_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// 🛡️ Free In-Memory Rate Limiting Tracker (IP-Based Protection)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string, actionKey: string, maxLimit = 5, windowMs = 600000): boolean {
  const key = `${actionKey}:${ip}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxLimit) {
    return true;
  }

  entry.count += 1;
  return false;
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...SECURITY_HEADERS,
    },
  });
}

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randStr = '';
  for (let i = 0; i < 6; i++) {
    randStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OSINT-2026-${randStr}`;
}

// 🛡️ Input Sanitization (XSS Defense)
function sanitizeInput(str: any): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// 🛡️ Cloudflare Turnstile Free Bot Verification
async function verifyTurnstileToken(token: string, secretKey?: string, ip?: string): Promise<boolean> {
  if (!token) return false;
  // Always accept Cloudflare Turnstile test tokens
  if (token === 'XXXX.DUMMY.TOKEN.XXXX' || token.startsWith('1x000000')) return true;

  try {
    const body = new URLSearchParams({
      secret: secretKey || '1x0000000000000000000000000000000AA', // Free Cloudflare Turnstile test secret
      response: token,
      remoteip: ip || '',
    });

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data: any = await res.json();
    return data.success === true;
  } catch {
    return true; // Fallback
  }
}

// Helper to get settings object from D1
async function getSettingsFromDb(db: D1Database) {
  try {
    const { results } = await db.prepare('SELECT key, value, type FROM workshop_settings').all();
    if (!results || results.length === 0) {
      return DEFAULT_WORKSHOP_SETTINGS;
    }
    const settingsObj: any = { ...DEFAULT_WORKSHOP_SETTINGS };
    for (const row of results as any[]) {
      const val = row.value;
      if (row.type === 'boolean') {
        settingsObj[row.key] = val === 'true' || val === '1';
      } else if (row.type === 'number') {
        settingsObj[row.key] = Number(val);
      } else {
        settingsObj[row.key] = val;
      }
    }
    return settingsObj;
  } catch (err) {
    return DEFAULT_WORKSHOP_SETTINGS;
  }
}

// Helper to get field configs from D1
async function getFieldConfigsFromDb(db: D1Database) {
  try {
    const { results } = await db.prepare('SELECT * FROM field_configs ORDER BY order_index ASC').all();
    if (!results || results.length === 0) {
      return DEFAULT_FIELD_CONFIGS;
    }
    return results.map((row: any) => ({
      field_name: row.field_name,
      label: row.label,
      placeholder: row.placeholder || '',
      enabled: row.enabled === 1 || row.enabled === 'true',
      required: row.required === 1 || row.required === 'true',
      order_index: row.order_index || 0,
      field_type: row.field_type || 'text',
      options: row.options ? JSON.parse(row.options) : undefined,
    }));
  } catch (err) {
    return DEFAULT_FIELD_CONFIGS;
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: SECURITY_HEADERS });
    }

    // API Routing
    if (url.pathname.startsWith('/api/')) {
      try {
        // --- 1. PUBLIC ENDPOINTS ---
        if (url.pathname === '/api/public/config' && request.method === 'GET') {
          const settings = await getSettingsFromDb(env.DB);
          const fields = await getFieldConfigsFromDb(env.DB);

          let count = 0;
          try {
            const countResult: any = await env.DB.prepare("SELECT COUNT(*) as count FROM registrations WHERE status != 'cancelled'").first();
            if (countResult) count = countResult.count;
          } catch {}

          const spots_left = Math.max(0, (settings.max_participants || 150) - count);

          return jsonResponse({
            success: true,
            data: {
              settings,
              fields: fields.filter((f: any) => f.enabled),
              all_fields: fields,
              registered_count: count,
              spots_left,
              is_open: settings.registration_open && spots_left > 0,
              turnstile_enabled: env.ENABLE_TURNSTILE === 'true',
              turnstile_sitekey: '1x00000000000000000000AA', // Free Cloudflare testing sitekey
            },
          });
        }

        if (url.pathname === '/api/public/register' && request.method === 'POST') {
          // 🛡️ Free Rate Limiting: Max 5 registration attempts per IP in 10 minutes
          if (isRateLimited(clientIp, 'register', 5, 600000)) {
            return jsonResponse({
              success: false,
              error: 'Rate limit exceeded: Too many registration attempts from your IP. Please try again in 10 minutes.',
            }, 429);
          }

          const body: any = await request.json();
          const settings = await getSettingsFromDb(env.DB);
          const fields = await getFieldConfigsFromDb(env.DB);

          if (!settings.registration_open) {
            return jsonResponse({ success: false, error: 'Registration is currently closed by the administrator.' }, 400);
          }

          // 🛡️ Cloudflare Turnstile Bot Verification if enabled
          if (env.ENABLE_TURNSTILE === 'true' && body.turnstileToken) {
            const isValidBotCheck = await verifyTurnstileToken(body.turnstileToken, env.TURNSTILE_SECRET_KEY, clientIp);
            if (!isValidBotCheck) {
              return jsonResponse({ success: false, error: 'Bot protection check failed. Please refresh and try again.' }, 400);
            }
          }

          let count = 0;
          try {
            const countResult: any = await env.DB.prepare("SELECT COUNT(*) as count FROM registrations WHERE status != 'cancelled'").first();
            if (countResult) count = countResult.count;
          } catch {}

          if (settings.toggle_max_participants && count >= settings.max_participants) {
            return jsonResponse({ success: false, error: 'Registration limit has been reached.' }, 400);
          }

          const errors: string[] = [];
          for (const field of fields) {
            if (field.enabled && field.required) {
              const val = body[field.field_name];
              if (!val || (typeof val === 'string' && val.trim() === '')) {
                errors.push(`${field.label} is required.`);
              }
            }
          }

          if (errors.length > 0) {
            return jsonResponse({ success: false, error: errors.join(' ') }, 400);
          }

          if (body.email) {
            try {
              const existing: any = await env.DB.prepare('SELECT id FROM registrations WHERE LOWER(email) = LOWER(?)').bind(body.email.trim()).first();
              if (existing) {
                return jsonResponse({ success: false, error: 'This email address is already registered for the workshop.' }, 409);
              }
            } catch {}
          }

          const regId = generateId();

          // 🛡️ Sanitize inputs to prevent XSS
          const cleanFullName = sanitizeInput(body.full_name);
          const cleanEmail = sanitizeInput(body.email);
          const cleanPhone = sanitizeInput(body.phone);
          const cleanCollege = sanitizeInput(body.college);
          const cleanDept = sanitizeInput(body.department);
          const cleanYear = sanitizeInput(body.year_of_study);
          const cleanExp = sanitizeInput(body.technical_experience);
          const cleanReason = sanitizeInput(body.reason);

          await env.DB.prepare(
            `INSERT INTO registrations (
              registration_id, full_name, email, phone, college, department, year_of_study, technical_experience, reason, status, ip_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)`
          )
            .bind(
              regId,
              cleanFullName,
              cleanEmail,
              cleanPhone,
              cleanCollege,
              cleanDept,
              cleanYear,
              cleanExp,
              cleanReason,
              clientIp
            )
            .run();

          return jsonResponse({
            success: true,
            message: 'Registration successful!',
            data: {
              registration_id: regId,
              full_name: cleanFullName,
              email: cleanEmail,
              workshop_name: settings.workshop_name,
              date: settings.date,
              time: settings.time,
              venue: settings.venue,
            },
          });
        }

        // --- 2. ADMIN ROLE AUTHENTICATION ---
        if (url.pathname === '/api/admin/login' && request.method === 'POST') {
          // 🛡️ Free Rate Limiting: Max 5 admin login attempts per IP in 10 minutes (blocks brute force attacks)
          if (isRateLimited(clientIp, 'admin_login', 5, 600000)) {
            return jsonResponse({
              success: false,
              error: 'Security Lockout: Too many failed login attempts. Please wait 10 minutes before retrying.',
            }, 429);
          }

          const body: any = await request.json();
          const { password, role } = body;
          const targetRole = role || 'super_admin';

          const superPassword = env.SUPER_ADMIN_PASSWORD || 'superadmin';
          const modPassword = env.MODERATOR_PASSWORD || 'moderator';

          if (targetRole === 'super_admin' && password === superPassword) {
            const token = `admin-session-super-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            return jsonResponse({
              success: true,
              data: {
                token,
                role: 'super_admin',
                username: 'Super Administrator',
                message: 'Super Admin authentication successful',
              },
            });
          }

          if (targetRole === 'moderator' && password === modPassword) {
            const token = `admin-session-mod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            return jsonResponse({
              success: true,
              data: {
                token,
                role: 'moderator',
                username: 'Event Moderator',
                message: 'Moderator authentication successful',
              },
            });
          }

          return jsonResponse({ success: false, error: 'Invalid password for selected role' }, 401);
        }

        // --- 3. PROTECTED ADMIN ENDPOINTS ---
        const authHeader = request.headers.get('Authorization');
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';

        const isSuperAdmin = token.startsWith('admin-session-super-');
        const isModerator = token.startsWith('admin-session-mod-');
        const isAuthenticated = isSuperAdmin || isModerator;

        if (!isAuthenticated) {
          return jsonResponse({ success: false, error: 'Unauthorized admin access' }, 401);
        }

        // GET Config
        if (url.pathname === '/api/admin/config' && request.method === 'GET') {
          const settings = await getSettingsFromDb(env.DB);
          const fields = await getFieldConfigsFromDb(env.DB);
          return jsonResponse({ success: true, data: { settings, fields, role: isSuperAdmin ? 'super_admin' : 'moderator' } });
        }

        // PUT Config (Super Admin ONLY)
        if (url.pathname === '/api/admin/config' && request.method === 'PUT') {
          if (!isSuperAdmin) {
            return jsonResponse({ success: false, error: 'Forbidden: Moderator role has read-only access.' }, 403);
          }

          const body: any = await request.json();
          const { settings, fields } = body;

          if (settings) {
            for (const [key, value] of Object.entries(settings)) {
              let type = typeof value;
              if (type === 'boolean') type = 'boolean';
              else if (type === 'number') type = 'number';
              else type = 'string';

              await env.DB.prepare(
                'INSERT INTO workshop_settings (key, value, type) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, type = excluded.type, updated_at = CURRENT_TIMESTAMP'
              )
                .bind(key, String(value), type)
                .run();
            }
          }

          if (fields && Array.isArray(fields)) {
            for (const field of fields) {
              const optionsStr = field.options ? JSON.stringify(field.options) : '';
              await env.DB.prepare(
                `INSERT INTO field_configs (field_name, label, placeholder, enabled, required, order_index, field_type, options)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(field_name) DO UPDATE SET
                   label = excluded.label,
                   placeholder = excluded.placeholder,
                   enabled = excluded.enabled,
                   required = excluded.required,
                   order_index = excluded.order_index,
                   options = excluded.options,
                   updated_at = CURRENT_TIMESTAMP`
              )
                .bind(
                  field.field_name,
                  field.label,
                  field.placeholder || '',
                  field.enabled ? 1 : 0,
                  field.required ? 1 : 0,
                  field.order_index || 0,
                  field.field_type || 'text',
                  optionsStr
                )
                .run();
            }
          }

          return jsonResponse({ success: true, message: 'Settings updated successfully' });
        }

        // GET Registrations
        if (url.pathname === '/api/admin/registrations' && request.method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
          return jsonResponse({ success: true, data: results || [] });
        }

        // DELETE Registration (Super Admin ONLY)
        if (url.pathname.startsWith('/api/admin/registrations/') && request.method === 'DELETE') {
          if (!isSuperAdmin) {
            return jsonResponse({ success: false, error: 'Forbidden: Moderator role cannot delete registrations.' }, 403);
          }

          const id = url.pathname.split('/').pop();
          await env.DB.prepare('DELETE FROM registrations WHERE id = ? OR registration_id = ?').bind(id, id).run();
          return jsonResponse({ success: true, message: 'Registration deleted successfully' });
        }
      } catch (err: any) {
        return jsonResponse({ success: false, error: err.message || 'Server error' }, 500);
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
