import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

export type UserRole = 'admin' | 'user' | 'member';

export interface User {
  id: number;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, tokenData: string) => Promise<void>;
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
      console.log('🔐 [AUTH_CONTEXT] Bootstrap starting...');
      try {
        console.log('🔐 [AUTH_CONTEXT] Checking AsyncStorage for stored session...');
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');

        console.log('🔐 [AUTH_CONTEXT] Stored token present:', !!storedToken);
        console.log('🔐 [AUTH_CONTEXT] Stored user present:', !!storedUser);

        if (storedToken && storedUser) {
          console.log('🔐 [AUTH_CONTEXT] Restoring session...');
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          console.log('✅ [AUTH_CONTEXT] Session restored successfully');
        } else {
          console.log('⚠️ [AUTH_CONTEXT] No stored session found');
        }
      } catch (e) {
        console.log('❌ [AUTH_CONTEXT] Failed to restore session:', e);
        console.log('❌ [AUTH_CONTEXT] Error details:', e.message);
      } finally {
        console.log('🔐 [AUTH_CONTEXT] Setting isLoading to false');
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (userData: User, tokenData: string) => {
    console.log('🔐 [AUTH_CONTEXT] Login function called');
    console.log('🔐 [AUTH_CONTEXT] User data:', userData);
    console.log('🔐 [AUTH_CONTEXT] Token data:', tokenData ? 'Present' : 'Missing');

    try {
      console.log('🔐 [AUTH_CONTEXT] Saving to AsyncStorage...');
      await AsyncStorage.setItem('userToken', tokenData);
      console.log('✅ [AUTH_CONTEXT] Token saved to AsyncStorage');

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('✅ [AUTH_CONTEXT] User data saved to AsyncStorage');

      console.log('🔐 [AUTH_CONTEXT] Updating state...');
      setToken(tokenData);
      setUser(userData);
      console.log('✅ [AUTH_CONTEXT] State updated successfully');

    } catch (e) {
      console.log('❌ [AUTH_CONTEXT] Error saving session:', e);
      console.log('❌ [AUTH_CONTEXT] Error details:', e.message);
      throw e; // Re-throw to let caller handle
    }
  };

  const logout = async () => {
    console.log('🔐 [AUTH_CONTEXT] Logout function called');
    try {
      console.log('🔐 [AUTH_CONTEXT] Clearing AsyncStorage...');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      console.log('✅ [AUTH_CONTEXT] AsyncStorage cleared');

      console.log('🔐 [AUTH_CONTEXT] Clearing state...');
      setToken(null);
      setUser(null);
      console.log('✅ [AUTH_CONTEXT] State cleared');
    } catch (e) {
      console.log('❌ [AUTH_CONTEXT] Failed to clear session:', e);
      console.log('❌ [AUTH_CONTEXT] Error details:', e.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
