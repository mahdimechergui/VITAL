import { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import * as Haptics from 'expo-haptics';
import { Alert, Dimensions } from 'react-native';
import { BackgroundEffects } from '@/components/BackgroundEffects';

import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { fetchEvents, fetchMembers } from '@/app/services/api';
import { EventItem, MemberRecord } from '@/app/data/vital-data';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const COLUMNS = 3;
const ICON_SIZE = (width - GRID_PADDING * 2 - (COLUMNS - 1) * 16) / COLUMNS;

const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseEventDateRange(dateString: string) {
  if (!dateString) return { startDate: new Date(NaN), endDate: new Date(NaN) };
  const trimmed = dateString.trim();
  
  // Handle range format: "Month Start-End, Year"
  const rangeMatch = trimmed.match(/^(\w+)\s+(\d+)-(\d+),\s*(\d{4})$/);
  if (rangeMatch) {
    const [_, month, start, end, year] = rangeMatch;
    const startDate = new Date(`${month} ${start}, ${year}`);
    const endDate = new Date(`${month} ${end}, ${year}`);
    return { startDate, endDate };
  }

  // Handle standard date strings / ISO strings
  const date = new Date(trimmed);
  return { startDate: date, endDate: date };
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isDateInRange(date: Date, start: Date, end: Date) {
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  
  return d >= s && d <= e;
}

// Metrics configuration is now handled inside the component to be dynamic

const agentCards: { route: any, label: string, icon: string }[] = [
  { route: '/agents?agent=architect', label: 'Architect', icon: 'brain' },
  { route: '/agents?agent=liaison', label: 'Liaison', icon: 'message-text-outline' },
  { route: '/agents?agent=archivist', label: 'Archivist', icon: 'database' },
  { route: '/agents/sentinel', label: 'Security Center', icon: 'shield-check' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogoutConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Logout', 'Are you sure you want to end your session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/login');
        } 
      }
    ]);
  };

  const NavIcon = ({ icon, color, label, onPress }: { icon: any, color: string, label: string, onPress: () => void }) => (
    <Pressable 
      style={styles.navIconWrapper} 
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={[styles.navIconContainer, { shadowColor: color }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <ThemedText style={styles.navIconLabel}>{label}</ThemedText>
    </Pressable>
  );

  useEffect(() => {
    Promise.all([fetchEvents(), fetchMembers()])
      .then(([evts, mbrs]) => {
        setEvents(evts);
        setMembers(mbrs);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const today = new Date();
  const currentWeek = useMemo(() => {
    const start = new Date(today);
    const day = today.getDay();
    // Adjust to Monday (1). If Sunday (0), move back 6 days.
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [today.toDateString()]);

  const eventRanges = events.map(e => {
    const { startDate, endDate } = parseEventDateRange(e.date);
    return { event: e, startDate, endDate };
  });

  const activeMembers = members.filter(m => m.status === 'active').length;
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const eventsThisMonth = eventRanges.filter(r => {
    return (r.startDate.getMonth() === currentMonth && r.startDate.getFullYear() === currentYear) ||
           (r.endDate.getMonth() === currentMonth && r.endDate.getFullYear() === currentYear);
  }).length;

  const dashboardMetrics = [
    { label: 'Active Members', value: activeMembers.toString(), icon: 'account-group-outline', accent: '#38bdf8', detail: 'Live count' },
    { label: 'Events This Month', value: eventsThisMonth.toString(), icon: 'calendar-month', accent: '#a855f7', detail: 'Scheduled' },
    { label: 'Security Alerts', value: '0', icon: 'shield-alert-outline', accent: '#f97316', detail: 'System normal' },
  ];

  return (
    <View style={StyleSheet.absoluteFill}>
      <BackgroundEffects />
      <ScreenScrollView contentStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>Club Vital Signs</ThemedText>
        <ThemedText style={styles.subtitle}>
          {user?.role === 'admin' 
            ? 'Overview of health, AI operations, and next actions.' 
            : 'Your personalized club dashboard and upcoming events.'}
        </ThemedText>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={{ marginBottom: 4 }}>This Week's Schedule</ThemedText>
        {isLoading ? (
            <ActivityIndicator size="small" color="#a855f7" style={{ marginTop: 20, marginBottom: 20 }} />
        ) : (
        <View style={styles.scheduleRow}>
          {currentWeek.map((day: Date, idx: number) => {
            const isToday = isSameDate(day, today);
            const dayEvents = eventRanges.filter(r => isDateInRange(day, r.startDate, r.endDate));
            const hasEvent = dayEvents.length > 0;
            
            return (
              <Pressable 
                key={idx}
                onPress={() => router.push('/events')}
                style={({ pressed }) => [
                  styles.scheduleDay,
                  isToday && styles.scheduleToday,
                  hasEvent && !isToday && styles.scheduleDayWithEvent,
                  pressed && { opacity: 0.75 }
                ]}
              >
                <ThemedText style={[styles.scheduleDayName, isToday && styles.scheduleTodayText]}>{dayNamesShort[day.getDay()]}</ThemedText>
                <ThemedText style={[styles.scheduleDayNumber, isToday && styles.scheduleTodayText]}>{day.getDate()}</ThemedText>
                
                <View style={styles.indicatorContainer}>
                  {hasEvent && <View style={[styles.scheduleEventDot, { backgroundColor: '#38bdf8' }]} />}
                  {isToday && <View style={[styles.scheduleEventDot, { backgroundColor: '#22c55e' }]} />}
                </View>
              </Pressable>
            );
          })}
        </View>
        )}
      </View>

      <View style={styles.metricsGrid}>
        {dashboardMetrics.filter(m => user?.role === 'admin' || m.label !== 'Security Alerts').map((metric) => (
          <View key={metric.label} style={[styles.metricCard, { borderColor: metric.accent }]}> 
            <View style={[styles.metricIcon, { backgroundColor: `${metric.accent}20` }]}>
              <MaterialCommunityIcons name={metric.icon as any} size={20} color={metric.accent} />
            </View>
            <ThemedText type="defaultSemiBold" style={styles.metricValue}>{metric.value}</ThemedText>
            <ThemedText style={styles.metricLabel}>{metric.label}</ThemedText>
            <ThemedText style={styles.metricDetail}>{metric.detail}</ThemedText>
          </View>
        ))}
      </View>

      {user?.role === 'admin' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">AI Assistants</ThemedText>
            <ThemedText style={styles.sectionHint}>Tap a card to open its agent.</ThemedText>
          </View>
          <View style={styles.grid}>
            {agentCards.map((card) => (
              <Pressable
                key={card.route}
                onPress={() => router.push(card.route)}
                style={({ pressed }) => [styles.agentCard, pressed && styles.agentCardPressed]}
              >
                <View style={styles.agentIcon}>
                  <MaterialCommunityIcons name={card.icon as any} size={22} color="#a855f7" />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.agentLabel}>{card.label}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Member Launcher Grid (for non-admins) */}
      {user?.role !== 'admin' && (
        <View style={styles.section}>
          <ThemedText type="subtitle" style={{ marginBottom: 16 }}>Member Hub</ThemedText>
          <View style={styles.navGrid}>
            <NavIcon icon="calendar-month" color="#3b82f6" label="Events" onPress={() => router.push('/events')} />
            <NavIcon icon="cog" color="#94a3b8" label="Settings" onPress={() => router.push('/settings')} />
            <NavIcon icon="logout" color="#ef4444" label="Logout" onPress={handleLogoutConfirm} />
          </View>
        </View>
      )}

      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#050508',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    marginBottom: 6,
    color: '#fff',
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 24,
  },
  navGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navIconWrapper: {
    width: ICON_SIZE,
    alignItems: 'center',
  },
  navIconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE * 0.9,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  navIconLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 24,
  },
  scheduleDay: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 72,
  },
  scheduleToday: {
    borderColor: '#a855f7',
    backgroundColor: '#2e1065',
  },
  scheduleDayWithEvent: {
    borderColor: '#0284c7',
    backgroundColor: '#0c4a6e',
  },
  scheduleDayName: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 2,
    fontWeight: '600',
  },
  scheduleDayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  scheduleTodayText: {
    color: '#fff',
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 6,
    gap: 4,
  },
  scheduleEventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: '#0f1720',
    marginBottom: 16,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    marginBottom: 6,
  },
  metricLabel: {
    color: '#cbd5e1',
    marginBottom: 6,
  },
  metricDetail: {
    color: '#94a3b8',
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionHint: {
    color: '#64748b',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  agentCard: {
    width: '48%',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 16,
  },
  agentCardPressed: {
    opacity: 0.85,
  },
  agentIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  agentLabel: {
    fontSize: 16,
  },
});
