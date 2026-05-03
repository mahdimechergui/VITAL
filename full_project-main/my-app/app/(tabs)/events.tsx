import { useEffect, useMemo, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { EventItem } from '@/app/data/vital-data';
import { fetchEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent, generateAiEvent, requestParticipation, fetchEventRequests, approveRequest, rejectRequest } from '@/app/services/api';
import { useAuth } from '@/context/AuthContext';
import * as Haptics from 'expo-haptics';
import { BackgroundEffects } from '@/components/BackgroundEffects';

const statusStyles = {
  confirmed: { label: 'CONFIRMED', color: '#22c55e', background: '#163f25' },
  planning: { label: 'PLANNING', color: '#f59e0b', background: '#45350c' },
  draft: { label: 'DRAFT', color: '#94a3b8', background: '#111827' },
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
type ViewState = 'month' | 'week' | 'day';

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

export default function EventsScreen() {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();
  
  // Modal Local State
  const [tempView, setTempView] = useState<ViewState>('month');
  const [focusedDate, setFocusedDate] = useState<Date>(new Date());
  
  const [fadeAnim] = useState(() => new Animated.Value(1));

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Manual Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', budget: '' });

  // AI Modal State
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiIdea, setAiIdea] = useState('');
  const [aiParticipants, setAiParticipants] = useState('30');
  const [aiLoading, setAiLoading] = useState(false);

  // User Join Request State
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinEventId, setJoinEventId] = useState<number | null>(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);
  
  // Admin Manage Requests State
  const [manageRequestsVisible, setManageRequestsVisible] = useState(false);
  const [selectedEventRequests, setSelectedEventRequests] = useState<any[]>([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [requestsEventId, setRequestsEventId] = useState<number | null>(null);

  const openEventModal = (event: any = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({ title: event.name, description: 'Created by Admin', date: event.date || new Date().toISOString().split('T')[0], location: event.venue || '', budget: event.budget?.toString() || '0' });
    } else {
      setEditingEvent(null);
      setEventForm({ title: '', description: '', date: new Date().toISOString().split('T')[0], location: '', budget: '' });
    }
    setModalVisible(true);
  };

  const saveEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      Alert.alert('Error', 'Title and Date are required');
      return;
    }

    let validDate;
    try {
      const d = new Date(eventForm.date);
      if (isNaN(d.getTime())) throw new Error();
      validDate = d.toISOString();
    } catch {
      Alert.alert('Invalid Date Format', 'Please ensure the Date is formatted correctly (e.g. 2026-05-15) and try again.');
      return;
    }

    try {
      const payload = {
        title: eventForm.title,
        description: eventForm.description,
        date: validDate,
        location: eventForm.location,
        budget: parseFloat(eventForm.budget) || 0
      };

      if (editingEvent) {
        await adminUpdateEvent(editingEvent.id, payload);
      } else {
        await adminCreateEvent(payload);
      }
      setModalVisible(false);
      const res = await fetchEvents();
      setEvents(res);
    } catch (e: any) {
      Alert.alert('Error saving event', e.message);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await adminDeleteEvent(id);
            const res = await fetchEvents();
            setEvents(res);
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
      }}
    ]);
  };

  const handleAiGeneration = async () => {
    // ... existing logic ... (kept safe)
    if (!aiIdea) {
      Alert.alert('Error', 'Please describe your event idea');
      return;
    }
    setAiLoading(true);
    try {
      const generatedData = await generateAiEvent(aiIdea, aiParticipants);
      setEditingEvent(null); 
      setEventForm({
        title: generatedData.title || '',
        description: generatedData.recommendations && generatedData.recommendations.length > 0 
          ? "AI Recommendations:\n• " + generatedData.recommendations.join("\n• ") 
          : '',
        date: generatedData.suggested_date || new Date().toISOString().split('T')[0],
        location: generatedData.room || '',
        budget: generatedData.budget_tnd?.toString() || '0'
      });
      setAiModalVisible(false);
      setAiIdea('');
      setModalVisible(true);
    } catch (e: any) {
      Alert.alert('AI Generation Failed', e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const openJoinModal = (id: number) => {
     setJoinEventId(id);
     setJoinMessage('');
     setJoinModalVisible(true);
  };

  const submitJoinRequest = async () => {
     if (!joinEventId) return;
     setIsSubmittingJoin(true);
     try {
        await requestParticipation(joinEventId, joinMessage);
        Alert.alert("Success", "Your request to join has been sent directly to the Admin.");
        setJoinModalVisible(false);
     } catch (e: any) {
        Alert.alert("Request Failed", e.message);
     } finally {
        setIsSubmittingJoin(false);
     }
  };

  const openManageRequests = async (eventId: number) => {
    setRequestsEventId(eventId);
    setManageRequestsVisible(true);
    setIsRequestsLoading(true);
    try {
      const res = await fetchEventRequests(eventId);
      setSelectedEventRequests(res);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsRequestsLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await approveRequest(requestId);
      } else {
        await rejectRequest(requestId);
      }
      
      // Refresh current list
      if (requestsEventId) {
        const res = await fetchEventRequests(requestsEventId);
        setSelectedEventRequests(res);
      }
      
      // Refresh events list to update attendee count
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Alert.alert('Action Failed', e.message);
    }
  };

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const today = new Date();

  const eventRanges = useMemo(() => events.map(event => {
    const { startDate, endDate } = parseEventDateRange(event.date);
    return { event, startDate, endDate };
  }), [events]);

  const markedDates = useMemo(() => {
    const set = new Set<string>();
    eventRanges.forEach(({ startDate, endDate }) => {
      let current = new Date(startDate);
      while (current <= endDate) {
        set.add(formatDateKey(current));
        current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
      }
    });
    return set;
  }, [eventRanges]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return events.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(normalizedSearch);
      if (!matchSearch) return false;
      if (!selectedDate) return true;
      const range = eventRanges.find(r => r.event.id === item.id);
      return range ? isDateInRange(selectedDate, range.startDate, range.endDate) : false;
    });
  }, [search, selectedDate, eventRanges]);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [filtered.length, selectedDate, fadeAnim]);

  const getMonthMatrix = (refDate: Date) => {
    const firstOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
    const firstDay = firstOfMonth.getDay();
    const daysIn = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0).getDate();

    const matrix: Array<Array<Date | null>> = [];
    let currentWeek: Array<Date | null> = Array(firstDay).fill(null);

    for (let day = 1; day <= daysIn; day++) {
      currentWeek.push(new Date(refDate.getFullYear(), refDate.getMonth(), day));
      if (currentWeek.length === 7) {
        matrix.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      matrix.push(currentWeek);
    }
    return matrix;
  };

  const getWeekArray = (refDate: Date) => {
    const start = new Date(refDate);
    const day = start.getDay();
    const diff = start.getDate() - (day === 0 ? 6 : day - 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const navigateDate = (dir: number) => {
    setFocusedDate(prev => {
      const newD = new Date(prev);
      if (tempView === 'month') newD.setMonth(prev.getMonth() + dir);
      else if (tempView === 'week') newD.setDate(prev.getDate() + dir * 7);
      else if (tempView === 'day') newD.setDate(prev.getDate() + dir);
      return newD;
    });
  };

  const renderDayCell = (day: Date | null, keyStr: string) => {
    if (!day) return <View key={keyStr} style={styles.dayCellEmpty} />;
    
    const isToday = isSameDate(day, today);
    const isSelected = isSameDate(day, focusedDate);
    const hasEvent = markedDates.has(formatDateKey(day));

    return (
      <Pressable 
        key={keyStr}
        onPress={() => setFocusedDate(day)}
        style={[
          styles.dayCell,
          isToday && styles.dayCellToday,
          isSelected && styles.dayCellSelected,
          hasEvent && !isSelected && !isToday && styles.dayCellWithEvent,
        ]}
      >
        <Text style={[styles.dayText, (isToday || isSelected) && styles.dayTextActive]}>{day.getDate()}</Text>
        <View style={styles.dotsRow}>
          {hasEvent && <View style={[styles.dot, { backgroundColor: isSelected || isToday ? '#fff' : '#22c55e' }]} />}
          {isToday && !hasEvent && <View style={[styles.dot, { backgroundColor: isSelected ? '#a855f7' : '#38bdf8' }]} />}
        </View>
      </Pressable>
    );
  };

  const selectedDateLabel = selectedDate
    ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <BackgroundEffects />
      <ScreenScrollView contentStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>Events</ThemedText>
        <ThemedText style={styles.subtitle}>Manage the upcoming schedule across VITAL.</ThemedText>

      {user?.role === 'admin' && (
        <View style={styles.actionButtonsRow}>
          <Pressable style={styles.createButton} onPress={() => openEventModal(null)}>
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Event</Text>
          </Pressable>

          <Pressable style={styles.aiButton} onPress={() => setAiModalVisible(true)}>
            <MaterialCommunityIcons name="robot-outline" size={20} color="#fff" />
            <Text style={styles.aiButtonText}>AI Architect</Text>
          </Pressable>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#a855f7" style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.filterInfoRow}>
        <Text style={styles.filterInfoText}>{selectedDateLabel ? `Showing events for ${selectedDateLabel}` : `${filtered.length} upcoming events`}</Text>
        {selectedDate && (
          <Pressable onPress={() => setSelectedDate(null)} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.searchRow}>
        <MaterialCommunityIcons name="magnify" size={20} color="#64748b" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search events..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
        />
        <Pressable 
          style={styles.filterButton} 
          onPress={() => {
            setFocusedDate(selectedDate || new Date());
            setIsFilterOpen(true);
          }}
        >
          <MaterialCommunityIcons name="filter-variant" size={22} color="#64748b" />
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterOpen}
        onRequestClose={() => setIsFilterOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">Select Date</ThemedText>
              
              <View style={styles.viewToggleGroup}>
                <Pressable onPress={() => setTempView('day')} style={[styles.viewToggleBtn, tempView === 'day' && styles.viewToggleBtnActive]}>
                  <Text style={[styles.viewToggleText, tempView === 'day' && styles.viewToggleTextActive]}>Day</Text>
                </Pressable>
                <Pressable onPress={() => setTempView('week')} style={[styles.viewToggleBtn, tempView === 'week' && styles.viewToggleBtnActive]}>
                  <Text style={[styles.viewToggleText, tempView === 'week' && styles.viewToggleTextActive]}>Week</Text>
                </Pressable>
                <Pressable onPress={() => setTempView('month')} style={[styles.viewToggleBtn, tempView === 'month' && styles.viewToggleBtnActive]}>
                  <Text style={[styles.viewToggleText, tempView === 'month' && styles.viewToggleTextActive]}>Month</Text>
                </Pressable>
              </View>

              <Pressable onPress={() => setIsFilterOpen(false)} style={styles.modalCloseIcon}>
                <MaterialCommunityIcons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>

            <View style={styles.modalCalendar}>
              <View style={styles.calNavHeader}>
                <Pressable onPress={() => navigateDate(-1)} style={styles.navBtn}>
                  <MaterialCommunityIcons name="chevron-left" size={24} color="#94a3b8" />
                </Pressable>
                <Text style={styles.calTitleText}>
                  {tempView === 'day' ? `${monthNames[focusedDate.getMonth()]} ${focusedDate.getDate()}, ${focusedDate.getFullYear()}` : `${monthNames[focusedDate.getMonth()]} ${focusedDate.getFullYear()}`}
                </Text>
                <Pressable onPress={() => navigateDate(1)} style={styles.navBtn}>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#94a3b8" />
                </Pressable>
              </View>

              {tempView !== 'day' && (
                <View style={styles.dayNamesRow}>
                  {dayNamesShort.map(n => <Text key={n} style={styles.dayNameText}>{n}</Text>)}
                </View>
              )}

              {tempView === 'month' && getMonthMatrix(focusedDate).map((week, idx) => (
                <View key={`w-${idx}`} style={styles.weekRow}>
                  {week.map((day, dIdx) => renderDayCell(day, `m-${idx}-${dIdx}`))}
                </View>
              ))}

              {tempView === 'week' && (
                <View style={styles.weekRow}>
                  {getWeekArray(focusedDate).map((day, idx) => renderDayCell(day, `w-${idx}`))}
                </View>
              )}

              {tempView === 'day' && (
                <View style={[styles.dayCell, styles.singleDayCell]}>
                  <Text style={styles.dayTextBig}>{focusedDate.getDate()}</Text>
                  <Text style={styles.dayNameBig}>{dayNamesShort[focusedDate.getDay()]}</Text>
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <Pressable style={styles.modalButtonCancel} onPress={() => setIsFilterOpen(false)}>
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={styles.modalButtonOk} 
                onPress={() => {
                  setSelectedDate(focusedDate);
                  setIsFilterOpen(false);
                }}
              >
                <Text style={styles.modalButtonOkText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
        {filtered.map((event) => {
          const status = statusStyles[event.status as keyof typeof statusStyles] || statusStyles.draft;
          return (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.cardHeaderRow}>
                <ThemedText type="defaultSemiBold" style={[styles.eventCardName, { flex: 1 }]}>{event.name}</ThemedText>
                <View style={[styles.statusPill, { backgroundColor: status.background, marginLeft: 8 }]}> 
                  <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar" size={18} color="#38bdf8" />
                <ThemedText style={styles.detailText}>{event.date}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock" size={18} color="#a78bfa" />
                <ThemedText style={styles.detailText}>{event.time}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="map-marker" size={18} color="#f472b6" />
                <ThemedText style={styles.detailText}>{event.venue}</ThemedText>
              </View>
              <View style={styles.metaRow}>
                <ThemedText style={styles.metaText}>{event.attendees.registered}/{event.attendees.capacity} registered</ThemedText>
                <ThemedText style={styles.metaText}>{event.attendees.capacity - event.attendees.registered} remaining</ThemedText>
              </View>

              {user?.role?.toLowerCase() === 'admin' && (
                <View style={styles.adminActionBar}>
                  <Pressable style={styles.adminActionBtn} onPress={() => openManageRequests(event.id)}>
                    <MaterialCommunityIcons name="account-multiple-plus" size={20} color="#38bdf8" />
                    <Text style={[styles.adminActionText, { color: '#38bdf8' }]}>Requests</Text>
                  </Pressable>
                  <Pressable style={styles.adminActionBtn} onPress={() => openEventModal(event)}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#a855f7" />
                    <Text style={[styles.adminActionText, { color: '#a855f7' }]}>Modify</Text>
                  </Pressable>
                  <Pressable style={styles.adminActionBtn} onPress={() => handleDeleteEvent(event.id)}>
                    <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
                    <Text style={[styles.adminActionText, { color: '#ef4444' }]}>Delete</Text>
                  </Pressable>
                </View>
              )}

              {user?.role !== 'admin' && (
                <View style={[styles.actionRow, { marginTop: 14 }]}>
                  {event.status === 'confirmed' ? (
                    event.attendees.registered < event.attendees.capacity ? (
                      <Pressable 
                        style={styles.joinButton} 
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          openJoinModal(event.id);
                        }}
                      >
                        <Text style={styles.joinButtonText}>Request to Join</Text>
                      </Pressable>
                    ) : (
                      <View style={styles.fullButton}>
                        <Text style={styles.fullButtonText}>Event Full / Closed</Text>
                      </View>
                    )
                  ) : event.status === 'planning' ? (
                    <Pressable 
                      style={styles.requestButton} 
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        openJoinModal(event.id);
                      }}
                    >
                      <Text style={styles.requestButtonText}>Apply & Request</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.notAvailableBox}>
                      <Text style={styles.notAvailableText}>Not available</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </Animated.View>

      {/* Event Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.fullscreenModalOverlay}>
          <View style={styles.adminModalContent}>
            <Text style={styles.adminModalTitle}>{editingEvent ? 'Edit Event' : 'Create Event'}</Text>
            
            <TextInput style={styles.adminInput} placeholderTextColor="#64748b" placeholder="Event Title" value={eventForm.title} onChangeText={t => setEventForm({...eventForm, title: t})} />
            <TextInput style={styles.adminInput} placeholderTextColor="#64748b" placeholder="Date (YYYY-MM-DD)" value={eventForm.date} onChangeText={t => setEventForm({...eventForm, date: t})} />
            <TextInput style={styles.adminInput} placeholderTextColor="#64748b" placeholder="Location" value={eventForm.location} onChangeText={t => setEventForm({...eventForm, location: t})} />
            <TextInput style={styles.adminInput} placeholderTextColor="#64748b" placeholder="Budget ($)" keyboardType="numeric" value={eventForm.budget} onChangeText={t => setEventForm({...eventForm, budget: t})} />
            <TextInput style={[styles.adminInput, { height: 80, textAlignVertical: 'top' }]} placeholderTextColor="#64748b" placeholder="Description" multiline value={eventForm.description} onChangeText={t => setEventForm({...eventForm, description: t})} />

            <View style={styles.adminModalActions}>
              <Pressable style={[styles.adminModalBtn, { backgroundColor: '#1e293b' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.adminModalBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.adminModalBtn, { backgroundColor: '#a855f7' }]} onPress={saveEvent}>
                <Text style={[styles.adminModalBtnText, { color: '#fff' }]}>Save Settings</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Generate Modal */}
      <Modal visible={aiModalVisible} animationType="fade" transparent={true}>
        <View style={styles.fullscreenModalOverlay}>
          <View style={styles.adminModalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <MaterialCommunityIcons name="robot-outline" size={28} color="#3b82f6" style={{ marginRight: 10 }} />
              <Text style={styles.adminModalTitle}>AI Event Architect</Text>
            </View>
            
            <Text style={{ color: '#94a3b8', marginBottom: 16 }}>Describe your idea, and Llama3 will structure it with dates, rooms, and budgets directly into your editor.</Text>
            
            <TextInput style={[styles.adminInput, { height: 80, textAlignVertical: 'top' }]} placeholderTextColor="#64748b" placeholder="E.g. A hackathon about cybersecurity for beginners" multiline value={aiIdea} onChangeText={setAiIdea} editable={!aiLoading} />
            <TextInput style={styles.adminInput} placeholderTextColor="#64748b" placeholder="Expected Participants (e.g. 50)" keyboardType="numeric" value={aiParticipants} onChangeText={setAiParticipants} editable={!aiLoading} />

            <View style={styles.adminModalActions}>
              <Pressable style={[styles.adminModalBtn, { backgroundColor: '#1e293b' }]} onPress={() => setAiModalVisible(false)} disabled={aiLoading}>
                <Text style={styles.adminModalBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.adminModalBtn, { backgroundColor: '#3b82f6', flexDirection: 'row', justifyContent: 'center' }]} onPress={handleAiGeneration} disabled={aiLoading}>
                {aiLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="magic-staff" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={[styles.adminModalBtnText, { color: '#fff' }]}>Generate</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* User Join Modal */}
      <Modal visible={joinModalVisible} animationType="fade" transparent={true}>
        <View style={styles.fullscreenModalOverlay}>
          <View style={styles.adminModalContent}>
            <Text style={styles.adminModalTitle}>Join Event</Text>
            
            <Text style={{ color: '#94a3b8', marginBottom: 16 }}>Please provide a brief motivation or context for why you wish to participate in this event (optional).</Text>
            
            <TextInput 
              style={[styles.adminInput, { height: 90, textAlignVertical: 'top' }]} 
              placeholderTextColor="#64748b" 
              placeholder="Your message..." 
              multiline 
              value={joinMessage} 
              onChangeText={setJoinMessage} 
              editable={!isSubmittingJoin} 
            />

            <View style={styles.adminModalActions}>
              <Pressable style={[styles.adminModalBtn, { backgroundColor: '#1e293b' }]} onPress={() => setJoinModalVisible(false)} disabled={isSubmittingJoin}>
                <Text style={styles.adminModalBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.adminModalBtn, { backgroundColor: '#38bdf8' }]} onPress={submitJoinRequest} disabled={isSubmittingJoin}>
                {isSubmittingJoin ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={[styles.adminModalBtnText, { color: '#000' }]}>Submit Request</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Admin Manage Requests Modal */}
      <Modal visible={manageRequestsVisible} animationType="slide" transparent={true}>
        <View style={styles.fullscreenModalOverlay}>
          <View style={[styles.adminModalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.adminModalTitle}>Join Requests</Text>
              <Pressable onPress={() => setManageRequestsVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>

            {isRequestsLoading ? (
              <ActivityIndicator size="large" color="#38bdf8" style={{ marginVertical: 40 }} />
            ) : selectedEventRequests.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <MaterialCommunityIcons name="tray-arrow-down" size={48} color="#1e293b" />
                <Text style={{ color: '#64748b', marginTop: 12, textAlign: 'center' }}>No pending requests for this event.</Text>
              </View>
            ) : (
              <ScreenScrollView style={{ maxHeight: 400 }}>
                {selectedEventRequests.map((req) => (
                  <View key={req.id} style={styles.requestItem}>
                    <View style={styles.requestUserInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{req.user_name?.charAt(0) || 'U'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.requestUserName}>{req.user_name || 'Anonymous'}</Text>
                        <Text style={styles.requestUserEmail}>{req.user_email}</Text>
                      </View>
                      <View style={[styles.statusPendingPill]}>
                        <Text style={styles.statusPendingText}>PENDING</Text>
                      </View>
                    </View>
                    
                    {req.message && (
                      <View style={styles.requestMessageBox}>
                        <Text style={styles.requestMessageText}>"{req.message}"</Text>
                      </View>
                    )}

                    <View style={styles.requestActions}>
                      <Pressable 
                        style={[styles.requestActionBtn, { backgroundColor: '#14532d' }]} 
                        onPress={() => handleUpdateRequest(req.id, 'approve')}
                      >
                        <Text style={[styles.requestActionText, { color: '#4ade80' }]}>Approve</Text>
                      </Pressable>
                      <Pressable 
                        style={[styles.requestActionBtn, { backgroundColor: '#450a0a' }]} 
                        onPress={() => handleUpdateRequest(req.id, 'reject')}
                      >
                        <Text style={[styles.requestActionText, { color: '#f87171' }]}>Reject</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScreenScrollView>
            )}

            <Pressable style={styles.modalCloseFullBtn} onPress={() => setManageRequestsVisible(false)}>
              <Text style={styles.modalCloseFullBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      </>
      )}
      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#a855f7',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  aiButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fullscreenModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  adminModalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  adminModalTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  adminInput: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    color: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 15,
  },
  adminModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 12,
  },
  adminModalBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  adminModalBtnText: {
    color: '#94a3b8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: 20,
    backgroundColor: '#050508',
    paddingBottom: 40,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 16,
  },
  filterInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  filterInfoText: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  clearText: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 12,
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
  searchInput: {
    flex: 1,
    color: '#e2e8f0',
  },
  filterButton: {
    padding: 4,
  },
  eventCard: {
    padding: 18,
    backgroundColor: '#0f1720',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventCardName: {
    fontSize: 17,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  detailText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  metaText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#0f1720',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  modalCloseIcon: {
    padding: 4,
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderRadius: 10,
    padding: 4,
  },
  viewToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewToggleBtnActive: {
    backgroundColor: '#38bdf8',
  },
  viewToggleText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  viewToggleTextActive: {
    color: '#0f1720',
  },
  modalCalendar: {
    marginBottom: 24,
  },
  calNavHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calTitleText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  navBtn: {
    padding: 6,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayNameText: {
    flex: 1,
    textAlign: 'center',
    color: '#475569',
    fontSize: 12,
    fontWeight: '800',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayCellEmpty: {
    flex: 1,
    marginHorizontal: 3,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 3,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  dayCellSelected: {
    backgroundColor: '#a855f7',
  },
  dayCellWithEvent: {
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  dayText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '700',
  },
  dayTextActive: {
    color: '#fff',
  },
  dotsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 6,
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  singleDayCell: {
    flex: 0,
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  dayTextBig: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '800',
  },
  dayNameBig: {
    fontSize: 14,
    color: '#a855f7',
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButtonCancel: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#1e293b',
  },
  modalButtonCancelText: {
    color: '#94a3b8',
    fontWeight: '700',
  },
  modalButtonOk: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#a855f7',
  },
  modalButtonOkText: {
    color: '#fff',
    fontWeight: '700',
  },
  actionRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  joinButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fullButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    opacity: 0.6,
  },
  fullButtonText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  requestButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notAvailableBox: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  notAvailableText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
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
  adminActionBar: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    justifyContent: 'space-between',
    gap: 10,
  },
  adminActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 6,
  },
  adminActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
