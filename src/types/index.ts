export type UserRole = 'SUPER_ADMIN' | 'COLLEGE_ADMIN' | 'STUDENT';

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
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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
  eventDate: string;
  lastRegistrationDate: string;
  collegeId: string;
  collegeName: string;
  type: string;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  registrationDate: string;
  event?: Event;
}
