import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/supabaseClient';
import { BASE_URL } from '@/app/services/api';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    console.log('🔐 [GOOGLE_AUTH] useEffect triggered');
    console.log('🔐 [GOOGLE_AUTH] Response type:', response?.type);
    console.log('🔐 [GOOGLE_AUTH] Response data:', response);

    if (response?.type === 'success') {
      console.log('✅ [GOOGLE_AUTH] Google auth successful');
      const idToken = response.authentication?.idToken;
      console.log('🔐 [GOOGLE_AUTH] ID Token present:', !!idToken);

      if (idToken) {
        console.log('🔐 [GOOGLE_AUTH] Calling handleGoogleAuth...');
        handleGoogleAuth(idToken);
      } else {
        console.log('❌ [GOOGLE_AUTH] No ID token found in response');
      }
    } else if (response?.type === 'error') {
      console.log('❌ [GOOGLE_AUTH] Google auth error:', response.error);
    } else if (response?.type === 'cancel') {
      console.log('⚠️ [GOOGLE_AUTH] Google auth cancelled by user');
    }
  }, [response]);

  const handleGoogleAuth = async (idToken: string) => {
    console.log('🔐 [GOOGLE_AUTH] handleGoogleAuth called');
    setIsLoading(true);

    try {
      console.log('🔐 [GOOGLE_AUTH] Authenticating with Supabase...');
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;
      
      console.log('✅ [GOOGLE_AUTH] Google auth successful');

      // Create/update user profile if needed
      if (data.user) {
        await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.email,
            avatar_url: data.user.user_metadata?.avatar_url,
            role: 'member'
          }, { onConflict: 'id' });
      }

      console.log('🔐 [GOOGLE_AUTH] Navigating to /(tabs)...');
      router.replace('/(tabs)');

    } catch (e: any) {
      console.log('❌ [GOOGLE_AUTH] Error occurred:', e.message);
      Alert.alert('Google Auth Error', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async () => {
    console.log('🔐 [AUTH] Starting authentication process...');

    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('🔐 [AUTH] Attempting Supabase sign-in...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        console.log('✅ [AUTH] Supabase sign-in successful');
      } else {
        console.log('🔐 [AUTH] Attempting Supabase sign-up...');
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            }
          }
        });

        if (error) throw error;
        console.log('✅ [AUTH] Supabase sign-up successful');
        
        // If email confirmation is required, handle it here
        if (data.session === null) {
          Alert.alert('Success', 'Please check your inbox for email verification!');
          setIsLoading(false);
          return;
        }
        
        // Create user profile in 'users' table
        if (data.user) {
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: name.trim(),
              role: 'member'
            });
            
          if (profileError) {
            console.error('Failed to create user profile:', profileError);
          }
        }
      }

      console.log('🔐 [AUTH] Navigating to /(tabs)...');
      router.replace('/(tabs)');
      
    } catch (e: any) {
      console.log('❌ [AUTH] Error occurred:', e.message);
      Alert.alert('Authentication Error', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {isLogin ? 'Sign in to access your dashboard' : 'Join to access events and more'}
        </ThemedText>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#64748b"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#64748b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable 
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} 
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </ThemedText>
          )}
        </Pressable>

        <Pressable 
          style={({ pressed }) => [styles.googleButton, pressed && styles.buttonPressed]} 
          onPress={() => promptAsync()}
          disabled={!request || isLoading}
        >
          <ThemedText type="defaultSemiBold" style={styles.googleButtonText}>
            Continue with Google
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
          <ThemedText style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#0f1720',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    color: '#e2e8f0',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#a855f7',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  googleButtonText: {
    color: '#0f1720',
    fontSize: 16,
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: '#a855f7',
    fontSize: 14,
  },
});
