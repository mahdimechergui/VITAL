import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user' | 'member';

export interface User {
  id: string; // Supabase uses UUIDs
  name: string;
  role: UserRole;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, tokenData: string) => Promise<void>; // keeping signature for backwards compatibility temporarily
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session on mount
    const bootstrapAsync = async () => {
      console.log('🔐 [AUTH_CONTEXT] Fetching Supabase session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH_CONTEXT] Session fetch error:', error.message);
        } else if (session) {
          console.log('✅ [AUTH_CONTEXT] Session restored');
          handleSessionUpdate(session);
        } else {
          console.log('⚠️ [AUTH_CONTEXT] No stored session found');
        }
      } catch (e) {
        console.log('❌ [AUTH_CONTEXT] Failed to restore session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 [AUTH_CONTEXT] Auth state changed:', _event);
      handleSessionUpdate(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSessionUpdate = async (session: Session | null) => {
    if (session) {
      setToken(session.access_token);
      
      // Fetch custom user profile from Supabase 'users' table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || session.user.user_metadata?.name || '',
          role: profile.role as UserRole || 'member',
          email: session.user.email
        });
      } else {
        // Fallback if profile doesn't exist yet
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email || '',
          role: 'member',
          email: session.user.email
        });
      }
    } else {
      setToken(null);
      setUser(null);
    }
  };

  const login = async (userData: User, tokenData: string) => {
    // The actual login happens via supabase.auth.signInWithPassword now
    // This function is kept to avoid breaking changes in components temporarily
    console.log('🔐 [AUTH_CONTEXT] Legacy login called (should not be used extensively)');
    setToken(tokenData);
    setUser(userData);
  };

  const logout = async () => {
    console.log('🔐 [AUTH_CONTEXT] Logging out from Supabase...');
    try {
      await supabase.auth.signOut();
      console.log('✅ [AUTH_CONTEXT] Successfully signed out');
    } catch (e: any) {
      console.log('❌ [AUTH_CONTEXT] Failed to sign out:', e.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
