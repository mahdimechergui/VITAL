import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { securityLogs } from '@/app/data/vital-data';

export default function SentinelScreen() {
  return (
    <ScreenScrollView contentStyle={styles.content}>
      <ThemedText type="title" style={styles.title}>Security Center</ThemedText>
      <ThemedText style={styles.subtitle}>Monitor logs, alerts, and access with the security guard for VITAL.</ThemedText>

      <View style={styles.statGrid}>
        <View style={[styles.statCard, { borderColor: '#16a34a' }]}>
          <MaterialCommunityIcons name="shield-check" size={20} color="#22c55e" />
          <ThemedText type="defaultSemiBold" style={styles.statValue}>1,247</ThemedText>
          <ThemedText style={styles.statLabel}>Passed Checks</ThemedText>
        </View>
        <View style={[styles.statCard, { borderColor: '#f97316' }]}>
          <MaterialCommunityIcons name="alert" size={20} color="#fb923c" />
          <ThemedText type="defaultSemiBold" style={styles.statValue}>2</ThemedText>
          <ThemedText style={styles.statLabel}>Active Alerts</ThemedText>
        </View>
        <View style={[styles.statCard, { borderColor: '#ef4444' }]}>
          <MaterialCommunityIcons name="shield-off" size={20} color="#f87171" />
          <ThemedText type="defaultSemiBold" style={styles.statValue}>11</ThemedText>
          <ThemedText style={styles.statLabel}>Threats Blocked</ThemedText>
        </View>
        <View style={[styles.statCard, { borderColor: '#06b6d4' }]}>
          <MaterialCommunityIcons name="lock" size={20} color="#38bdf8" />
          <ThemedText type="defaultSemiBold" style={styles.statValue}>E2EE</ThemedText>
          <ThemedText style={styles.statLabel}>Encryption Active</ThemedText>
        </View>
      </View>

      <View style={styles.chartCard}>
        <ThemedText type="subtitle">Threat Activity</ThemedText>
        <View style={styles.chartPlaceholder}>
          <ThemedText style={styles.chartText}>Graph preview: login attempts vs blocked threats</ThemedText>
        </View>
      </View>

      <View style={styles.logSection}>
        <ThemedText type="subtitle">Recent Security Events</ThemedText>
        {securityLogs.map((log) => (
          <View key={log.id} style={[styles.logCard, log.severity === 'high' ? styles.highSeverity : log.severity === 'medium' ? styles.mediumSeverity : styles.lowSeverity]}>
            <View style={styles.logHeader}>
              <ThemedText type="defaultSemiBold">{log.event}</ThemedText>
              <ThemedText style={styles.logStatus}>{log.status.toUpperCase()}</ThemedText>
            </View>
            <ThemedText style={styles.logDetail}>{log.user} • {log.location}</ThemedText>
            <ThemedText style={styles.logDetail}>{log.timestamp} • {log.ip}</ThemedText>
          </View>
        ))}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#050508',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 16,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#0f1720',
    marginBottom: 12,
  },
  statValue: {
    marginTop: 12,
    fontSize: 24,
  },
  statLabel: {
    marginTop: 6,
    color: '#94a3b8',
    fontSize: 12,
  },
  chartCard: {
    padding: 18,
    backgroundColor: '#0f1720',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 20,
  },
  chartPlaceholder: {
    marginTop: 16,
    height: 180,
    borderRadius: 18,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  logSection: {
    marginTop: 12,
  },
  logCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logStatus: {
    color: '#94a3b8',
    fontSize: 11,
  },
  logDetail: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  highSeverity: {
    borderColor: '#ef4444',
  },
  mediumSeverity: {
    borderColor: '#f97316',
  },
  lowSeverity: {
    borderColor: '#22c55e',
  },
});