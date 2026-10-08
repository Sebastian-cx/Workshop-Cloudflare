export type AdminRole = 'super_admin' | 'moderator';

export interface AdminAuth {
  token: string;
  role: AdminRole;
  username: string;
}

export interface WorkshopSettings {
  workshop_name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  registration_fee: string;
  registration_deadline: string;
  max_participants: number;
  contact_info: string;
  workshop_banner: string;
  registration_open: boolean;

  // Toggle flags for info items
  toggle_workshop_name: boolean;
  toggle_description: boolean;
  toggle_date: boolean;
  toggle_time: boolean;
  toggle_venue: boolean;
  toggle_organizer: boolean;
  toggle_registration_fee: boolean;
  toggle_registration_deadline: boolean;
  toggle_max_participants: boolean;
  toggle_workshop_banner: boolean;
  toggle_contact_info: boolean;
}

export type FieldName = 
  | 'full_name'
  | 'email'
  | 'phone'
  | 'college'
  | 'department'
  | 'year_of_study'
  | 'technical_experience'
  | 'reason';

export interface FieldConfig {
  field_name: FieldName;
  label: string;
  placeholder: string;
  enabled: boolean;
  required: boolean;
  order_index: number;
  field_type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  options?: string[];
}

export interface Registration {
  id: number;
  registration_id: string;
  full_name: string;
  email: string;
  phone?: string;
  college?: string;
  department?: string;
  year_of_study?: string;
  technical_experience?: string;
  reason?: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  ip_address?: string;
  created_at: string;
}

export interface RegistrationSubmitInput {
  full_name?: string;
  email?: string;
  phone?: string;
  college?: string;
  department?: string;
  year_of_study?: string;
  technical_experience?: string;
  reason?: string;
  turnstileToken?: string;
}

export interface PublicConfigResponse {
  settings: WorkshopSettings;
  fields: FieldConfig[];
  registered_count: number;
  spots_left: number;
  is_open: boolean;
}

export interface AdminStats {
  totalRegistrations: number;
  confirmedCount: number;
  spotsLeft: number;
  collegesCount: number;
  collegeBreakdown: Record<string, number>;
  departmentBreakdown: Record<string, number>;
  latestRegistrations: Registration[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
