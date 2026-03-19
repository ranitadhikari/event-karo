const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventkaro-backened.onrender.com';

// ── Types ────────────────────────────────────────────

export interface PublicCollege {
  _id: string;
  name: string;
  city: string;
  description: string;
  logo?: string;
  email?: string;
  status: string;
}

export interface PublicEvent {
  _id: string;
  title: string;
  description?: string;
  venue: string;
  city?: string;
  eventDate: string;
  posters: string[];
  category?: string;
  status: string;
  price?: number;
  college?: { _id: string; name: string; city?: string } | string;
}

export interface CollegeWithEvents {
  college: PublicCollege;
  events: PublicEvent[];
}

// ── API Functions ────────────────────────────────────

/** Fetch all approved colleges (public) */
export async function getColleges(): Promise<PublicCollege[]> {
  const res = await fetch(`${BASE_URL}/api/college/public`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch colleges');
  return res.json();
}

/** Fetch a single college with its upcoming events (public) */
export async function getCollegeById(id: string): Promise<CollegeWithEvents> {
  const res = await fetch(`${BASE_URL}/api/college/public/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch college');
  return res.json();
}

/** Fetch all events for the public events page */
export async function getAllEvents(): Promise<PublicEvent[]> {
  const res = await fetch(`${BASE_URL}/api/event/public`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

/** Fetch a single event by its ID from the public list */
export async function getEventById(id: string): Promise<PublicEvent | null> {
  const events = await getAllEvents();
  return events.find(e => e._id === id) ?? null;
}

/** Submit an enquiry for an event */
export async function submitEnquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  eventId: string;
}): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/event-registration/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit enquiry');
  }
}

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

export interface EventEnquiriesResponse {
  event: string;
  college: string;
  enquiries: Enquiry[];
}

/** Fetch all enquiries for a specific event (college admin only) */
export async function getEventEnquiries(eventId: string, token: string): Promise<EventEnquiriesResponse> {
  const res = await fetch(`${BASE_URL}/api/event-registration/event/${eventId}/enquiries`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch enquiries');
  return res.json();
}

/** Fetch all events for superadmin (requires auth token) */
export async function getSuperAdminEvents(token: string): Promise<PublicEvent[]> {
  const res = await fetch(`${BASE_URL}/api/event/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}
