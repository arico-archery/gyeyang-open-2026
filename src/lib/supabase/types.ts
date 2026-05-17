export type UserRole = "athlete" | "coach" | "judge" | "admin";
export type RegistrationStatus = "submitted" | "reviewing" | "approved" | "confirmed" | "rejected";
export type ScheduleType = "practice" | "qualification" | "elimination" | "ceremony" | "other";
export type AnnouncementPriority = "normal" | "important" | "urgent";
export type InquiryStatus = "pending" | "replied" | "closed";
export type PlaceCategory = "restaurant" | "cafe" | "convenience" | "hospital" | "pharmacy" | "atm" | "transport" | "tourism";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  full_name_en: string | null;
  nationality: string;
  team: string | null;
  category: string | null;
  birth_date: string | null;
  avatar_url: string | null;
  phone: string | null;
  qr_token: string | null;
  created_at: string;
}

export interface Registration {
  id: string;
  athlete_id: string;
  event_type: string;
  category: string;
  team_name: string | null;
  status: RegistrationStatus;
  registration_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  title: string;
  title_en: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  schedule_type: ScheduleType;
  description: string | null;
  sort_order: number;
}

export interface TargetAssignment {
  id: string;
  schedule_id: string;
  athlete_id: string;
  target_number: number;
  target_position: string | null;
  session: number;
}

export interface Announcement {
  id: string;
  title: string;
  title_en: string | null;
  content: string;
  content_en: string | null;
  priority: AnnouncementPriority;
  author_id: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  message: string;
  reply: string | null;
  replied_at: string | null;
  status: InquiryStatus;
  created_at: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  name_en: string | null;
  category: PlaceCategory;
  cuisine_type: string | null;
  address: string | null;
  address_en: string | null;
  lat: number | null;
  lng: number | null;
  distance_m: number | null;
  phone: string | null;
  hours: string | null;
  price_range: string | null;
  has_english_menu: boolean;
  has_halal: boolean;
  has_vegetarian: boolean;
  image_url: string | null;
  sort_order: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; role: UserRole; full_name: string; nationality: string }; Update: Partial<Profile> };
      registrations: { Row: Registration; Insert: Partial<Registration> & { athlete_id: string; event_type: string; category: string }; Update: Partial<Registration> };
      schedules: { Row: Schedule; Insert: Partial<Schedule> & { title: string; event_date: string; schedule_type: ScheduleType }; Update: Partial<Schedule> };
      target_assignments: { Row: TargetAssignment; Insert: Partial<TargetAssignment> & { schedule_id: string; athlete_id: string; target_number: number }; Update: Partial<TargetAssignment> };
      announcements: { Row: Announcement; Insert: Partial<Announcement> & { title: string; content: string; author_id: string }; Update: Partial<Announcement> };
      inquiries: { Row: Inquiry; Insert: Partial<Inquiry> & { user_id: string; category: string; subject: string; message: string }; Update: Partial<Inquiry> };
      nearby_places: { Row: NearbyPlace; Insert: Partial<NearbyPlace> & { name: string; category: PlaceCategory }; Update: Partial<NearbyPlace> };
    };
  };
}
