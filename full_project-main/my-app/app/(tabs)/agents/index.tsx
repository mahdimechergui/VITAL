import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Pressable, TextInput, FlatList, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';

type AgentType = 'architect' | 'liaison' | 'archivist';

interface HistoryEntry {
  id: string;
  query: string;
  response: string;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: HistoryEntry[];
}

export default function AgentsIndex() {
  const [activeAgent, setActiveAgent] = useState<AgentType>('architect');
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.agent && ['architect', 'liaison', 'archivist'].includes(params.agent as string)) {
      setActiveAgent(params.agent as AgentType);
    }
  }, [params.agent]);

  const [inputText, setInputText] = useState('');
  
  const [sessions, setSessions] = useState<Record<AgentType, ChatSession[]>>({
    architect: [
      { id: '1', title: 'Neon Night Setup', date: 'Today', messages: [{ id: 'm1', query: 'Plan a neon party', response: 'Generating date, budget, and venue for:\n"Plan a neon party"' }] },
      { id: '2', title: 'VIP Guest List', date: 'Yesterday', messages: [{ id: 'm2', query: 'Organize VIPs', response: 'Generating date, budget, and venue for:\n"Organize VIPs"' }] }
    ],
    liaison: [],
    archivist: []
  });

  const [activeSessionIds, setActiveSessionIds] = useState<Record<AgentType, string | null>>({
    architect: '1',
    liaison: null,
    archivist: null
  });

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);

  const agents = {
    architect: { label: 'Architect', placeholder: 'Plan an event...', output: 'Generating date, budget, and venue for:\n' },
    liaison: { label: 'Liaison', placeholder: 'Describe your event...', output: 'Generating caption, email, and styles for:\n' },
    archivist: { label: 'Archivist', placeholder: 'Ask about past events...', output: 'Retrieving historical context for:\n' },
  };

  const currentSessionId = activeSessionIds[activeAgent];
  const currentSession = currentSessionId ? sessions[activeAgent].find(s => s.id === currentSessionId) : null;
  const currentHistory = currentSession ? currentSession.messages : [];

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    
    const query = inputText.trim();
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      query: query,
      response: agents[activeAgent].output + `"${query}"`,
    };

    if (!currentSessionId) {
      const newSession: ChatSession = { id: Date.now().toString(), title: query, date: 'Just now', messages: [newEntry] };
      setSessions(prev => ({
        ...prev,
        [activeAgent]: [newSession, ...prev[activeAgent]]
      }));
      setActiveSessionIds(prev => ({
        ...prev,
        [activeAgent]: newSession.id
      }));
    } else {
      setSessions(prev => ({
        ...prev,
        [activeAgent]: prev[activeAgent].map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, newEntry] } : s)
      }));
    }
    
    setInputText('');
  };

  const startNewChat = () => {
    setActiveSessionIds(prev => ({ ...prev, [activeAgent]: null }));
    setIsHistoryModalOpen(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <ThemedText type="title" style={styles.title}>AI Hub</ThemedText>
          <Pressable onPress={() => setIsHistoryModalOpen(true)} style={styles.historyBtn}>
            <MaterialCommunityIcons name="history" size={24} color="#a855f7" />
          </Pressable>
        </View>
        <ThemedText style={styles.subtitle}>The central AI interface for VITAL.</ThemedText>
      </View>

      <View style={styles.navbarContainer}>
        {(Object.keys(agents) as Array<keyof typeof agents>).map((key) => {
          const isActive = activeAgent === key;
          return (
            <Pressable
              key={key}
              style={[styles.navTab, isActive && styles.navTabActive]}
              onPress={() => setActiveAgent(key)}
            >
              <ThemedText type="defaultSemiBold" style={[styles.navTabText, isActive && styles.navTabTextActive]}>
                {agents[key].label}
              </ThemedText>
              {isActive && <View style={styles.navIndicator} />}
            </Pressable>
          );
        })}
      </View>

      <FlatList
        ref={flatListRef}
        data={currentHistory}
        keyExtractor={(item) => item.id}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="robot-outline" size={48} color="#1f2937" />
            <ThemedText style={styles.emptyTitle}>How can I help you today?</ThemedText>
            <ThemedText style={styles.emptySubtitle}>{agents[activeAgent].label} is ready.</ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.chatBlock}>
            <View style={styles.userBubble}>
              <ThemedText style={styles.userBubbleText}>{item.query}</ThemedText>
            </View>
            <View style={styles.aiBubble}>
              <ThemedText style={styles.aiBubbleText}>{item.response}</ThemedText>
            </View>
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder={agents[activeAgent].placeholder}
          placeholderTextColor="#64748b"
          multiline
          value={inputText}
          onChangeText={setInputText}
        />
        <Pressable 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
          onPress={handleGenerate}
          disabled={!inputText.trim()}
        >
          <MaterialCommunityIcons name="arrow-up" size={20} color={inputText.trim() ? '#fff' : '#64748b'} />
        </Pressable>
      </View>

      <Modal visible={isHistoryModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={{ color: '#e2e8f0' }}>Past Chats ({agents[activeAgent].label})</ThemedText>
              <Pressable onPress={() => setIsHistoryModalOpen(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>
            
            <Pressable style={styles.newChatBtn} onPress={startNewChat}>
              <MaterialCommunityIcons name="plus" size={20} color="#fff" />
              <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>Start New Chat</ThemedText>
            </Pressable>
            
            <FlatList
              data={sessions[activeAgent]}
              keyExtractor={s => s.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <Pressable 
                  style={[styles.sessionItem, currentSessionId === item.id && styles.sessionItemActive]}
                  onPress={() => {
                    setActiveSessionIds(prev => ({ ...prev, [activeAgent]: item.id }));
                    setIsHistoryModalOpen(false);
                  }}
                >
                  <MaterialCommunityIcons 
                    name="message-outline" 
                    size={20} 
                    color={currentSessionId === item.id ? '#a855f7' : '#64748b'} 
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <ThemedText 
                      type="defaultSemiBold" 
                      style={{ color: currentSessionId === item.id ? '#fff' : '#cbd5e1' }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: '#64748b' }}>{item.date}</ThemedText>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <ThemedText style={styles.emptyHistoryText}>No past chats found.</ThemedText>
              }
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
  },
  historyBtn: {
    padding: 6,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: 8,
  },
  subtitle: {
    color: '#94a3b8',
  },
  navbarContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  navTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
    borderRadius: 8,
  },
  navTabActive: {
    backgroundColor: '#111827',
  },
  navTabText: {
    color: '#64748b',
  },
  navTabTextActive: {
    color: '#a855f7',
    textShadowColor: 'rgba(168, 85, 247, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  navIndicator: {
    position: 'absolute',
    bottom: -1,
    height: 2,
    width: '100%',
    backgroundColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#64748b',
    fontSize: 14,
  },
  chatBlock: {
    marginBottom: 24,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#7c3aed',
    padding: 14,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: '85%',
    marginBottom: 12,
  },
  userBubbleText: {
    color: '#fff',
    lineHeight: 22,
    fontSize: 15,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1f2937',
    padding: 14,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  aiBubbleText: {
    color: '#e2e8f0',
    lineHeight: 22,
    fontSize: 15,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#050508',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    color: '#e2e8f0',
    fontSize: 15,
    minHeight: 48,
    maxHeight: 120,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#1f2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f1720',
    height: '75%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'center',
    gap: 8,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    marginBottom: 10,
  },
  sessionItemActive: {
    backgroundColor: '#2e1065',
    borderColor: '#a855f7',
    borderWidth: 1,
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 40,
    fontStyle: 'italic',
  },
});
