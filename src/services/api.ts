import { WorkshopSettings, FieldConfig, Registration, PublicConfigResponse, ApiResponse, AdminRole, AdminAuth } from '../types';
import { DEFAULT_WORKSHOP_SETTINGS, DEFAULT_FIELD_CONFIGS } from '../lib/constants';
import { generateRegistrationId } from '../lib/utils';

const STORAGE_KEY_SETTINGS = 'osint_workshop_settings_v1';
const STORAGE_KEY_FIELDS = 'osint_workshop_fields_v1';
const STORAGE_KEY_REGS = 'osint_workshop_registrations_v1';
const STORAGE_KEY_AUTH = 'osint_admin_auth_v1';

// Seed LocalStorage defaults if empty
function initLocalStorageMock() {
  if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_WORKSHOP_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEY_FIELDS)) {
    localStorage.setItem(STORAGE_KEY_FIELDS, JSON.stringify(DEFAULT_FIELD_CONFIGS));
  }
  if (!localStorage.getItem(STORAGE_KEY_REGS)) {
    const seedRegs: Registration[] = [
      {
        id: 1,
        registration_id: 'OSINT-2026-X9K2L1',
        full_name: 'Sarah Connor',
        email: 'sarah.c@cybernet.io',
        phone: '+1 (555) 019-8821',
        college: 'MIT School of Cyber Operations',
        department: 'Information Security',
        year_of_study: '3rd Year (Junior)',
        technical_experience: 'Intermediate (Basic search techniques)',
        reason: 'Looking forward to learning SOCMINT and dark web tracking methodologies.',
        status: 'confirmed',
        created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      },
      {
        id: 2,
        registration_id: 'OSINT-2026-B4M7P9',
        full_name: 'David Lightman',
        email: 'd.lightman@wargames.edu',
        phone: '+1 (555) 019-3342',
        college: 'Stanford Technology Institute',
        department: 'Computer Science',
        year_of_study: '4th Year (Senior)',
        technical_experience: 'Advanced (Used Maltego, Shodan, Recon-ng)',
        reason: 'Interested in threat actor profiling and automated OSINT pipelines.',
        status: 'confirmed',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY_REGS, JSON.stringify(seedRegs));
  }
}

initLocalStorageMock();

export class ApiService {
  static getAdminAuth(): AdminAuth | null {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static getAuthToken(): string | null {
    const auth = this.getAdminAuth();
    return auth ? auth.token : null;
  }

  static getAdminRole(): AdminRole | null {
    const auth = this.getAdminAuth();
    return auth ? auth.role : null;
  }

  // --- Public APIs ---
  static async getPublicConfig(): Promise<PublicConfigResponse> {
    try {
      const res = await fetch('/api/public/config');
      if (res.ok) {
        const json: ApiResponse<PublicConfigResponse> = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback to local storage mock
    }

    const settings: WorkshopSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || JSON.stringify(DEFAULT_WORKSHOP_SETTINGS));
    const allFields: FieldConfig[] = JSON.parse(localStorage.getItem(STORAGE_KEY_FIELDS) || JSON.stringify(DEFAULT_FIELD_CONFIGS));
    const regs: Registration[] = JSON.parse(localStorage.getItem(STORAGE_KEY_REGS) || '[]');

    const activeRegs = regs.filter((r) => r.status !== 'cancelled');
    const spots_left = Math.max(0, (settings.max_participants || 150) - activeRegs.length);

    return {
      settings,
      fields: allFields.filter((f) => f.enabled),
      registered_count: activeRegs.length,
      spots_left,
      is_open: settings.registration_open && spots_left > 0,
    };
  }

  static async registerParticipant(formData: Record<string, any>): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/public/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (res.ok && json.success) return json;
      if (!res.ok) return { success: false, error: json.error || 'Registration failed' };
    } catch {
      // Fallback to local storage mock
    }

    const settings: WorkshopSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || JSON.stringify(DEFAULT_WORKSHOP_SETTINGS));
    const fields: FieldConfig[] = JSON.parse(localStorage.getItem(STORAGE_KEY_FIELDS) || JSON.stringify(DEFAULT_FIELD_CONFIGS));
    const regs: Registration[] = JSON.parse(localStorage.getItem(STORAGE_KEY_REGS) || '[]');

    if (!settings.registration_open) {
      return { success: false, error: 'Registration is currently closed by the administrator.' };
    }

    // Validate required fields
    for (const f of fields) {
      if (f.enabled && f.required) {
        const val = formData[f.field_name];
        if (!val || (typeof val === 'string' && val.trim() === '')) {
          return { success: false, error: `${f.label} is required.` };
        }
      }
    }

    // Duplicate email check
    if (formData.email) {
      const exists = regs.some((r) => r.email.toLowerCase() === formData.email.trim().toLowerCase() && r.status !== 'cancelled');
      if (exists) {
        return { success: false, error: 'This email address is already registered for the workshop.' };
      }
    }

    const regId = generateRegistrationId();
    const newReg: Registration = {
      id: Date.now(),
      registration_id: regId,
      full_name: formData.full_name || 'Anonymous Participant',
      email: formData.email || '',
      phone: formData.phone || '',
      college: formData.college || '',
      department: formData.department || '',
      year_of_study: formData.year_of_study || '',
      technical_experience: formData.technical_experience || '',
      reason: formData.reason || '',
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    regs.unshift(newReg);
    localStorage.setItem(STORAGE_KEY_REGS, JSON.stringify(regs));

    return {
      success: true,
      message: 'Registration successful!',
      data: {
        registration_id: regId,
        full_name: newReg.full_name,
        email: newReg.email,
        workshop_name: settings.workshop_name,
        date: settings.date,
        time: settings.time,
        venue: settings.venue,
      },
    };
  }

  // --- Admin APIs ---
  static async adminLogin(password: string, requestedRole: AdminRole = 'super_admin'): Promise<ApiResponse<AdminAuth>> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role: requestedRole }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const authData: AdminAuth = {
          token: json.data.token,
          role: json.data.role || requestedRole,
          username: json.data.username || (json.data.role === 'super_admin' ? 'Super Administrator' : 'Event Moderator'),
        };
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authData));
        return { success: true, data: authData };
      }
      if (!res.ok && json.error) {
        return { success: false, error: json.error };
      }
    } catch {
      // Fallback local check
    }

    // Role-based local fallback check
    if (requestedRole === 'super_admin' && password === 'superadmin') {
      const authData: AdminAuth = {
        token: `admin-session-super-${Date.now()}`,
        role: 'super_admin',
        username: 'Super Administrator',
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authData));
      return { success: true, data: authData };
    }

    if (requestedRole === 'moderator' && password === 'moderator') {
      const authData: AdminAuth = {
        token: `admin-session-mod-${Date.now()}`,
        role: 'moderator',
        username: 'Event Moderator',
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authData));
      return { success: true, data: authData };
    }

    return {
      success: false,
      error: `Invalid password for ${requestedRole === 'super_admin' ? 'Super Admin' : 'Moderator'} role.`,
    };
  }

  static logoutAdmin() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }

  static isAdminLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  static async getAdminConfig(): Promise<{ settings: WorkshopSettings; fields: FieldConfig[] }> {
    const token = this.getAuthToken();
    try {
      const res = await fetch('/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback mock
    }

    const settings: WorkshopSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || JSON.stringify(DEFAULT_WORKSHOP_SETTINGS));
    const fields: FieldConfig[] = JSON.parse(localStorage.getItem(STORAGE_KEY_FIELDS) || JSON.stringify(DEFAULT_FIELD_CONFIGS));
    return { settings, fields };
  }

  static async saveAdminConfig(settings: WorkshopSettings, fields: FieldConfig[]): Promise<ApiResponse> {
    const role = this.getAdminRole();
    if (role === 'moderator') {
      return { success: false, error: 'Access Denied: Moderator role is read-only for workshop configuration.' };
    }

    // Validate required fields rule: cannot require a disabled field
    const validatedFields = fields.map((f) => ({
      ...f,
      required: f.enabled ? f.required : false,
    }));

    const token = this.getAuthToken();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings, fields: validatedFields }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json;
        if (!json.success && json.error) return { success: false, error: json.error };
      }
    } catch {
      // Fallback local storage update
    }

    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEY_FIELDS, JSON.stringify(validatedFields));

    return { success: true, message: 'Settings and field toggles saved successfully!' };
  }

  static async getRegistrations(): Promise<Registration[]> {
    const token = this.getAuthToken();
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Fallback mock
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEY_REGS) || '[]');
  }

  static async deleteRegistration(id: number | string): Promise<ApiResponse> {
    const role = this.getAdminRole();
    if (role === 'moderator') {
      return { success: false, error: 'Access Denied: Moderator role cannot delete registrations.' };
    }

    const token = this.getAuthToken();
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json;
      }
    } catch {
      // Fallback mock
    }

    const regs: Registration[] = JSON.parse(localStorage.getItem(STORAGE_KEY_REGS) || '[]');
    const updated = regs.filter((r) => r.id !== id && r.registration_id !== id);
    localStorage.setItem(STORAGE_KEY_REGS, JSON.stringify(updated));
    return { success: true, message: 'Registration deleted successfully' };
  }
}
