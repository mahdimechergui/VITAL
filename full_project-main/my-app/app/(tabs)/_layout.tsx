import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Slot, useSegments, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const segments = useSegments() as readonly string[];
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const { user } = useAuth();

  const currentTitle = useMemo(() => {
    const last = segments[segments.length - 1] ?? '(tabs)';
    if (last === '(tabs)' || last === 'index') return 'Home';
    if (last === 'agents' || segments.includes('agents')) return 'AI Hub';
    if (last === 'events') return 'Events';
    if (last === 'members') return 'Members';
    if (last === 'vault') return 'Vault';
    if (last === 'admin') return 'Admin Dashboard';
    if (last === 'sentinel') return 'Security Center';
    return last.charAt(0).toUpperCase() + last.slice(1);
  }, [segments]);

  const router = useRouter();

  // Route Guard for RBAC
  useEffect(() => {
    if (!user) return;
    
    const last = segments[segments.length - 1] ?? '(tabs)';

    if (user.role === 'admin') {
      if (last === '(tabs)' || last === 'index') {
        router.replace('/(tabs)/admin');
      }
    } else {
      const adminRoutes = ['members', 'vault', 'agents', 'sentinel', 'admin'];
      if (adminRoutes.includes(last)) {
        router.replace('/(tabs)');
      }
    }
  }, [user, segments]);

  useEffect(() => {
    Animated.timing(buttonOpacity, {
      toValue: menuOpen ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [menuOpen, buttonOpacity]);

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
      <View style={styles.container}>


        <View style={styles.body}>
          <Slot />
        </View>


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050508',
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#050508',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    backgroundColor: 'rgba(8, 10, 14, 0.96)',
    zIndex: 15,
  },
  hamburgerContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hamburgerButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
    flex: 1,
  },
  body: {
    flex: 1,
  },
});
