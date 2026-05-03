import { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { archivistExampleQueries } from '@/app/data/vital-data';
import { askArchivist } from '@/app/services/api';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { useRouter } from 'expo-router';



export default function ArchivistScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [usedDataRows, setUsedDataRows] = useState<number>(0);
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setAiResponse(null);
    setStatus(`Retrieving historical context for: "${query}"...`);
    try {
      const result = await askArchivist(query);
      console.log("Archivist API Result:", result);
      setAiResponse(result.answer || "No response received.");
      setUsedDataRows(result.used_data);
      setStatus(null);
    } catch (e: any) {
      Alert.alert("Archivist Error", e.message);
      setStatus(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <BackgroundEffects />
      
      <View style={styles.subpageHeader}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#f8fafc" />
        </Pressable>
        <ThemedText style={styles.subpageTitle}>Archivist Agent</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScreenScrollView contentStyle={styles.content}>
        <ThemedText style={styles.subtitle}>Search club knowledge using retrieval-augmented intelligence.</ThemedText>

      <View style={styles.formCard}>
        <ThemedText type="subtitle">Query the archives</ThemedText>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ask about past events, budgets, or partner feedback"
          placeholderTextColor="#64748b"
          style={styles.input}
        />
        <Pressable style={[styles.button, searching && styles.buttonDisabled]} onPress={handleSearch} disabled={searching}>
          <MaterialCommunityIcons name={searching ? 'progress-clock' : 'magnify'} size={20} color="#000" />
          <ThemedText style={styles.buttonText}>{searching ? 'Searching…' : 'Search Archives'}</ThemedText>
        </Pressable>
      </View>

      {status && (
        <View style={styles.statusBox}>
          <ActivityIndicator size="small" color="#f472b6" />
          <ThemedText style={styles.statusText}>{status}</ThemedText>
        </View>
      )}

      {aiResponse !== null && (
        <View style={styles.resultsSection}>
            <View style={styles.resultCard}>
              <View style={styles.resultTitleRow}>
                <ThemedText type="defaultSemiBold">Archivist Response</ThemedText>
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>Context Extracted: {usedDataRows}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.resultMeta}>Knowledge Retrieval Active</ThemedText>
              <ThemedText style={styles.resultText}>{aiResponse}</ThemedText>
              <View style={styles.tagsRow}>
                 <View style={styles.tag}><ThemedText style={styles.tagText}>Generative Insight</ThemedText></View>
                 <View style={styles.tag}><ThemedText style={styles.tagText}>Llama-3.3-70b</ThemedText></View>
              </View>
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
  subpageHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20, 
    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
    borderBottomWidth: 1, 
    borderBottomColor: '#1e293b' 
  },
  backButton: { padding: 8, marginLeft: -8 },
  subpageTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  formCard: {
    padding: 18,
    backgroundColor: 'rgba(15, 23, 32, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 16,
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 16,
    fontSize: 14,
  },
  input: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#e2e8f0',
    backgroundColor: '#020617',
    marginBottom: 14,
  },
  button: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#f472b6',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
  },
  resultsSection: {
    marginTop: 8,
  },
  resultCard: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  resultTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  resultMeta: {
    color: '#94a3b8',
    marginBottom: 10,
  },
  resultText: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  tagText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#33415555',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f472b6',
  },
  statusText: {
    color: '#f472b6',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});