# VITAL - AI-Driven Club Management App (Supabase Edition)

An intelligent, cloud-native club management platform that leverages AI and Supabase to automate and enhance university club operations, member engagement, and event coordination.

## 🚀 Overview

VITAL has been completely migrated to a **Supabase-native architecture**. The application leverages Supabase for its entire data layer and authentication, while using a minimal Node.js backend as a secure proxy for **Groq AI** integration.

## ✨ Key Features

- **Multi-Agent AI System (Powered by Groq)**:
  - **🤖 Architect Agent**: Automatically designs and structures club events (suggests dates, ISSATKR rooms, and budgets).
  - **📚 Archivist Agent (Database-Aware)**: A live RAG (Retrieval-Augmented Generation) agent that searches your **real Supabase database** to answer questions about past events and sponsors.
  - **📢 Liaison Agent**: Generates professional marketing content, Slack announcements, and sponsor emails.
  
- **Supabase-Powered Core**:
  - **Live Data**: Real-time synchronization of events, members, and sponsors.
  - **Secure Auth**: Built-in Supabase authentication with Row Level Security (RLS) policies.
  - **Profile Management**: Automatic user profile creation and role-based access (Admin/Member).

- **Admin OS Workspace**: A high-fidelity administrative dashboard for managing the club's entire lifecycle.

## 🛠 Tech Stack

### Frontend
- **React Native (Expo)** - Cross-platform mobile development.
- **Supabase JS SDK** - Native database and auth integration.
- **TypeScript** - Type-safe development.

### AI Backend (Proxy)
- **Node.js + Express** - Minimal server used solely for Groq AI processing.
- **Groq API** - High-speed Llama-3 models for all AI agent logic.

## 📁 Project Structure

```
hakathon_app/
├── backend_x/                 # Node.js AI Proxy
│   ├── app.js                # AI route entry point
│   ├── controllers/          # AI Agent logic (Architect, Archivist, Liaison)
│   ├── .env                  # AI Keys & Supabase config
│   └── ...
│
├── full_project-main/        # Mobile Frontend
│   ├── my-app/              # Expo React Native App
│   │   ├── app/             # Screens & Navigation
│   │   ├── services/        # Supabase client & API services
│   │   ├── context/         # AuthContext (Supabase Session)
│   │   └── ...
│
└── SUPABASE_SCHEMA.sql        # The complete database schema for Supabase
```

## 🏁 Getting Started

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the entire contents of `SUPABASE_SCHEMA.sql` and run it to set up the tables and RLS policies.

### 2. Environment Configuration

#### Backend (`backend_x/.env`)
```env
PORT=3000
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Frontend (`my-app/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GROQ_API_KEY=your_groq_key
```

### 3. Installation & Run

1. **Install Backend Dependencies**:
   ```bash
   cd backend_x && npm install
   ```
2. **Start Backend Server**:
   ```bash
   npm start
   ```
3. **Start Mobile App**:
   ```bash
   cd ../full_project-main/my-app
   npm install
   npx expo start
   ```

## 🔐 Security Note
This project uses **Row Level Security (RLS)** in Supabase. By default, only users with the `admin` role in the `users` table can create or modify events. You can update your role directly in the Supabase Table Editor to grant yourself admin access.

---
**Last Updated**: May 3, 2026 - Migration to Supabase & Live AI RAG Integration.
