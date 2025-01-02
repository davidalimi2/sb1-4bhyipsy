export interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  location: string;
  practice_areas: string[];
  years_experience: number;
  cases_won: number;
  hourly_rate: number;
  rating: number;
  languages: string[];
  bar_number: string;
  bar_state: string;
  availability: 'immediate' | 'within_week' | 'within_month' | 'unavailable';
  bio: string;
  education: {
    school: string;
    degree: string;
    year: number;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface LawyerFilters {
  practiceArea?: string;
  experienceLevel?: 'junior' | 'mid' | 'senior';
  maxRate?: number;
  minRating?: string;
  availability?: string;
  language?: string;
  location?: string;
  searchQuery?: string;
}