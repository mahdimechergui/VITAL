import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { EventItem, MemberRecord } from '../data/vital-data';

export const BASE_URL = 'http://192.168.0.149:3000';

export const getAuthToken = async () => {
    return await AsyncStorage.getItem('userToken');
};

export const mapEvent = (backendEvent: any, index: number): EventItem => {
    const rawDate = backendEvent.date ? new Date(backendEvent.date) : new Date();
    return {
        id: backendEvent.id || index,
        name: backendEvent.title || 'Untitled Event',
        date: rawDate.toLocaleDateString(),
        time: rawDate.toLocaleTimeString(),
        venue: 'Main Hall',
        attendees: { registered: Math.floor(Math.random() * 50) + 10, capacity: 100 }, 
        budget: 0,
        status: 'confirmed',
        organizer: `User ID: ${backendEvent.created_by || 'Unknown'}`,
    };
};

export const mapMember = (backendUser: any): MemberRecord => ({
    id: backendUser.id,
    name: backendUser.name || 'Unknown User',
    email: backendUser.email || '',
    phone: 'Not provided',
    role: backendUser.role || 'Member',
    department: 'General',
    year: 'N/A',
    joinDate: backendUser.created_at ? new Date(backendUser.created_at).toLocaleDateString() : 'Recent',
    eventsAttended: Math.floor(Math.random() * 10),
    status: backendUser.is_blacklisted ? 'banned' : 'active',
    is_blacklisted: !!backendUser.is_blacklisted
});

export const fetchEvents = async (): Promise<EventItem[]> => {
    const token = await getAuthToken();
    if (!token) return [];
    
    const res = await fetch(`${BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error('Fetch Events Error from Server:', res.status, errText);
        throw new Error('Failed to fetch events');
    }
    const data = await res.json();
    const eventsArray = data.events || [];
    return eventsArray.map((item: any, idx: number) => mapEvent(item, idx));
};

export const fetchMembers = async (): Promise<MemberRecord[]> => {
    const token = await getAuthToken();
    if (!token) return [];

    const res = await fetch(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch members');
    const data = await res.json();
    const usersArray = Array.isArray(data) ? data : (data.users || []);
    let defaultIdSequence = 1000;
    return usersArray.map((item: any) => {
        if (!item.id) item.id = defaultIdSequence++;
        return mapMember(item);
    });
};

export const deleteMember = async (id: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete member');
    return res.json();
};

export const updateMemberRole = async (id: number, role: string) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Failed to update member role');
    return res.json();
};

export const blockMember = async (id: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/users/${id}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to blacklist member');
    return res.json();
};

export const unblockMember = async (id: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/users/${id}/block`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to remove member from blacklist');
    return res.json();
};

export const adminCreateEvent = async (eventData: any) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventData)
    });
    if (!res.ok) throw new Error('Failed to create event. Make sure all required fields are included.');
    return res.json();
};

export const adminDeleteEvent = async (id: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete event');
    return res.json();
};

export const adminUpdateEvent = async (id: number, eventData: any) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventData)
    });
    if (!res.ok) throw new Error('Failed to update event');
    return res.json();
};

export const generateAiEvent = async (idea: string, participants: string) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/ai/architect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idea, participants: parseInt(participants) || 30 })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate event with AI');
    }
    const result = await res.json();
    return result.data; 
};

export const askArchivist = async (question: string) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/ai/archivist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to query archivist');
    }
    return await res.json();
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to change password');
    }
    return await res.json();
};

export const fetchArchivedEvents = async (): Promise<EventItem[]> => {
    const token = await getAuthToken();
    if (!token) return [];
    
    const res = await fetch(`${BASE_URL}/events/archived`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch archived events');
    const data = await res.json();
    const eventsArray = data.events || [];
    return eventsArray.map((item: any, idx: number) => mapEvent(item, idx));
};

export const archiveEvent = async (id: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events/${id}/archive`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to archive event');
    return res.json();
};

export const restoreEvent = async (id: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events/${id}/restore`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to restore event');
    return res.json();
};

export const fetchSponsors = async () => {
    const token = await getAuthToken();
    if (!token) return [];
    const res = await fetch(`${BASE_URL}/sponsors`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch sponsors');
    const data = await res.json();
    return data.sponsors || [];
};

export const createSponsor = async (sponsorData: any) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/sponsors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(sponsorData)
    });
    if (!res.ok) throw new Error('Failed to create sponsor');
    return res.json();
};

export const updateSponsor = async (id: number, sponsorData: any) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/sponsors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(sponsorData)
    });
    if (!res.ok) throw new Error('Failed to update sponsor');
    return res.json();
};

export const deleteSponsor = async (id: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/sponsors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete sponsor');
    return res.json();
};

export const fetchVaultFiles = async () => {
    const token = await getAuthToken();
    if (!token) return [];
    const res = await fetch(`${BASE_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch files');
    const data = await res.json();
    return data.files || [];
};

export const deleteVaultFile = async (id: string) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/files/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete file');
    return res.json();
};

export const uploadVaultFile = async (uri: string, name: string, mimeType: string) => {
    const token = await getAuthToken();
    
    const formData = new FormData();
    formData.append('file', {
        uri: uri,
        name: name,
        type: mimeType || 'application/octet-stream'
    } as any);

    const res = await fetch(`${BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
    if (!res.ok) {
       const text = await res.text();
       throw new Error(`Upload failed: ${text}`);
    }
    return res.json();
};

export const downloadVaultFile = async (id: string, name: string) => {
    const token = await getAuthToken();
    const url = `${BASE_URL}/files/${id}/download`;
    const fileUri = `${(FileSystem as any).documentDirectory || ''}${name}`;
    
    const downloadRes = await FileSystem.downloadAsync(url, fileUri, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    if (downloadRes.status !== 200) {
        throw new Error('Failed to download secure file');
    }
    
    await Sharing.shareAsync(downloadRes.uri);
};

export const requestParticipation = async (eventId: number, message: string) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events/${eventId}/request-participation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to request participation');
    }
    return res.json();
};

export const fetchEventRequests = async (eventId: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events/${eventId}/requests`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch requests');
    const data = await res.json();
    return data.requests || [];
};

export const approveRequest = async (requestId: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events/requests/${requestId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to approve request');
    return res.json();
};

export const rejectRequest = async (requestId: number) => {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}/events/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to reject request');
    return res.json();
};

export default function Dummy() { return null; }
