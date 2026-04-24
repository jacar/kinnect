import { auth, db, googleProvider } from './firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  setDoc
} from "firebase/firestore";

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
  userId: string;
}

export interface Interaction {
  id: string;
  contactId: string;
  userId: string;
  type: 'meetup' | 'call' | 'message' | 'note';
  date: string;
  title: string;
  notes?: string;
  isPrivate: boolean;
  location?: string;
  contact?: Partial<Contact>;
}

// --- LÓGICA DE BASE DE DATOS (FIREBASE) ---

export const db_service = {
  // --- AUTH ---
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  },

  signInWithEmail: async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  signUpWithEmail: async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  signOut: async () => {
    await firebaseSignOut(auth);
  },

  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },

  // --- FIRESTORE ---
  getContacts: async (): Promise<Contact[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "contacts"),
      where("userId", "==", user.uid),
      orderBy("lastInteractionDate", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Contact));
  },

  getContact: async (id: string): Promise<Contact | undefined> => {
    const docRef = doc(db, "contacts", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Contact;
    }
    return undefined;
  },

  addContact: async (contact: Omit<Contact, 'id' | 'userId'>): Promise<Contact> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    const newContact = {
      ...contact,
      userId: user.uid,
      lastInteractionDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "contacts"), newContact);
    return { id: docRef.id, ...newContact } as Contact;
  },

  getInteractions: async (contactId: string): Promise<Interaction[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "interactions"),
      where("contactId", "==", contactId),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Interaction));
  },

  getAllInteractions: async (): Promise<Interaction[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "interactions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const interactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Interaction));

    // Fetch contacts for names/avatars
    const contactsQ = query(collection(db, "contacts"), where("userId", "==", user.uid));
    const contactsSnapshot = await getDocs(contactsQ);
    const contactsMap = new Map(contactsSnapshot.docs.map(d => [d.id, d.data()]));

    return interactions.map(i => {
      const contactData = contactsMap.get(i.contactId);
      if (contactData) {
        i.contact = {
          id: i.contactId,
          name: contactData.name,
          avatar: contactData.avatar
        };
      }
      return i;
    });
  },

  addInteraction: async (interaction: Omit<Interaction, 'id' | 'userId'>): Promise<Interaction> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    const newInteraction = {
      ...interaction,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "interactions"), newInteraction);
    
    // Update last interaction date in contact
    const contactRef = doc(db, "contacts", interaction.contactId);
    await updateDoc(contactRef, {
      lastInteractionDate: interaction.date
    });

    return { id: docRef.id, ...newInteraction } as Interaction;
  }
};

// Rename for compatibility with existing imports
export const db_legacy = db_service;
export { db_service as db };
export { auth as supabase }; // Fake export to minimize changes in App.tsx if possible, but better to fix App.tsx

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