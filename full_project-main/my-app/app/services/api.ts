import { supabase } from '@/services/supabaseClient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { EventItem, MemberRecord } from '../data/vital-data';

export const BASE_URL = 'http://192.168.0.149:3000'; // Keep for AI routes

export const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
};

export const mapEvent = (backendEvent: any, index: number): EventItem => {
    const rawDate = backendEvent.start_time ? new Date(backendEvent.start_time) : new Date();
    return {
        id: backendEvent.id || index,
        name: backendEvent.title || 'Untitled Event',
        date: rawDate.toLocaleDateString(),
        time: rawDate.toLocaleTimeString(),
        venue: backendEvent.location || 'Main Hall',
        attendees: { registered: backendEvent.current_attendees || 0, capacity: backendEvent.capacity || 100 }, 
        budget: 0,
        status: backendEvent.status || 'draft',
        organizer: backendEvent.organizer_id || 'Unknown',
    };
};

export const mapMember = (backendUser: any): MemberRecord => ({
    id: backendUser.id,
    name: backendUser.full_name || backendUser.email || 'Unknown User',
    email: backendUser.email || '',
    phone: backendUser.phone || 'Not provided',
    role: backendUser.role || 'member',
    department: 'General',
    year: 'N/A',
    joinDate: backendUser.created_at ? new Date(backendUser.created_at).toLocaleDateString() : 'Recent',
    eventsAttended: 0, 
    status: backendUser.status === 'suspended' ? 'banned' : 'active',
    is_blacklisted: backendUser.status === 'suspended'
});

export const fetchEvents = async (): Promise<EventItem[]> => {
    const { data, error } = await supabase.from('events').select('*').neq('status', 'archived');
    if (error) throw error;
    return (data || []).map((item: any, idx: number) => mapEvent(item, idx));
};

export const fetchMembers = async (): Promise<MemberRecord[]> => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return (data || []).map((item: any) => mapMember(item));
};

export const deleteMember = async (id: string | number) => {
    const { error } = await supabase.from('users').delete().eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const updateMemberRole = async (id: string | number, role: string) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const blockMember = async (id: string | number) => {
    const { error } = await supabase.from('users').update({ status: 'suspended' }).eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const unblockMember = async (id: string | number) => {
    const { error } = await supabase.from('users').update({ status: 'active' }).eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const adminCreateEvent = async (eventData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const dbPayload = {
        title: eventData.title || eventData.name,
        description: eventData.description || '',
        location: eventData.location || eventData.venue || '',
        start_time: eventData.date || new Date().toISOString(),
        end_time: eventData.date || new Date().toISOString(),
        status: 'published',
        organizer_id: user?.id
    };

    const { data, error } = await supabase.from('events').insert([dbPayload]);
    if (error) throw error;
    return data;
};

export const adminDeleteEvent = async (id: string | number) => {
    const { error } = await supabase.from('events').delete().eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const adminUpdateEvent = async (id: string | number, eventData: any) => {
    const dbPayload: any = {};
    if (eventData.title || eventData.name) dbPayload.title = eventData.title || eventData.name;
    if (eventData.description) dbPayload.description = eventData.description;
    if (eventData.location || eventData.venue) dbPayload.location = eventData.location || eventData.venue;
    if (eventData.date) {
        dbPayload.start_time = eventData.date;
        dbPayload.end_time = eventData.date;
    }
    if (eventData.status) dbPayload.status = eventData.status;

    const { data, error } = await supabase.from('events').update(dbPayload).eq('id', String(id));
    if (error) throw error;
    return data;
};

// AI Routes still use the backend
export const generateAiEvent = async (idea: string, participants: string | number) => {
    const res = await fetch(`${BASE_URL}/ai/architect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, participants: parseInt(String(participants)) || 30 })
    });
    if (!res.ok) throw new Error('Failed to generate event with AI');
    const result = await res.json();
    return result.data; 
};

export const askArchivist = async (question: string) => {
    const res = await fetch(`${BASE_URL}/ai/archivist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
    });
    if (!res.ok) throw new Error('Failed to query archivist');
    return await res.json();
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true };
};

export const fetchArchivedEvents = async (): Promise<EventItem[]> => {
    const { data, error } = await supabase.from('events').select('*').eq('status', 'archived');
    if (error) throw error;
    return (data || []).map((item: any, idx: number) => mapEvent(item, idx));
};

export const archiveEvent = async (id: string | number) => {
    const { error } = await supabase.from('events').update({ status: 'archived' }).eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const restoreEvent = async (id: string | number) => {
    const { error } = await supabase.from('events').update({ status: 'published' }).eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const fetchSponsors = async () => {
    const { data, error } = await supabase.from('sponsors').select('*');
    if (error) throw error;
    return data || [];
};

export const createSponsor = async (sponsorData: any) => {
    const { data, error } = await supabase.from('sponsors').insert([sponsorData]);
    if (error) throw error;
    return data;
};

export const updateSponsor = async (id: string | number, sponsorData: any) => {
    const { data, error } = await supabase.from('sponsors').update(sponsorData).eq('id', String(id));
    if (error) throw error;
    return data;
};

export const deleteSponsor = async (id: string | number) => {
    const { error } = await supabase.from('sponsors').delete().eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const fetchVaultFiles = async () => {
    const { data, error } = await supabase.from('files').select('*');
    if (error) throw error;
    return data || [];
};

export const deleteVaultFile = async (id: string | number) => {
    const { error } = await supabase.from('files').delete().eq('id', String(id));
    if (error) throw error;
    return { success: true };
};

export const uploadVaultFile = async (uri: string, name: string, mimeType: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('vault')
      .upload(name, blob, { contentType: mimeType });
      
    if (error) throw error;
    
    // Add record to files table
    const { data: user } = await supabase.auth.getUser();
    const { data: fileRecord, error: dbError } = await supabase.from('files').insert([{
        file_name: name,
        file_type: mimeType,
        bucket_path: data.path,
        uploaded_by: user.user?.id
    }]);
    
    if (dbError) throw dbError;
    return fileRecord;
};

export const downloadVaultFile = async (id: string | number, name: string) => {
    const { data: fileData, error: fileError } = await supabase.from('files').select('*').eq('id', String(id)).single();
    if (fileError) throw fileError;

    const { data, error } = await supabase.storage.from('vault').download(fileData.bucket_path);
    if (error) throw error;
    
    const fileReader = new FileReader();
    fileReader.readAsDataURL(data);
    fileReader.onload = async () => {
        const base64Data = (fileReader.result as string).split(',')[1];
        const fileUri = `${(FileSystem as any).documentDirectory}${name}`;
        await (FileSystem as any).writeAsStringAsync(fileUri, base64Data, { encoding: (FileSystem as any).EncodingType.Base64 });
        await Sharing.shareAsync(fileUri);
    };
};

export const requestParticipation = async (eventId: string | number, message: string) => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('event_attendees').insert([{
        event_id: String(eventId),
        user_id: user.user?.id,
        status: 'registered',
        feedback: message
    }]);
    if (error) throw error;
    return data;
};

export const fetchEventRequests = async (eventId: string | number) => {
    const { data, error } = await supabase.from('event_attendees').select('*, users(*)').eq('event_id', String(eventId)).eq('status', 'registered');
    if (error) throw error;
    return data || [];
};

export const approveRequest = async (requestId: string | number) => {
    const { error } = await supabase.from('event_attendees').update({ status: 'attended' }).eq('id', String(requestId));
    if (error) throw error;
    return { success: true };
};

export const rejectRequest = async (requestId: string | number) => {
    const { error } = await supabase.from('event_attendees').update({ status: 'cancelled' }).eq('id', String(requestId));
    if (error) throw error;
    return { success: true };
};

export default function Dummy() { return null; }
