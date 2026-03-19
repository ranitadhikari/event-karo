import { BASE_URL } from './api';
import { Sponsor } from '@/types';

export interface CreateSponsorData {
  name: string;
  logo: string;
  website: string;
  tier: 'title' | 'gold' | 'silver' | 'bronze';
}

// Use the exact base URL specified by the user
const SPONSOR_BASE_URL = 'https://eventkaro-backened.onrender.com/api';

export async function createSponsor(token: string, data: CreateSponsorData): Promise<Sponsor> {
  const url = `${SPONSOR_BASE_URL}/sponsor`;
  console.log('Creating sponsor at:', url);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Create sponsor failed:', res.status, errorText);
    try {
      const error = JSON.parse(errorText);
      throw new Error(error.message || 'Failed to create sponsor');
    } catch {
      throw new Error(`Error ${res.status}: Failed to create sponsor`);
    }
  }

  return res.json();
}

export async function getSponsors(token?: string): Promise<Sponsor[]> {
  const url = `${SPONSOR_BASE_URL}/sponsor`;
  console.log('Fetching all sponsors from:', url, token ? '(with token)' : '(public)');

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Fetch sponsors failed:', res.status, text);
      throw new Error(`Failed to fetch sponsors: ${res.status}`);
    }

    const data = await res.json();
    console.log('Sponsors fetched successfully:', data);
    return data;
  } catch (err) {
    console.error('getSponsors error:', err);
    throw err;
  }
}

export async function assignSponsor(token: string, sponsorId: string, eventId: string): Promise<{ message: string }> {
  const url = `${SPONSOR_BASE_URL}/sponsor/assign`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sponsorId, eventId }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to assign sponsor' }));
    throw new Error(error.message || 'Failed to assign sponsor');
  }

  return res.json();
}

export async function getEventSponsors(eventId: string): Promise<Sponsor[]> {
  const url = `${SPONSOR_BASE_URL}/sponsor/event/${eventId}`;
  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch event sponsors');
  }

  return res.json();
}
