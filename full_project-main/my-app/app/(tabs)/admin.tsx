import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, RefreshControl, Modal, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import * as Haptics from 'expo-haptics';
import { fetchMembers, fetchEvents, deleteMember, updateMemberRole, blockMember, unblockMember, adminDeleteEvent, adminCreateEvent, adminUpdateEvent, generateAiEvent, fetchSponsors, createSponsor, updateSponsor, deleteSponsor, fetchVaultFiles, uploadVaultFile, downloadVaultFile, deleteVaultFile, fetchEventRequests, approveRequest, rejectRequest } from '@/app/services/api';
import { MemberRecord, EventItem } from '@/app/data/vital-data';

type AppType = 'events' | 'sponsors' | 'users' | 'vault' | 'settings' | null;

const { width } = Dimensions.get('window');
const GRID_PADDING = 24;
const COLUMNS = 4;
const ICON_SIZE = (width - GRID_PADDING * 2 - (COLUMNS - 1) * 12) / COLUMNS;

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  // OS State
  const [activeApp, setActiveApp] = useState<AppType>(null);

  // Data State
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals & Forms remain identical as they pop globally
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', budget: '' });
  const [eventRequests, setEventRequests] = useState<any[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [manageRequestsVisible, setManageRequestsVisible] = useState(false);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [requestsEventId, setRequestsEventId] = useState<number | null>(null);

  const [sponsorModalVisible, setSponsorModalVisible] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const [sponsorForm, setSponsorForm] = useState({ name: '', email: '', phone: '', company: '', amount: '' });

  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiIdea, setAiIdea] = useState('');
  const [aiParticipants, setAiParticipants] = useState('30');
  const [aiLoading, setAiLoading] = useState(false);

  const loadData = async () => {
    try {
      const [membersData, eventsData, sponsorsData, vaultData] = await Promise.all([fetchMembers(), fetchEvents(), fetchSponsors(), fetchVaultFiles()]);
      setMembers(membersData);
      setEvents(eventsData);
      setSponsors(sponsorsData);
      setVaultFiles(vaultData);

      // System Intelligence: Calculate total pending participation requests
      const allRequests = await Promise.all(eventsData.map(e => fetchEventRequests(e.id)));
      const totalPending = allRequests.flat().filter(r => r.status === 'pending').length;
      setPendingRequestsCount(totalPending);
    } catch (e: any) {
      console.log('Error loading data', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  // --- CRUD Functions (Identical to before) ---
  const handleUpdateRole = async (id: number, newRole: string) => {
    try { await updateMemberRole(id, newRole); setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m)); } catch (e: any) {}
  };

  const handleDeleteUser = async (id: number) => {
    Alert.alert('Delete User', 'Permanently delete?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteMember(id); setMembers(prev => prev.filter(m => m.id !== id)); } catch (e: any) {} }}]);
  };

  const handleBlockUser = async (id: number) => {
    Alert.alert('Blacklist', 'Blacklist user?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Blacklist', style: 'destructive', onPress: async () => { try { await blockMember(id); setMembers(prev => prev.map(m => m.id === id ? { ...m, is_blacklisted: true, status: 'banned' } : m)); } catch (e: any) {} }}]);
  };

  const handleUnblockUser = async (id: number) => {
      try { await unblockMember(id); setMembers(prev => prev.map(m => m.id === id ? { ...m, is_blacklisted: false, status: 'active' } : m)); } catch (e: any) {}
  };

  const handleDeleteEvent = async (id: number) => {
    Alert.alert('Delete Event', 'Permanently delete?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { try { await adminDeleteEvent(id); setEvents(prev => prev.filter(e => e.id !== id)); } catch (e: any) {} }}]);
  };

  const handleDeleteSponsor = async (id: number) => {
    Alert.alert('Delete Sponsor', 'Delete this sponsor?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteSponsor(id); setSponsors(prev => prev.filter(s => s.id !== id)); } catch (e: any) {} }}]);
  };

  const handleUploadFile = async () => {
    try { const result = await DocumentPicker.getDocumentAsync({ type: '*/*' }); if (result.canceled || !result.assets || result.assets.length === 0) return; const asset = result.assets[0]; setLoading(true); await uploadVaultFile(asset.uri, asset.name, asset.mimeType || 'application/octet-stream'); loadData(); } catch (e: any) { Alert.alert("Upload Error", e.message); setLoading(false); }
  };

  const handleDownloadFile = async (id: string, name: string) => {
    try { Alert.alert("Decrypting", "AES-256 secure streaming..."); await downloadVaultFile(id, name); } catch (e: any) { Alert.alert("Download Error", e.message); }
  };

  const handleDeleteFile = async (id: string) => {
    Alert.alert('Delete Secure File', 'This ciphertext will be destroyed.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Destroy', style: 'destructive', onPress: async () => { try { await deleteVaultFile(id); setVaultFiles(prev => prev.filter(f => f.file_id !== id)); } catch (e: any) {} }}]);
  };

  const openEventModal = async (event: EventItem | null = null) => {
    if (event) { 
      setEditingEvent(event); 
      setEventForm({ title: event.name, description: 'Created by Admin', date: new Date().toISOString().split('T')[0], location: event.venue || '', budget: event.budget?.toString() || '0' }); 
      setModalVisible(true); 
    } else { 
      setEditingEvent(null); 
      setEventForm({ title: '', description: '', date: new Date().toISOString().split('T')[0], location: '', budget: '' }); 
      setModalVisible(true); 
    }
  };

  const openManageRequests = async (eventId: number) => {
    setRequestsEventId(eventId);
    setManageRequestsVisible(true);
    setIsRequestsLoading(true);
    try {
      const res = await fetchEventRequests(eventId);
      setEventRequests(res);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsRequestsLoading(false);
    }
  };

  const handleApproveRequest = async (reqId: number) => { 
    try { 
      await approveRequest(reqId); 
      // Refresh current list
      if (requestsEventId) fetchEventRequests(requestsEventId).then(setEventRequests);
      // Refresh global state
      loadData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) { Alert.alert('Error', e.message); } 
  };
  const handleRejectRequest = async (reqId: number) => { 
    try { 
      await rejectRequest(reqId); 
      if (requestsEventId) fetchEventRequests(requestsEventId).then(setEventRequests);
      loadData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) { Alert.alert('Error', e.message); } 
  };

  const openSponsorModal = (sponsor: any = null) => { if (sponsor) { setEditingSponsor(sponsor); setSponsorForm({ name: sponsor.name || '', email: sponsor.email || '', phone: sponsor.phone || '', company: sponsor.company || '', amount: sponsor.amount?.toString() || '0' }); } else { setEditingSponsor(null); setSponsorForm({ name: '', email: '', phone: '', company: '', amount: '' }); } setSponsorModalVisible(true); };

  const saveEvent = async () => { if (!eventForm.title || !eventForm.date) { Alert.alert('Error', 'Title/Date required'); return; } let validDate; try { const d = new Date(eventForm.date); if (isNaN(d.getTime())) throw new Error(); validDate = d.toISOString(); } catch { Alert.alert('Invalid Date Format'); return; } try { const payload = { title: eventForm.title, description: eventForm.description, date: validDate, location: eventForm.location, budget: parseFloat(eventForm.budget) || 0 }; if (editingEvent) { await adminUpdateEvent(editingEvent.id, payload); } else { await adminCreateEvent(payload); } setModalVisible(false); loadData(); } catch (e: any) { Alert.alert('Error', e.message); } };

  const saveSponsor = async () => { if (!sponsorForm.name) { Alert.alert('Error', 'Name required'); return; } try { const payload = { name: sponsorForm.name, email: sponsorForm.email, phone: sponsorForm.phone, company: sponsorForm.company, amount: parseFloat(sponsorForm.amount) || 0 }; if (editingSponsor) { await updateSponsor(editingSponsor.id, payload); } else { await createSponsor(payload); } setSponsorModalVisible(false); loadData(); } catch (e: any) { Alert.alert('Error', e.message); } };

  const { logout } = useAuth();
  const handleLogoutConfirm = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to exit the VITAL Admin Workspace?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => await logout() }
      ]
    );
  };

  const handleAiGeneration = async () => { if (!aiIdea) return; setAiLoading(true); try { const generatedData = await generateAiEvent(aiIdea, aiParticipants); setEditingEvent(null); setEventForm({ title: generatedData.title || '', description: generatedData.recommendations && generatedData.recommendations.length > 0 ? "AI Recommendations:\n• " + generatedData.recommendations.join("\n• ") : '', date: generatedData.suggested_date || new Date().toISOString().split('T')[0], location: generatedData.room || '', budget: generatedData.budget_tnd?.toString() || '0' }); setAiModalVisible(false); setAiIdea(''); setModalVisible(true); } catch (e: any) { Alert.alert('AI Failed', e.message); } finally { setAiLoading(false); } };

  // --- UI Components ---

  const SubpageHeader = ({ title, rightAction }: { title: string, rightAction?: React.ReactNode }) => (
    <View style={styles.subpageHeader}>
      <Pressable onPress={() => setActiveApp(null)} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#f8fafc" />
      </Pressable>
      <Text style={styles.subpageTitle}>{title}</Text>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{rightAction}</View>
    </View>
  );

  const AppGridIcon = ({ icon, color, title, onPress, badge }: { icon: any, color: string, title: string, onPress: () => void, badge?: number }) => (
    <Pressable 
      style={styles.appIconWrapper} 
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={[styles.appIconContainer, { shadowColor: color }]}>
        <MaterialCommunityIcons name={icon} size={32} color={color} />
        {badge && badge > 0 ? (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.appIconText}>{title}</Text>
    </Pressable>
  );

  if (user?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#ef4444', textAlign: 'center', marginTop: 100 }}>Access Denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      {loading ? (
        <ActivityIndicator size="large" color="#a855f7" style={{ marginTop: 40 }} />
      ) : activeApp === null ? (
        // LAUNCHER GRID (HOME)
        <View style={styles.launcherScreen}>
          <View style={styles.launcherHero}>
            <MaterialCommunityIcons name="shield-crown" size={56} color="#a855f7" style={styles.heroLogo} />
            <Text style={styles.heroTitle}>Admin OS</Text>
            <Text style={styles.heroSubtitle}>VITAL Workspace</Text>
          </View>
          
          <View style={styles.fullScreenGrid}>
            <View style={styles.gridContainer}>
              <AppGridIcon icon="calendar-star" color="#3b82f6" title="Events" onPress={() => setActiveApp('events')} badge={pendingRequestsCount} />
              <AppGridIcon icon="handshake" color="#fbbf24" title="Sponsors" onPress={() => setActiveApp('sponsors')} />
              <AppGridIcon icon="account-group" color="#10b981" title="Users" onPress={() => setActiveApp('users')} />
              <AppGridIcon icon="shield-lock" color="#ef4444" title="File Vault" onPress={() => setActiveApp('vault')} />
              
              <AppGridIcon icon="magic-staff" color="#3b82f6" title="Architect" onPress={() => setAiModalVisible(true)} />
              <AppGridIcon icon="database-search" color="#f472b6" title="Archivist" onPress={() => router.push('/(tabs)/agents/archivist')} />
              <AppGridIcon icon="message-text" color="#10b981" title="Liaison" onPress={() => router.push('/(tabs)/agents/liaison')} />
              <AppGridIcon icon="cog" color="#94a3b8" title="Settings" onPress={() => setActiveApp('settings')} />
            </View>
          </View>
        </View>
      ) : (
        // SUBPAGES (DEDICATED MODULES)
        <View style={styles.subpageWrapper}>
          
          {/* EVENTS APP */}
          {activeApp === 'events' && (
            <>
              <SubpageHeader 
                title="Event Manager" 
                rightAction={
                  <Pressable onPress={() => openEventModal(null)}>
                    <MaterialCommunityIcons name="plus" size={24} color="#3b82f6" />
                  </Pressable>
                } 
              />
              <ScrollView contentContainerStyle={styles.subpageContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {events.length === 0 ? <Text style={styles.emptyText}>No events.</Text> : events.map(evt => (
                  <View key={evt.id} style={styles.compactCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.compactCardTitle} numberOfLines={1}>{evt.name}</Text>
                      <Text style={styles.compactCardSubtitle}>{evt.date} • {evt.venue}</Text>
                    </View>
                    <View style={styles.compactActions}>
                      <Pressable style={styles.miniBtn} onPress={() => openManageRequests(evt.id)}><MaterialCommunityIcons name="account-multiple-plus" size={16} color="#38bdf8" /></Pressable>
                      <Pressable style={styles.miniBtn} onPress={() => openEventModal(evt)}><MaterialCommunityIcons name="pencil" size={16} color="#60a5fa" /></Pressable>
                      <Pressable style={[styles.miniBtn, { borderColor: '#ef444444' }]} onPress={() => handleDeleteEvent(evt.id)}><MaterialCommunityIcons name="delete" size={16} color="#ef4444" /></Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* SPONSORS APP */}
          {activeApp === 'sponsors' && (
            <>
              <SubpageHeader 
                title="Sponsors Directory" 
                rightAction={
                  <Pressable onPress={() => openSponsorModal(null)}>
                    <MaterialCommunityIcons name="plus" size={24} color="#fbbf24" />
                  </Pressable>
                } 
              />
              <ScrollView contentContainerStyle={styles.subpageContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {sponsors.length === 0 ? <Text style={styles.emptyText}>No sponsors.</Text> : sponsors.map(spr => (
                  <View key={spr.id} style={styles.compactCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.compactCardTitle} numberOfLines={1}>{spr.name} {spr.company ? `(${spr.company})` : ''}</Text>
                      <Text style={styles.compactCardSubtitle}>{spr.email} • {spr.amount ? `${spr.amount} TND` : ''}</Text>
                    </View>
                    <View style={styles.compactActions}>
                      <Pressable style={styles.miniBtn} onPress={() => openSponsorModal(spr)}><MaterialCommunityIcons name="pencil" size={16} color="#fbbf24" /></Pressable>
                      <Pressable style={[styles.miniBtn, { borderColor: '#ef444444' }]} onPress={() => handleDeleteSponsor(spr.id)}><MaterialCommunityIcons name="delete" size={16} color="#ef4444" /></Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* USERS APP */}
          {activeApp === 'users' && (
            <>
              <SubpageHeader title="User Access Logs" />
              <ScrollView contentContainerStyle={styles.subpageContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {members.map(member => (
                  <View key={member.id} style={[styles.userCard, member.is_blacklisted && styles.userCardBanned]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.compactCardTitle, member.is_blacklisted && { color: '#94a3b8' }]}>{member.name} {member.role === 'admin' ? '(Admin)' : ''}</Text>
                      <Text style={styles.compactCardSubtitle}>{member.email}</Text>
                    </View>
                    <View style={styles.compactActions}>
                      {!member.is_blacklisted ? (
                        <>
                          <Pressable style={styles.miniBtn} onPress={() => handleUpdateRole(member.id, member.role === 'admin' ? 'member' : 'admin')}>
                            <MaterialCommunityIcons name={member.role === 'admin' ? "account-arrow-down" : "account-arrow-up"} size={16} color={member.role === 'admin' ? "#fbbf24" : "#34d399"} />
                          </Pressable>
                          <Pressable style={[styles.miniBtn, { borderColor: '#f8717144' }]} onPress={() => handleBlockUser(member.id)}><MaterialCommunityIcons name="cancel" size={16} color="#f87171" /></Pressable>
                          <Pressable style={[styles.miniBtn, { borderColor: '#ef444444' }]} onPress={() => handleDeleteUser(member.id)}><MaterialCommunityIcons name="delete" size={16} color="#ef4444" /></Pressable>
                        </>
                      ) : (
                        <>
                          <Pressable style={[styles.miniBtn, { borderColor: '#34d39944' }]} onPress={() => handleUnblockUser(member.id)}><MaterialCommunityIcons name="check-decagram" size={16} color="#34d399" /></Pressable>
                          <Pressable style={[styles.miniBtn, { borderColor: '#ef444444' }]} onPress={() => handleDeleteUser(member.id)}><MaterialCommunityIcons name="delete" size={16} color="#ef4444" /></Pressable>
                        </>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* VAULT APP */}
          {activeApp === 'vault' && (
            <>
              <SubpageHeader 
                title="Zero-Trust Vault" 
                rightAction={
                  <Pressable onPress={handleUploadFile}>
                    <MaterialCommunityIcons name="cloud-upload" size={24} color="#ef4444" />
                  </Pressable>
                } 
              />
              <ScrollView contentContainerStyle={styles.subpageContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {vaultFiles.length === 0 ? <Text style={styles.emptyText}>Vault is completely empty.</Text> : vaultFiles.map(vf => (
                  <View key={vf.file_id} style={[styles.compactCard, { borderColor: '#450a0a', backgroundColor: 'rgba(69, 10, 10, 0.4)' }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.compactCardTitle, { color: '#fca5a5' }]}><MaterialCommunityIcons name="file-document" size={14} color="#fca5a5" /> {vf.file_name}</Text>
                      <Text style={styles.compactCardSubtitle}>{(vf.file_size / 1024).toFixed(1)} KB • Vault Storage</Text>
                    </View>
                    <View style={styles.compactActions}>
                      <Pressable style={[styles.miniBtn, { borderColor: '#3b82f644' }]} onPress={() => handleDownloadFile(vf.file_id, vf.file_name)}><MaterialCommunityIcons name="cloud-download" size={16} color="#60a5fa" /></Pressable>
                      <Pressable style={[styles.miniBtn, { borderColor: '#ef444444' }]} onPress={() => handleDeleteFile(vf.file_id)}><MaterialCommunityIcons name="delete-empty" size={16} color="#f87171" /></Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          )}



          {/* SETTINGS APP */}
          {activeApp === 'settings' && (
            <>
              <SubpageHeader title="System Settings" />
              <ScrollView contentContainerStyle={styles.subpageContent}>
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsLabel}>Admin Profile</Text>
                  <View style={styles.userCard}>
                    <View style={styles.avatarPlaceholder}>
                      <MaterialCommunityIcons name="account" size={32} color="#a855f7" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.compactCardTitle}>{user?.name}</Text>
                      <Text style={styles.compactCardSubtitle}>Role: {user?.role}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.settingsSection}>
                  <Text style={styles.settingsLabel}>Authentication & Security</Text>
                  <View style={styles.settingsOption}>
                    <MaterialCommunityIcons name="fingerprint" size={20} color="#10b981" />
                    <Text style={styles.settingsOptionText}>Biometric Access</Text>
                    <Text style={{ color: '#10b981', fontSize: 11, fontWeight: '700' }}>ACTIVE</Text>
                  </View>
                  <View style={styles.settingsOption}>
                    <MaterialCommunityIcons name="shield-check" size={20} color="#3b82f6" />
                    <Text style={styles.settingsOptionText}>Two-Factor Auth</Text>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>Configured</Text>
                  </View>
                </View>

                <View style={styles.settingsSection}>
                  <Text style={styles.settingsLabel}>System Environment</Text>
                  <View style={styles.settingsOption}>
                    <MaterialCommunityIcons name="information-outline" size={20} color="#94a3b8" />
                    <Text style={styles.settingsOptionText}>App Version</Text>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>v2.4.0-neon</Text>
                  </View>
                  <View style={styles.settingsOption}>
                    <MaterialCommunityIcons name="server" size={20} color="#94a3b8" />
                    <Text style={styles.settingsOptionText}>Backend Node</Text>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>Production-A</Text>
                  </View>
                </View>

                <View style={styles.settingsSection}>
                   <Text style={[styles.settingsLabel, { color: '#ef4444' }]}>Danger Zone</Text>
                   <Pressable style={[styles.aiActionCard, { borderColor: '#ef444444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }]}>
                      <Text style={{ color: '#fca5a5', fontWeight: 'bold' }}>Factory Reset Data</Text>
                      <Text style={{ color: '#991b1b', fontSize: 11, marginTop: 4 }}>Wipes all temporary cached data.</Text>
                   </Pressable>

                   <Pressable style={[styles.aiActionCard, { marginTop: 12, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} onPress={handleLogoutConfirm}>
                      <MaterialCommunityIcons name="logout" size={24} color="#ef4444" style={{ marginBottom: 8 }} />
                      <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Logout Archive</Text>
                      <Text style={{ color: '#94a3b8', fontSize: 11 }}>Securely close current session.</Text>
                   </Pressable>
                </View>
              </ScrollView>
            </>
          )}

        </View>
      )}

      {/* --- GLOBAL MODALS --- */}
      {/* Event Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '85%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingEvent ? 'Edit Event' : 'Create Event'}</Text>
              <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Event Title" value={eventForm.title} onChangeText={t => setEventForm({...eventForm, title: t})} />
              <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Date (YYYY-MM-DD)" value={eventForm.date} onChangeText={t => setEventForm({...eventForm, date: t})} />
              <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Location" value={eventForm.location} onChangeText={t => setEventForm({...eventForm, location: t})} />
              <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Budget ($)" keyboardType="numeric" value={eventForm.budget} onChangeText={t => setEventForm({...eventForm, budget: t})} />
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholderTextColor="#64748b" placeholder="Description" multiline value={eventForm.description} onChangeText={t => setEventForm({...eventForm, description: t})} />
              <View style={styles.modalActions}>
                <Pressable style={[styles.modalBtn, { backgroundColor: '#1e293b' }]} onPress={() => setModalVisible(false)}><Text style={styles.modalBtnText}>Cancel</Text></Pressable>
                <Pressable style={[styles.modalBtn, { backgroundColor: '#3b82f6' }]} onPress={saveEvent}><Text style={[styles.modalBtnText, { color: '#fff' }]}>Save Settings</Text></Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sponsor Modal */}
      <Modal visible={sponsorModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}</Text>
            <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Name" value={sponsorForm.name} onChangeText={t => setSponsorForm({...sponsorForm, name: t})} />
            <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Company" value={sponsorForm.company} onChangeText={t => setSponsorForm({...sponsorForm, company: t})} />
            <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Email" value={sponsorForm.email} onChangeText={t => setSponsorForm({...sponsorForm, email: t})} />
            <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Phone" value={sponsorForm.phone} onChangeText={t => setSponsorForm({...sponsorForm, phone: t})} />
            <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Amount (TND)" keyboardType="numeric" value={sponsorForm.amount} onChangeText={t => setSponsorForm({...sponsorForm, amount: t})} />
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#1e293b' }]} onPress={() => setSponsorModalVisible(false)}><Text style={styles.modalBtnText}>Cancel</Text></Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#fbbf24' }]} onPress={saveSponsor}><Text style={[styles.modalBtnText, { color: '#000' }]}>Save</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Generate Modal */}
      <Modal visible={aiModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}><MaterialCommunityIcons name="robot-outline" size={20} color="#3b82f6" /> AI Event Architect</Text>
            <Text style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>Describe your idea, and Llama3 will structure it for you.</Text>
            <TextInput style={[styles.input, { height: 90, textAlignVertical: 'top' }]} placeholderTextColor="#64748b" placeholder="Event details..." multiline value={aiIdea} onChangeText={setAiIdea} editable={!aiLoading} />
            <TextInput style={styles.input} placeholderTextColor="#64748b" placeholder="Expected Participants" keyboardType="numeric" value={aiParticipants} onChangeText={setAiParticipants} editable={!aiLoading} />
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#1e293b' }]} onPress={() => setAiModalVisible(false)} disabled={aiLoading}><Text style={styles.modalBtnText}>Cancel</Text></Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#3b82f6' }]} onPress={handleAiGeneration} disabled={aiLoading}>
                {aiLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={[styles.modalBtnText, { color: '#fff' }]}>Generate Plan</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Admin Manage Requests Modal */}
      <Modal visible={manageRequestsVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={styles.modalTitle}>Join Requests</Text>
              <Pressable onPress={() => setManageRequestsVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>

            {isRequestsLoading ? (
              <ActivityIndicator size="large" color="#38bdf8" style={{ marginVertical: 40 }} />
            ) : eventRequests.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <MaterialCommunityIcons name="tray-arrow-down" size={48} color="#1e293b" />
                <Text style={{ color: '#64748b', marginTop: 12, textAlign: 'center' }}>No requests pending.</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                {eventRequests.map((req) => (
                  <View key={req.request_id} style={styles.requestItem}>
                    <View style={styles.requestUserInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{req.user_name?.charAt(0) || 'U'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.requestUserName}>{req.user_name || 'Anonymous'}</Text>
                        <Text style={styles.requestUserEmail}>{req.user_email}</Text>
                      </View>
                      <View style={[styles.statusPendingPill, { backgroundColor: req.status === 'approved' ? '#163f25' : req.status === 'rejected' ? '#450a0a' : '#45350c' }]}>
                        <Text style={[styles.statusPendingText, { color: req.status === 'approved' ? '#22c55e' : req.status === 'rejected' ? '#ef4444' : '#f59e0b' }]}>{req.status?.toUpperCase()}</Text>
                      </View>
                    </View>
                    
                    {req.message && (
                      <View style={styles.requestMessageBox}>
                        <Text style={styles.requestMessageText}>"{req.message}"</Text>
                      </View>
                    )}

                    {req.status === 'pending' && (
                      <View style={styles.requestActions}>
                        <Pressable 
                          style={[styles.requestActionBtn, { backgroundColor: '#14532d' }]} 
                          onPress={() => handleApproveRequest(req.request_id)}
                        >
                          <Text style={[styles.requestActionText, { color: '#4ade80' }]}>Approve</Text>
                        </Pressable>
                        <Pressable 
                          style={[styles.requestActionBtn, { backgroundColor: '#450a0a' }]} 
                          onPress={() => handleRejectRequest(req.request_id)}
                        >
                          <Text style={[styles.requestActionText, { color: '#f87171' }]}>Reject</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}

            <Pressable style={styles.modalCloseFullBtn} onPress={() => setManageRequestsVisible(false)}>
              <Text style={styles.modalCloseFullBtnText}>Close Window</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050508' },
  // Launcher UI
  launcherScreen: { flex: 1, paddingTop: 30, paddingHorizontal: GRID_PADDING },
  launcherHero: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  heroLogo: { shadowColor: '#a855f7', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10, marginBottom: 8 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  heroSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2, letterSpacing: 2, textTransform: 'uppercase' },
  fullScreenGrid: { flex: 1, justifyContent: 'center', paddingBottom: 40 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 12 },
  
  badgeContainer: { position: 'absolute', top: -5, right: -5, backgroundColor: '#ef4444', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1.5, borderColor: '#050508', shadowColor: '#ef4444', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 5 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  appIconWrapper: { width: ICON_SIZE, alignItems: 'center', marginBottom: 16 },
  appIconContainer: { width: ICON_SIZE, height: ICON_SIZE, backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  appIconText: { color: '#cbd5e1', fontSize: 10, fontWeight: '600', marginTop: 8, textAlign: 'center' },

  // Subpage UI
  subpageWrapper: { flex: 1 },
  subpageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backButton: { padding: 8, marginLeft: -8 },
  subpageTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
  subpageContent: { padding: 16, paddingBottom: 60 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 40 },

  // Modules Shared UI
  compactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  compactCardTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  compactCardSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  compactActions: { flexDirection: 'row', gap: 8 },
  miniBtn: { padding: 10, borderRadius: 10, backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  userCardBanned: { backgroundColor: '#1f0d0d', borderColor: '#450a0a' },

  aiActionCard: { backgroundColor: '#0f172a', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#3b82f644', marginBottom: 16, alignItems: 'center' },
  aiActionTitle: { color: '#bfdbfe', fontSize: 18, fontWeight: 'bold' },
  aiActionDesc: { color: '#94a3b8', fontSize: 13, marginTop: 8, textAlign: 'center' },
  
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#1e293b' },
  modalTitle: { color: '#f8fafc', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', color: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 12, fontSize: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, gap: 12 },
  modalBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  modalBtnText: { color: '#94a3b8', fontWeight: 'bold', fontSize: 15 },

  participationDesk: { marginTop: 32, borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 20 },
  participationTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: '#3b82f6' },
  requestCard: { backgroundColor: '#020617', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Settings specific
  settingsSection: { marginBottom: 24 },
  settingsLabel: { color: '#64748b', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  settingsOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 },
  settingsOptionText: { flex: 1, color: '#f8fafc', fontSize: 14, fontWeight: '600', marginLeft: 12 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#a855f744' },
  requestItem: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  requestUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  requestUserName: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: 'bold',
  },
  requestUserEmail: {
    color: '#64748b',
    fontSize: 12,
  },
  statusPendingPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#45350c',
  },
  statusPendingText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: 'bold',
  },
  requestMessageBox: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#38bdf8',
  },
  requestMessageText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontStyle: 'italic',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  requestActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestActionText: {
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  modalCloseFullBtn: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  modalCloseFullBtnText: {
    color: '#94a3b8',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
