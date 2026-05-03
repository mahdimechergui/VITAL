import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
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
    console.log('🔐 [GOOGLE_AUTH] ID Token present:', !!idToken);
    console.log('🔐 [GOOGLE_AUTH] ID Token length:', idToken.length);

    setIsLoading(true);

    const googleAuthUrl = `${BASE_URL}/auth/google`;
    console.log('🔐 [GOOGLE_AUTH] Making request to:', googleAuthUrl);

    try {
      console.log('🔐 [GOOGLE_AUTH] Sending POST request...');
      const res = await fetch(googleAuthUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      console.log('🔐 [GOOGLE_AUTH] Response received');
      console.log('🔐 [GOOGLE_AUTH] Response status:', res.status);
      console.log('🔐 [GOOGLE_AUTH] Response ok:', res.ok);

      const data = await res.json();
      console.log('🔐 [GOOGLE_AUTH] Response data:', data);

      if (!res.ok) {
        console.log('❌ [GOOGLE_AUTH] Response not ok, throwing error');
        throw new Error(data.message || 'Google Authentication failed');
      }

      console.log('✅ [GOOGLE_AUTH] Google auth successful');
      console.log('🔐 [GOOGLE_AUTH] Calling login function...');
      await login(data.user, data.token);
      console.log('✅ [GOOGLE_AUTH] Login completed');

      console.log('🔐 [GOOGLE_AUTH] Navigating to /(tabs)...');
      router.replace('/(tabs)');
      console.log('✅ [GOOGLE_AUTH] Navigation completed');

    } catch (e: any) {
      console.log('❌ [GOOGLE_AUTH] Error occurred:', e);
      console.log('❌ [GOOGLE_AUTH] Error message:', e.message);
      console.log('❌ [GOOGLE_AUTH] Error stack:', e.stack);
      Alert.alert('Google Auth Error', e.message);
    } finally {
      console.log('🔐 [GOOGLE_AUTH] Setting loading to false');
      setIsLoading(false);
    }
  };

  const handleAuth = async () => {
    console.log('🔐 [AUTH] Starting authentication process...');
    console.log('🔐 [AUTH] Form data:', {
      isLogin,
      email: email.trim(),
      hasPassword: !!password,
      hasName: !!name
    });

    if (!email || !password || (!isLogin && !name)) {
      console.log('❌ [AUTH] Validation failed: Missing required fields');
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    console.log('🔐 [AUTH] Validation passed, setting loading state...');
    setIsLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const fullUrl = `${BASE_URL}${endpoint}`;

    console.log('🔐 [AUTH] Making request to:', fullUrl);
    console.log('🔐 [AUTH] Request method: POST');
    console.log('🔐 [AUTH] Request headers:', { 'Content-Type': 'application/json' });

    const requestBody = isLogin
      ? { email: email.trim(), password }
      : { name: name.trim(), email: email.trim(), password };

    console.log('🔐 [AUTH] Request body:', requestBody);

    try {
      console.log('🔐 [AUTH] Sending fetch request...');
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('🔐 [AUTH] Response received!');
      console.log('🔐 [AUTH] Response status:', response.status);
      console.log('🔐 [AUTH] Response statusText:', response.statusText);
      console.log('🔐 [AUTH] Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('🔐 [AUTH] Response data:', data);

      if (!response.ok) {
        console.log('❌ [AUTH] Response not OK, throwing error...');
        throw new Error(data.message || 'Authentication failed');
      }

      console.log('✅ [AUTH] Authentication successful!');
      console.log('✅ [AUTH] User data:', data.user);
      console.log('✅ [AUTH] Token received:', !!data.token);

      console.log('🔐 [AUTH] Calling login function...');
      await login(data.user, data.token);
      console.log('✅ [AUTH] Login function completed');

      console.log('🔐 [AUTH] Navigating to /(tabs)...');
      router.replace('/(tabs)');
      console.log('✅ [AUTH] Navigation completed');

    } catch (e: any) {
      console.log('❌ [AUTH] Error occurred:', e);
      console.log('❌ [AUTH] Error message:', e.message);
      console.log('❌ [AUTH] Error stack:', e.stack);
      Alert.alert('Authentication Error', e.message);
    } finally {
      console.log('🔐 [AUTH] Setting loading to false');
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
