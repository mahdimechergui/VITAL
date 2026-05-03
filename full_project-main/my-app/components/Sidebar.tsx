import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { key: 'index', label: 'Daily Feed', icon: 'view-dashboard-outline', route: '/(tabs)' },
  { key: 'events', label: 'Events', icon: 'calendar-month', route: '/(tabs)/events' },
  { key: 'admin', label: 'Admin Dashboard', icon: 'shield-account', route: '/(tabs)/admin' },
  { key: 'vault', label: 'Vault', icon: 'shield-lock-outline', route: '/(tabs)/vault' },
  { key: 'sentinel', label: 'Security Center', icon: 'shield-check', route: '/(tabs)/agents/sentinel' },
  { key: 'settings', label: 'Settings', icon: 'cog-outline', route: '/(tabs)/settings' },
] as const;

const drawerWidth = Math.min(Dimensions.get('window').width * 0.72, 300);

export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const router = useRouter();
  const segments = useSegments() as readonly string[];
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const activeKey = useMemo(() => {
    const last = segments[segments.length - 1] ?? 'index';
    if (last === '(tabs)') return 'index';
    if (last === 'sentinel') return 'sentinel';
    if (segments.includes('agents')) return 'agents';
    return last;
  }, [segments]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: open ? 0 : -drawerWidth,
        duration: 240,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: open ? 0.55 : 0,
        duration: 240,
        useNativeDriver: false,
      }),
    ]).start();
  }, [open, translateX, overlayOpacity]);

  const handleNavigate = (route: typeof navItems[number]['route']) => {
    setOpen(false);
    router.push(route as any);
  };

  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (user?.role === 'admin') {
      return ['admin', 'vault', 'sentinel', 'settings'].includes(item.key);
    }
    return ['index', 'events', 'settings'].includes(item.key);
  });

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Animated.View pointerEvents={open ? 'auto' : 'none'} style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
      </Animated.View>

      <Animated.View style={[styles.drawer, { width: drawerWidth, transform: [{ translateX }] }]}> 
        <View style={[styles.drawerContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}> 

          {filteredNavItems.map((item) => {
            const active = item.key === activeKey;
            return (
              <Pressable
                key={item.key}
                onPress={() => handleNavigate(item.route)}
                style={({ pressed }) => [
                  styles.itemButton,
                  active && { backgroundColor: theme.tint + '18' },
                  pressed && styles.itemButtonPressed,
                ]}
              >
                <View style={[styles.iconBox, active && { backgroundColor: theme.tint + '22' }]}> 
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={active ? theme.tint : '#94a3b8'} />
                </View>
                <View style={styles.itemLabelWrapper}>
                  <Text style={[styles.itemLabel, active && { color: theme.tint }]}>{item.label}</Text>
                </View>
              </Pressable>
            );
          })}
          
          <View style={{ flex: 1 }} />
          
          <Pressable
            onPress={async () => {
              setOpen(false);
              await logout();
              router.replace('/login');
            }}
            style={({ pressed }) => [
              styles.itemButton,
              { marginTop: 10, borderTopWidth: 1, borderTopColor: '#1f2937', paddingTop: 20 },
              pressed && styles.itemButtonPressed,
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: '#3f1111' }]}> 
              <MaterialCommunityIcons name="logout" size={22} color="#fca5a5" />
            </View>
            <View style={styles.itemLabelWrapper}>
              <Text style={[styles.itemLabel, { color: '#fca5a5' }]}>Logout</Text>
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
  hamburgerButton: {
    position: 'absolute',
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 20,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(8, 10, 14, 0.96)',
    borderRightWidth: 1,
    borderRightColor: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 24,
    zIndex: 25,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 16,
  },

  itemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  itemButtonPressed: {
    opacity: 0.9,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  itemLabelWrapper: {
    marginLeft: 14,
    flex: 1,
  },
  itemLabel: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
});
