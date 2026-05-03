# Integration Guide: Supabase & Groq AI

This guide explains how to use the Supabase and Groq AI clients in your React Native app.

## Setup

### 1. Environment Variables
All configuration is stored in `.env` file in the `my-app` directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### 2. Database Schema
Run the SQL from `SUPABASE_SCHEMA.sql` in your Supabase SQL Editor to set up all tables, indexes, RLS policies, and views.

## Using Supabase

### Import the client
```typescript
import { supabase, getCurrentUser, getUserProfile } from './services/supabaseClient';
```

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Sign out
const { success } = await signOut();

// Get current user
const user = await getCurrentUser();

// Get user profile
const { data: profile, error } = await getUserProfile(userId);
```

### Database Operations

```typescript
// Fetch events
const { data: events, error } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'published')
  .order('start_time', { ascending: true });

// Create event
const { data: newEvent, error } = await supabase
  .from('events')
  .insert([{
    title: 'Team Meeting',
    description: 'Monthly sync',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    organizer_id: userId,
  }])
  .select();

// Update member points
import { add_member_points } from './services/supabaseClient';
await supabase.rpc('add_member_points', {
  p_user_id: userId,
  p_points: 10,
  p_transaction_type: 'event_attendance',
  p_description: 'Attended team meeting',
  p_event_id: eventId,
});

// Register for event
const { data: registration, error } = await supabase
  .from('event_attendees')
  .insert([{
    event_id: eventId,
    user_id: userId,
  }]);
```

### Real-time Subscriptions

```typescript
// Listen for new events
const subscription = supabase
  .channel('events-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'events',
    },
    (payload) => {
      console.log('New event:', payload.new);
    }
  )
  .subscribe();

// Unsubscribe
subscription.unsubscribe();
```

## Using Groq AI

### Import the client
```typescript
import { groqClient } from './services/groqClient';
```

### Generate Event Recommendations

```typescript
const recommendations = await groqClient.generateEventRecommendations(
  ['sports', 'outdoor activities'],
  ['Tennis Tournament', 'Hiking Trip']
);

if (recommendations.success) {
  console.log('Recommended events:', recommendations.message);
  // Parse JSON from response if needed
}
```

### Generate Member Notifications

```typescript
const notification = await groqClient.generateMemberNotification(
  'John',
  'Hackathon 2024',
  'Join us for a 48-hour coding challenge'
);

if (notification.success) {
  console.log('Notification:', notification.message);
}
```

### Analyze Feedback Sentiment

```typescript
const analysis = await groqClient.analyzeSentiment(
  'This event was amazing! Best experience I had at the club.'
);

if (analysis.success) {
  console.log('Sentiment:', analysis.message);
  // Parse JSON from response for structured data
}
```

### Generate Event Agenda

```typescript
const agenda = await groqClient.generateEventAgenda(
  'Workshop',
  3,
  50
);

if (agenda.success) {
  console.log('Event Agenda:', agenda.message);
}
```

### General AI Chat

```typescript
const response = await groqClient.chat_general(
  'What are best practices for organizing club events?',
  'You are an expert event organizer'
);

if (response.success) {
  console.log('AI Response:', response.message);
}
```

## Example: Complete Event Registration Flow

```typescript
import React, { useState } from 'react';
import { supabase, getCurrentUser } from '@/services/supabaseClient';
import { groqClient } from '@/services/groqClient';

export default function EventRegistration({ eventId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        setMessage('Please log in first');
        return;
      }

      // Register for event
      const { data, error } = await supabase
        .from('event_attendees')
        .insert([{
          event_id: eventId,
          user_id: user.id,
        }]);

      if (error) throw error;

      // Get event details
      const { data: event } = await supabase
        .from('events')
        .select('title, description')
        .eq('id', eventId)
        .single();

      // Generate personalized notification
      const notification = await groqClient.generateMemberNotification(
        user.user_metadata?.full_name || 'Member',
        event?.title || 'the event',
        event?.description || 'We look forward to seeing you'
      );

      // Add points for registration
      await supabase.rpc('add_member_points', {
        p_user_id: user.id,
        p_points: 5,
        p_transaction_type: 'event_registration',
        p_description: `Registered for ${event?.title}`,
        p_event_id: eventId,
      });

      setMessage(notification.success ? notification.message : 'Successfully registered!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register for Event'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

## Important Notes

1. **Security**: The Supabase anon key is meant to be public and used on the client. It's protected by Row Level Security (RLS) policies defined in the database.

2. **API Limits**: Be mindful of Groq API rate limits. Cache results when possible.

3. **Real-time Features**: Supabase real-time subscriptions require proper setup in Supabase dashboard (Enable Realtime for the tables you need).

4. **Error Handling**: Always check `error` objects returned from Supabase queries and `success` flag from Groq responses.

5. **TypeScript**: For better type safety, consider creating TypeScript interfaces for your tables:

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  organizer_id: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  // ... other fields
}
```

## Useful Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript)
- [Groq API Documentation](https://console.groq.com/docs)
- [React Native Expo Docs](https://docs.expo.dev/)

## Troubleshooting

### Connection Issues
- Verify .env variables are correctly set
- Check Supabase project is active in Supabase dashboard
- Ensure RLS policies allow your operations

### AI Response Issues
- Check Groq API key is valid
- Verify API rate limits haven't been exceeded
- Review error messages returned from Groq

### Database Issues
- Run SUPABASE_SCHEMA.sql again to ensure all tables exist
- Check RLS policies are properly configured
- Verify user authentication before database operations
