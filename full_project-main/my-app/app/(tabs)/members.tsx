import { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, Alert, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { MemberRecord } from '@/app/data/vital-data';
import { fetchMembers, deleteMember, updateMemberRole, blockMember, unblockMember } from '@/app/services/api';
import { useAuth } from '@/context/AuthContext';

const roleStyles = {
  President: { background: '#0f1720', color: '#06b6d4' },
  'Vice President': { background: '#0f1720', color: '#a855f7' },
  Treasurer: { background: '#0f1720', color: '#ec4899' },
  'Events Coordinator': { background: '#0f1720', color: '#f97316' },
  Member: { background: '#0f1720', color: '#94a3b8' },
};

export default function MembersScreen() {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMembers()
      .then(setMembers)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = members.filter((member) =>
    [(member.name || ''), (member.email || ''), (member.role || '')].some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteUser = async (id: string | number) => {
    Alert.alert('Delete User', 'Are you sure you want to permanently delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteMember(id);
            setMembers(prev => prev.filter(m => m.id !== id));
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
      }}
    ]);
  };

  const handleUpdateRole = async (id: string | number, newRole: string) => {
    try {
      await updateMemberRole(id, newRole);
      setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    } catch (e: any) {
      Alert.alert('Failed to update role', e.message);
    }
  };

  const handleBlockUser = async (id: string | number) => {
    Alert.alert('Blacklist User', 'Are you sure you want to permanently blacklist this user? They will not be able to log in.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Blacklist', style: 'destructive', onPress: async () => {
          try {
            await blockMember(id);
            setMembers(prev => prev.map(m => m.id === id ? { ...m, is_blacklisted: true, status: 'banned' } : m));
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
      }}
    ]);
  };

  const handleUnblockUser = async (id: string | number) => {
      try {
        await unblockMember(id);
        setMembers(prev => prev.map(m => m.id === id ? { ...m, is_blacklisted: false, status: 'active' } : m));
      } catch (e: any) {
        Alert.alert('Error', e.message);
      }
  };

  return (
    <ScreenScrollView contentStyle={styles.content}>
      <ThemedText type="title" style={styles.title}>Members</ThemedText>
      <ThemedText style={styles.subtitle}>Club directory, roles, and access information.</ThemedText>

      <View style={styles.searchRow}>
        <MaterialCommunityIcons name="magnify" size={20} color="#64748b" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search members by name, email, or role"
          placeholderTextColor="#64748b"
          style={styles.input}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#a855f7" style={{ marginTop: 40 }} />
      ) : (
        <>
          {filtered.map((member) => {
        const style = roleStyles[member.role as keyof typeof roleStyles] ?? roleStyles.Member;
        return (
          <View key={member.id} style={[styles.profileCard, member.is_blacklisted && { borderColor: '#ef444455', backgroundColor: '#1f0d0d' }]}>
            <View style={styles.headerRow}>
              <Text style={[{ color: '#fff', fontSize: 16, fontWeight: '600' }, member.is_blacklisted && { textDecorationLine: 'line-through', color: '#94a3b8' }]}>{member.name}</Text>
              
              {member.is_blacklisted ? (
                <View style={[styles.rolePill, { backgroundColor: '#450a0a' }]}> 
                  <Text style={[styles.roleText, { color: '#f87171' }]}>BLACKLISTED</Text>
                </View>
              ) : (
                <View style={[styles.rolePill, { backgroundColor: style.background }]}> 
                  <Text style={[styles.roleText, { color: style.color }]}>{member.role}</Text>
                </View>
              )}
            </View>
            <ThemedText style={styles.detailText}>{member.email}</ThemedText>
            <ThemedText style={styles.detailText}>{member.phone}</ThemedText>
            <View style={styles.metaRow}>
              <ThemedText style={styles.metaText}>{member.department}</ThemedText>
              <ThemedText style={styles.metaText}>{member.year}</ThemedText>
              <ThemedText style={styles.metaText}>{member.joinDate}</ThemedText>
            </View>

            {user?.role === 'admin' && (
              <View style={styles.actionsBox}>
                {!member.is_blacklisted ? (
                  <>
                    {member.role === 'admin' ? (
                      <Pressable style={styles.actionBtn} onPress={() => handleUpdateRole(member.id, 'member')}>
                        <MaterialCommunityIcons name="account-arrow-down" size={18} color="#fcd34d" />
                      </Pressable>
                    ) : (
                      <Pressable style={styles.actionBtn} onPress={() => handleUpdateRole(member.id, 'admin')}>
                        <MaterialCommunityIcons name="account-arrow-up" size={18} color="#34d399" />
                      </Pressable>
                    )}
                    
                    <Pressable style={[styles.actionBtn, { borderColor: '#ef444455' }]} onPress={() => handleDeleteUser(member.id)}>
                      <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
                    </Pressable>

                    <Pressable style={[styles.actionBtn, { borderColor: '#f87171', backgroundColor: '#450a0a' }]} onPress={() => handleBlockUser(member.id)}>
                      <MaterialCommunityIcons name="cancel" size={18} color="#f87171" />
                      <Text style={[styles.actionBtnText, { color: '#f87171' }]}>Blacklist</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable style={[styles.actionBtn, { borderColor: '#34d399', backgroundColor: '#064e3b' }]} onPress={() => handleUnblockUser(member.id)}>
                      <MaterialCommunityIcons name="check-decagram" size={18} color="#34d399" />
                      <Text style={[styles.actionBtnText, { color: '#34d399' }]}>Restore</Text>
                    </Pressable>

                    <Pressable style={[styles.actionBtn, { borderColor: '#ef444455' }]} onPress={() => handleDeleteUser(member.id)}>
                      <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
                    </Pressable>
                  </>
                )}
              </View>
            )}
          </View>
        );
      })}
        </>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: '#e2e8f0',
  },
  profileCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#0f1720',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailText: {
    color: '#cbd5e1',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  metaText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  actionsBox: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
    marginTop: 12,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});