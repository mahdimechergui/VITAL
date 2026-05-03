import { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';

const defaultPalette = ['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

export default function LiaisonScreen() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ instagram?: string; email?: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setResult({
        instagram: `🚀 Exciting News!\n\n${input}\n\nJoin us for an unforgettable experience! ✨\n\n#TPLClub #ISSATKR #TechCommunity #Innovation`,
        email: `Subject: Partnership Opportunity - ${input.split(' ').slice(0, 5).join(' ')}\n\nDear Team,\n\nWe are planning an event around ${input}. We would love to partner with your organization for sponsorship and support.\n\nBest regards,\nTPL Club`,
      });
      setIsGenerating(false);
    }, 1600);
  };

  return (
    <ScreenScrollView contentStyle={styles.content}>
      <ThemedText type="title" style={styles.title}>Liaison Agent</ThemedText>
      <ThemedText style={styles.subtitle}>Create branded social and outreach content instantly.</ThemedText>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="send-circle" size={22} color="#c084fc" />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Brand Messaging</ThemedText>
        </View>
        <ThemedText style={styles.cardBody}>Generate event emails, social captions, and color palettes that fit the VITAL cyberpunk theme.</ThemedText>
      </View>

      <View style={styles.formCard}>
        <ThemedText type="subtitle">Event Brief</ThemedText>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Describe the campaign, event, or announcement"
          placeholderTextColor="#64748b"
          multiline
          style={styles.input}
        />
        <Pressable style={[styles.button, isGenerating && styles.buttonDisabled]} onPress={handleGenerate} disabled={isGenerating}>
          <MaterialCommunityIcons name={isGenerating ? 'progress-clock' : 'palette'} size={20} color="#000" />
          <ThemedText style={styles.buttonText}>{isGenerating ? 'Generating…' : 'Generate Content'}</ThemedText>
        </Pressable>
      </View>

      {result.instagram && result.email && (
        <View style={styles.resultsSection}>
          <ThemedText type="subtitle">Generated Copy</ThemedText>
          <View style={styles.resultCard}>
            <ThemedText type="defaultSemiBold">Instagram Post</ThemedText>
            <ThemedText style={styles.resultText}>{result.instagram}</ThemedText>
          </View>
          <View style={styles.resultCard}>
            <ThemedText type="defaultSemiBold">Sponsorship Email</ThemedText>
            <ThemedText style={styles.resultText}>{result.email}</ThemedText>
          </View>
          <View style={styles.paletteRow}>
            {defaultPalette.map((color) => (
              <View key={color} style={[styles.paletteSwatch, { backgroundColor: color }]} />
            ))}
          </View>
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
    backgroundColor: '#c084fc',
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
  resultText: {
    marginTop: 10,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  paletteRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  paletteSwatch: {
    flex: 1,
    height: 44,
    borderRadius: 14,
  },
});
