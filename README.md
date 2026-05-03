# VITAL - AI-Driven Club Management App

An intelligent club management platform that leverages AI to automate and enhance club operations, member engagement, and event coordination.

## Overview

VITAL is a comprehensive club management solution built with modern technologies to streamline administrative tasks, facilitate member communication, and provide AI-powered insights. The application features multiple specialized AI agents that handle different aspects of club management.

## Features

- **Multi-Agent AI System**: Specialized AI agents for different club functions:
  - **Architect Agent**: Designs and structures club workflows
  - **Archivist Agent**: Manages club records and documentation
  - **Sentinel Agent**: Monitors club security and compliance
  - **Liaison Agent**: Facilitates member communication
  
- **Event Management**: Create, schedule, and manage club events with ease
- **Member Management**: Track members, roles, and engagement
- **Sponsor Management**: Coordinate with sponsors and track partnerships
- **Secure Authentication**: JWT-based authentication with encrypted credentials
- **Real-time Updates**: Live synchronization across all platforms
- **File Management**: Upload and manage club files and documents
- **Admin Dashboard**: Comprehensive administrative controls

## Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation library
- **TailwindCSS** - Utility-first styling (web)

### Backend
- **Node.js + Express** - Server runtime and web framework
- **PostgreSQL** - Relational database (hosted on Render)
- **Supabase** - Backend-as-a-service (authentication & real-time)
- **Groq AI** - Large language model API for AI features
- **JWT** - Secure authentication

### Tools & Libraries
- **Multer** - File upload handling
- **Axios** - HTTP client
- **XLSX** - Excel file processing
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
hakathon_app/
├── backend_x/                 # Express.js backend
│   ├── app.js                # Application entry point
│   ├── server.js             # Server setup
│   ├── package.json          # Backend dependencies
│   ├── .env                  # Environment variables
│   ├── config/               # Configuration files
│   │   └── db.js            # Database configuration
│   ├── controllers/          # Route controllers
│   ├── models/               # Data models
│   ├── routers/              # API routes
│   ├── middlewares/          # Custom middleware
│   ├── services/             # Business logic
│   │   ├── blockUserService.js
│   │   ├── sentinelleEngine.js   # AI sentinel engine
│   │   └── ...
│   └── vault/                # Data storage
│
└── full_project-main/        # React Native frontend
    ├── my-app/              # React Native Expo app
    │   ├── app/
    │   │   ├── login.tsx    # Authentication screens
    │   │   ├── (tabs)/      # Tab navigation
    │   │   │   ├── admin.tsx
    │   │   │   ├── events.tsx
    │   │   │   ├── members.tsx
    │   │   │   ├── vault.tsx
    │   │   │   ├── settings.tsx
    │   │   │   └── agents/   # AI agent interfaces
    │   │   └── ...
    │   ├── components/      # Reusable components
    │   ├── services/        # API clients & services
    │   ├── context/         # React context (auth, etc)
    │   └── package.json
    │
    └── legacy-web/          # React web version
        ├── src/
        └── package.json
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Expo CLI** (for mobile development): `npm install -g expo-cli`
- **PostgreSQL** (or use the hosted database)
- Groq API key (get one at https://console.groq.com)
- Supabase account (optional, for additional features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahdimechergui/VITAL.git
   cd VITAL
   ```

2. **Install backend dependencies**
   ```bash
   cd backend_x
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../full_project-main/my-app
   npm install
   ```

### Configuration

#### Backend Setup

1. Create a `.env` file in `backend_x/`:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   PORT=3000
   JWT_SECRET=your_secret_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

2. Seed the database (if applicable):
   ```bash
   cd backend_x
   npm run seed
   ```

#### Frontend Setup

1. The frontend uses environment variables from Expo. Configuration is typically done through:
   - `.env` files in the `my-app` directory
   - Supabase configuration in your project

### Running the Application

#### Backend
```bash
cd backend_x
npm start
# Server runs on http://localhost:3000
```

#### Frontend - Mobile (iOS)
```bash
cd full_project-main/my-app
npm run ios
```

#### Frontend - Mobile (Android)
```bash
cd full_project-main/my-app
npm run android
```

#### Frontend - Web
```bash
cd full_project-main/my-app
npm run web
```

#### Frontend - Start Development
```bash
cd full_project-main/my-app
npm start
```

## API Endpoints

The backend exposes the following main route categories:

- **Authentication**: `/api/auth/*` - Login, register, logout
- **Users**: `/api/users/*` - User management and profiles
- **Events**: `/api/events/*` - Event creation and management
- **AI Services**: `/api/ai/*` - AI-powered features
- **Files**: `/api/files/*` - File upload and management
- **Sponsors**: `/api/sponsors/*` - Sponsor management
- **Security**: `/api/security/*` - Security controls

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (default: 3000) |
| `JWT_SECRET` | Secret key for JWT token signing |
| `GROQ_API_KEY` | API key for Groq AI services |

### Frontend (.env or app.json)

- Configure your Supabase URL and key
- API base URL for backend connection
- Any platform-specific settings

## Database

The application uses PostgreSQL for data persistence. Tables include:
- Users
- Events
- Members
- Sponsors
- Files
- Audit logs
- Session data

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Rate Limiting**: API rate limiting to prevent abuse
- **User Blocking**: Admin controls to block/unblock users
- **CORS Configuration**: Proper cross-origin resource sharing
- **Encrypted Vault**: Secure storage for sensitive data

## AI Integration

The app integrates with **Groq AI** for:
- Intelligent event recommendations
- Automated member notifications
- Smart scheduling assistance
- Sentiment analysis for member feedback
- Agent-based automation

## Development

### Running Tests

```bash
cd backend_x
npm test
```

### Linting

```bash
cd full_project-main/my-app
npm run lint
```

## Deployment

### Backend
- Deployed on Render or similar Node.js hosting
- Database: Managed PostgreSQL instance
- Environment variables configured in hosting platform

### Frontend
- Expo-hosted builds for iOS/Android
- Web version deployable to Vercel, Netlify, or similar

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## Roadmap

- [ ] Advanced AI features
- [ ] Mobile app marketplace
- [ ] Enhanced analytics dashboard
- [ ] Integration with popular services (Google Calendar, Slack, etc.)
- [ ] Multi-language support
- [ ] Offline mode

---

**Last Updated**: May 2026
