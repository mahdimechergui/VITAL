import { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';

type Suggestion = {
  type: string;
  content: string;
  details?: Record<string, string | string[]>;
};

export default function ArchitectScreen() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      const normalized = input.toLowerCase();
      const generated: Suggestion[] = [];

      if (normalized.includes('react') || normalized.includes('workshop')) {
        generated.push(
          {
            type: 'date',
            content: 'Optimal Date: April 25, 2026 (Friday)',
            details: {
              reasoning:
                'Avoids exam week and Easter break. Fridays historically deliver higher participation.',
              alternatives: ['May 2, 2026', 'May 9, 2026'].join(', '),
            },
          },
          {
            type: 'venue',
            content: 'Recommended Venue: Amphitheater B, ISSATKR',
            details: {
              capacity: '80 seats',
              equipment: 'Projector, sound system, whiteboard',
              bookingCode: 'AMPHI-B-042526',
            },
          },
          {
            type: 'budget',
            content: 'Projected Budget: $450 - $600',
            details: {
              breakdown: 'Refreshments $200, Materials $100, Speaker $150, Buffer $50',
              historical: 'React Workshop 2025 cost: $520',
            },
          }
        );
      } else {
        generated.push({
          type: 'general',
          content: 'Try asking about planning workshops, hackathons, or sponsorship pitches.',
          details: {
            examples: 'Plan a React workshop, Organize a spring hackathon',
          },
        });
      }

      setSuggestions(generated);
      setProcessing(false);
    }, 1400);
  };

  return (
    <ScreenScrollView contentStyle={styles.content}>
      <ThemedText type="title" style={styles.title}>Architect Agent</ThemedText>
      <ThemedText style={styles.subtitle}>Strategic planning, budgeting, and scheduling recommendations.</ThemedText>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons size={22} color="#38bdf8" name="calendar-star" />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Smart Planning</ThemedText>
        </View>
        <ThemedText style={styles.cardBody}>Analyze timelines, venues, and budgets with AI guidance tailored for VITAL events.</ThemedText>
      </View>

      <View style={styles.formCard}>
        <ThemedText type="subtitle">Describe your event idea</ThemedText>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="e.g. Plan a React workshop for 60 members"
          placeholderTextColor="#64748b"
          multiline
          style={styles.input}
        />
        <Pressable style={[styles.button, processing && styles.buttonDisabled]} onPress={handleAnalyze} disabled={processing}>
          <MaterialCommunityIcons size={20} color="#000" name={processing ? 'progress-clock' : 'lightning-bolt'} />
          <ThemedText style={styles.buttonText}>{processing ? 'Analyzing…' : 'Analyze'}</ThemedText>
        </Pressable>
      </View>

      {suggestions.length > 0 && (
        <View style={styles.resultsSection}>
          <ThemedText type="subtitle">Recommendations</ThemedText>
          {suggestions.map((suggestion, index) => (
            <View key={`${suggestion.type}-${index}`} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <ThemedText type="defaultSemiBold">{suggestion.content}</ThemedText>
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>{suggestion.type.toUpperCase()}</ThemedText>
                </View>
              </View>
              {suggestion.details && Object.entries(suggestion.details).map(([key, value]) => (
                <ThemedText key={key} style={styles.resultDetail}>• {key}: {value}</ThemedText>
              ))}
            </View>
          ))}
        </View>
      )}
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
  card: {
    padding: 18,
    backgroundColor: '#0f1720',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardBody: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  formCard: {
    padding: 18,
    backgroundColor: '#0f1720',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  input: {
    minHeight: 120,
    marginTop: 12,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#e2e8f0',
    textAlignVertical: 'top',
    backgroundColor: '#020617',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#38bdf8',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
  },
  resultsSection: {
    marginTop: 20,
  },
  resultCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  resultDetail: {
    color: '#cbd5e1',
    lineHeight: 20,
    marginTop: 6,
  },
});
