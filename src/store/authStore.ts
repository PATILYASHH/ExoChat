import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  displayName: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setDisplayName: (name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  displayName: null,
  loading: true,
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always clear the local state
      set({ user: null, displayName: null });
    }
  },
  initialize: async () => {
    try {
      // Get the initial session
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null });

      // Set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            set({ user: null, displayName: null });
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            set({ user: session?.user ?? null });
          }
        }
      );

      // Clean up on error or completion
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Reset state on error
      set({ user: null, displayName: null });
    } finally {
      // Always set loading to false
      set({ loading: false });
    }
  },
  setDisplayName: async (name: string) => {
    const { user } = get();
    if (!user) return;
    
    // We'll update this once we have the profiles table
    set({ displayName: name });
  },
}));