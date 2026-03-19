export type UserRole = 'superadmin' | 'collegeadmin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  collegeId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface College {
  id: string;
  name: string;
  email: string;
  city: string;
  state?: string;
  country: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  website?: string;
  address?: string;
  phone?: string;
  about?: string;
  logo?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  tagline?: string;
  eventDate: string;
  lastRegistrationDate: string;
  collegeId: string;
  collegeName: string;
  city: string;
  state?: string;
  type: string;
  poster?: string;
  prizePool?: string;
  isFeatured?: boolean;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  registrationDate: string;
  event?: Event;
}
