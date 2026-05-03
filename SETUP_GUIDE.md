# React Native App Setup Documentation

## Overview

This document provides step-by-step instructions to set up the React Native application with Supabase and Groq AI integration.

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager
- Expo CLI: `npm install -g expo-cli`
- A Supabase account and project
- A Groq API account

## Setup Instructions

### 1. Install Dependencies

Navigate to the my-app directory and install all dependencies:

```bash
cd full_project-main/my-app
npm install
```

This will install:
- **@supabase/supabase-js**: Supabase client library for authentication and database operations
- React Native and Expo dependencies
- Navigation and UI components

### 2. Environment Configuration

Create a `.env` file in the `my-app` directory with your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

**Note**: Environment variables prefixed with `EXPO_PUBLIC_` are safe to expose to the frontend. Never expose private keys or secrets.

### 3. Supabase Database Setup

1. Go to your Supabase project SQL editor
2. Copy the entire contents of `SUPABASE_SCHEMA.sql` from the root directory
3. Paste and execute it in the Supabase SQL editor
4. This will create:
   - All necessary tables
   - Indexes for performance
   - Row Level Security (RLS) policies
   - Database views
   - Helper functions

### 4. Enable Realtime (Optional)

For real-time features in your app:

1. Go to Supabase Dashboard → Replication
2. Enable replication for tables you need real-time updates:
   - events
   - event_attendees
   - announcements
   - activity_log

### 5. Verify Integration

Run the app to verify everything is set up correctly:

**For iOS**:
```bash
npm run ios
```

**For Android**:
```bash
npm run android
```

**For Web**:
```bash
npm run web
```

**For Development**:
```bash
npm start
```

## Project Structure

```
my-app/
├── .env                          # Environment variables (not in git)
├── .env.example                  # Example environment file
├── app/
│   ├── _layout.tsx              # Main layout
│   ├── login.tsx                # Authentication
│   ├── (tabs)/                  # Tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Dashboard
│   │   ├── events.tsx           # Events management
│   │   ├── members.tsx          # Members list
│   │   ├── admin.tsx            # Admin panel
│   │   ├── vault.tsx            # Vault/Files
│   │   ├── settings.tsx         # Settings
│   │   └── agents/              # AI agents UI
│   └── ...
├── components/                   # Reusable components
├── context/
│   └── AuthContext.tsx          # Auth state management
├── services/
│   ├── supabaseClient.ts        # Supabase setup & helpers
│   ├── groqClient.ts            # Groq AI setup & helpers
│   ├── api.ts                   # API endpoints
│   └── ...
├── constants/
│   └── theme.ts                 # Theme configuration
├── hooks/
│   └── ...                      # Custom React hooks
├── assets/
│   └── images/                  # Images & assets
├── package.json                 # Dependencies
├── app.json                     # Expo configuration
├── tsconfig.json               # TypeScript config
└── README.md                   # Project documentation
```

## Available Services

### Supabase Client (`services/supabaseClient.ts`)

Provides:
- Database connection
- Authentication helpers
- User profile management
- Ready-to-use functions for common operations

**Usage**:
```typescript
import { supabase, getCurrentUser } from '@/services/supabaseClient';

const user = await getCurrentUser();
```

### Groq AI Client (`services/groqClient.ts`)

Provides:
- Event recommendations
- Member notifications
- Sentiment analysis
- Event agenda generation
- General AI chat

**Usage**:
```typescript
import { groqClient } from '@/services/groqClient';

const recommendations = await groqClient.generateEventRecommendations(
  ['sports'],
  ['upcoming tournaments']
);
```

## Common Development Tasks

### Create a New Page

1. Create a new `.tsx` file in `app/` or `app/(tabs)/`
2. Import necessary hooks and components
3. Export a default function component

### Add Database Operations

1. Import supabase client in your component
2. Use `supabase.from('table_name')` to query data
3. Handle errors appropriately

### Use Authentication

1. Import `getCurrentUser` from supabaseClient
2. Check if user exists
3. Redirect to login if not authenticated

### Integrate AI Features

1. Import `groqClient` from services
2. Call the appropriate method based on your use case
3. Handle the response and display results

## Debugging

### Check Environment Variables

```typescript
console.log(process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log(process.env.EXPO_PUBLIC_GROQ_API_KEY);
```

### Enable Expo Debug Mode

```bash
EXPO_DEBUG=true npm start
```

### Check Network Requests

Use Expo's built-in network inspection or React Native Debugger.

### Database Connection Issues

1. Verify credentials in .env
2. Check Supabase project is running
3. Verify RLS policies aren't blocking access
4. Check user authentication status

## Git Management

The `.gitignore` file is configured to exclude:
- `.env` files (sensitive credentials)
- `node_modules/` (dependencies)
- Build artifacts
- IDE configuration

**Before committing**:
```bash
git status
# Verify .env is not listed
git add .
git commit -m "Your message"
git push
```

## Performance Optimization

1. **Use caching**: Store frequently accessed data locally
2. **Limit queries**: Only fetch necessary fields
3. **Batch operations**: Combine multiple queries
4. **Use indexes**: Database indexes are pre-configured
5. **Real-time sparingly**: Don't subscribe to all events

## Security Best Practices

1. **Never expose private keys**: Only use EXPO_PUBLIC_* variables for frontend
2. **Enable RLS**: Row Level Security policies are required
3. **Validate input**: Always validate user input before database operations
4. **Use HTTPS**: Ensure all API calls use HTTPS
5. **Regular updates**: Keep dependencies updated

## Troubleshooting

### App Won't Start

```bash
# Clear cache and restart
npm install
rm -rf node_modules/.cache
npm start
```

### Supabase Connection Error

1. Verify .env variables
2. Check Supabase project status
3. Verify credentials are correct
4. Check network connectivity

### Groq API Not Responding

1. Verify API key is valid
2. Check rate limits
3. Check internet connection
4. Review API error messages

### TypeScript Errors

```bash
# Rebuild TypeScript
npx tsc --noEmit

# Update types
npm install --save-dev @types/react-native
```

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Groq API Documentation](https://console.groq.com/docs)
- [React Native Documentation](https://reactnative.dev/)

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up environment variables
3. ✅ Create Supabase tables
4. ✅ Test database connection
5. ✅ Test Groq AI integration
6. Start building features!

## Support

For issues or questions:
1. Check the documentation
2. Review error messages carefully
3. Check console logs
4. Verify all credentials and setup steps
