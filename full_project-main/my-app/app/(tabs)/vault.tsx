import { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { vaultDocuments } from '@/app/data/vital-data';

const accessStyles = {
  'President Only': { color: '#f87171', background: '#381111' },
  'Board Only': { color: '#f59e0b', background: '#372c0e' },
  'Board + Finance': { color: '#38bdf8', background: '#0f1720' },
};

export default function VaultScreen() {
  const [search, setSearch] = useState('');
  const filtered = vaultDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) || doc.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenScrollView contentStyle={styles.content}>
      <ThemedText type="title" style={styles.title}>Secure Vault</ThemedText>
      <ThemedText style={styles.subtitle}>Encrypted documents and access control for board-level files.</ThemedText>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search secure documents"
        placeholderTextColor="#64748b"
        style={styles.input}
      />

      {filtered.map((doc) => {
        const access = accessStyles[doc.accessLevel as keyof typeof accessStyles] ?? accessStyles['Board + Finance'];
        return (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docHeader}>
              <MaterialCommunityIcons name="file-document-outline" size={18} color="#22d3ee" />
              <ThemedText type="defaultSemiBold">{doc.name}</ThemedText>
            </View>
            <ThemedText style={styles.docText}>{doc.type} • {doc.size}</ThemedText>
            <ThemedText style={styles.docText}>Uploaded by {doc.uploadedBy} on {doc.uploadDate}</ThemedText>
            <View style={[styles.accessPill, { backgroundColor: access.background }]}> 
              <ThemedText style={[styles.accessText, { color: access.color }]}>{doc.accessLevel}</ThemedText>
            </View>
          </View>
        );
      })}
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
  input: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#e2e8f0',
    backgroundColor: '#020617',
  },
  docCard: {
    padding: 18,
    backgroundColor: '#0f1720',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 16,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  docText: {
    color: '#cbd5e1',
    marginBottom: 6,
  },
  accessPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 10,
  },
  accessText: {
    fontSize: 11,
    fontWeight: '700',
  },
});