import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inicializar cliente
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos de datos
export interface Contact {
  id: string;
  name: string;
  nickname?: string;
  relation: string;
  avatar?: string;
  lastInteractionDate?: string;
  frequencyDays: number;
  location?: string;
  privateNotes?: string;
  interests: string[];
  birthday?: string;
}

export interface Interaction {
  id: string;
  contactId: string;
  type: 'meetup' | 'call' | 'message' | 'note';
  date: string;
  title: string;
  notes?: string;
  isPrivate: boolean;
  location?: string;
  contact?: Contact;
}

// --- LÓGICA DE BASE DE DATOS (SUPABASE PURO) ---

export const db = {
  // --- AUTH ---
  signInWithGoogle: async () => {
    const redirectUrl = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) throw error;
  },

  signInWithFacebook: async () => {
    const redirectUrl = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: redirectUrl,
      }
    });

    if (error) throw error;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getContacts: async (): Promise<Contact[]> => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('last_interaction_date', { ascending: true });

    if (error) {
      console.error('Supabase Error:', error);
      return [];
    }

    return (data || []).map(mapContactFromDB);
  },

  getContact: async (id: string): Promise<Contact | undefined> => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return mapContactFromDB(data);
  },

  addContact: async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
    const dbContact = {
      name: contact.name,
      nickname: contact.nickname,
      relation: contact.relation,
      avatar: contact.avatar,
      frequency_days: contact.frequencyDays,
      location: contact.location,
      private_notes: contact.privateNotes,
      interests: contact.interests,
      birthday: contact.birthday,
      last_interaction_date: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('contacts')
      .insert([dbContact])
      .select()
      .single();

    if (error) throw error;
    return mapContactFromDB(data);
  },

  getInteractions: async (contactId: string): Promise<Interaction[]> => {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('contact_id', contactId)
      .order('date', { ascending: false });

    if (error) return [];

    return data.map(mapInteractionFromDB);
  },

  getAllInteractions: async (): Promise<Interaction[]> => {
    const { data: interactions, error: intError } = await supabase
      .from('interactions')
      .select('*')
      .order('date', { ascending: false });

    if (intError) return [];

    const { data: contacts, error: contError } = await supabase
      .from('contacts')
      .select('id, name, avatar');

    if (contError) return [];

    const contactsMap = new Map((contacts || []).map((c: any) => [c.id, c]));

    return (interactions || []).map((i: any) => {
      const contactInfo = contactsMap.get(i.contact_id) as any;
      const mapped = mapInteractionFromDB(i);
      if (contactInfo) {
        mapped.contact = {
          id: contactInfo.id,
          name: contactInfo.name,
          avatar: contactInfo.avatar,
          relation: '',
          frequencyDays: 0,
          interests: []
        };
      }
      return mapped;
    });
  },

  addInteraction: async (interaction: Omit<Interaction, 'id'>): Promise<Interaction> => {
    const dbInteraction = {
      contact_id: interaction.contactId,
      type: interaction.type,
      date: interaction.date,
      title: interaction.title,
      notes: interaction.notes,
      is_private: interaction.isPrivate,
      location: interaction.location
    };

    const { data, error } = await supabase
      .from('interactions')
      .insert([dbInteraction])
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('contacts')
      .update({ last_interaction_date: interaction.date })
      .eq('id', interaction.contactId);

    return mapInteractionFromDB(data);
  }
};

// --- HELPERS ---

const mapContactFromDB = (c: any): Contact => ({
  id: c.id,
  name: c.name,
  nickname: c.nickname,
  relation: c.relation,
  avatar: c.avatar,
  lastInteractionDate: c.last_interaction_date,
  frequencyDays: c.frequency_days,
  location: c.location,
  privateNotes: c.private_notes,
  interests: c.interests || [],
  birthday: c.birthday
});

const mapInteractionFromDB = (i: any): Interaction => ({
  id: i.id,
  contactId: i.contact_id,
  type: i.type,
  date: i.date,
  title: i.title,
  notes: i.notes,
  isPrivate: i.is_private,
  location: i.location
});

export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return 'Nunca';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `hace ${diffDays}d`;
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)}sem`;
  return `hace ${Math.floor(diffDays / 30)}mes`;
};