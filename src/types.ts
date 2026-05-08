

export interface AppUser {
  id: string;
  username: string;
  email: string;
  is_admin: boolean; // Global admin (optional usage now)
  avatar_url?: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  created_by: string;
  created_at: string;
  is_public?: boolean;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at?: string;
  user_profiles?: {
    username: string;
    email: string;
  };
}

export interface WeeklyReading {
  id: string;
  created_at: string;
  room_id: string;
  reference: string;
  text: string;
  version: string;
  theme?: string;
  week_start_date: string;
  is_active?: boolean;
}

export interface Verse extends Omit<WeeklyReading, 'id' | 'created_at' | 'week_start_date' | 'room_id' | 'is_active'> {
  is_active?: boolean;
}

export interface Reflection {
  id: string;
  user_id: string;
  reading_id: string;
  user_profiles?: {
    username: string;
    email: string;
  };
  timestamp: number;
  text: string;
  acknowledged: boolean;
}

export enum AppView {
  HOME = 'HOME', // Now maps to "Read"
  REFLECTIONS = 'REFLECTIONS', // Now maps to "Reflect"
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE',
  USER_GUIDE = 'USER_GUIDE',
}

export const SUPPORTED_VERSIONS = ['NKJV', 'KJV', 'NIV', 'NLT', 'AMP', 'ESV', 'MSG'];
