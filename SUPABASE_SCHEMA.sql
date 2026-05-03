-- Club Event Management App - Supabase SQL Schema
-- This schema is designed for a club management system with AI features
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Users profile table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('admin', 'member', 'sponsor', 'agent')) DEFAULT 'member',
  status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  bio TEXT,
  interests TEXT[], -- Array of interest tags
  phone TEXT,
  date_joined TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  metadata JSONB, -- Store additional user data
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CLUB EVENTS
-- ============================================

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('meeting', 'workshop', 'social', 'competition', 'fundraiser', 'other')),
  status TEXT CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')) DEFAULT 'draft',
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location TEXT,
  capacity INT,
  current_attendees INT DEFAULT 0,
  image_url TEXT,
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ai_generated BOOLEAN DEFAULT FALSE, -- Flag for AI-suggested events
  ai_agenda TEXT, -- AI-generated agenda
  tags TEXT[], -- Event categories/tags
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event attendees/registrations
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('registered', 'attended', 'cancelled', 'no-show')) DEFAULT 'registered',
  check_in_time TIMESTAMP,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- CLUB MEMBERS & MANAGEMENT
-- ============================================

-- Club members extended information
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  membership_tier TEXT CHECK (membership_tier IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze',
  membership_status TEXT CHECK (membership_status IN ('active', 'inactive', 'expired', 'suspended')) DEFAULT 'active',
  join_date TIMESTAMP DEFAULT NOW(),
  expiry_date TIMESTAMP,
  total_events_attended INT DEFAULT 0,
  points INT DEFAULT 0, -- Gamification points
  badges TEXT[], -- Achievement badges
  mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Member roles (for access control)
CREATE TABLE IF NOT EXISTS member_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  description TEXT,
  permissions TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_name)
);

-- ============================================
-- SPONSORS
-- ============================================

CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'ended')) DEFAULT 'active',
  sponsorship_tier TEXT CHECK (sponsorship_tier IN ('gold', 'silver', 'bronze')) DEFAULT 'bronze',
  annual_budget DECIMAL(10,2),
  events_sponsored INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AI FEATURES & INTERACTIONS
-- ============================================

-- AI interactions log (for tracking AI operations)
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interaction_type TEXT CHECK (interaction_type IN ('recommendation', 'sentiment_analysis', 'event_generation', 'notification', 'agenda_creation', 'other')),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  input_data TEXT,
  output_data TEXT,
  ai_model TEXT DEFAULT 'mixtral-8x7b-32768',
  processing_time_ms INT,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI-generated insights
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_type TEXT CHECK (insight_type IN ('member_recommendation', 'event_prediction', 'sentiment_summary', 'engagement_analysis', 'sponsorship_opportunity')),
  title TEXT NOT NULL,
  description TEXT,
  related_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  related_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
  recommendations TEXT[], -- Array of action items
  data JSONB,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MEMBER FEEDBACK & ENGAGEMENT
-- ============================================

-- Event feedback/reviews
CREATE TABLE IF NOT EXISTS event_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  ai_processed BOOLEAN DEFAULT FALSE, -- Indicates if AI analyzed this feedback
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Member preferences & interests
CREATE TABLE IF NOT EXISTS member_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  preferred_event_types TEXT[],
  preferred_time_slots TEXT[],
  notification_preferences JSONB, -- Push, email, SMS preferences
  privacy_level TEXT CHECK (privacy_level IN ('public', 'members_only', 'private')) DEFAULT 'members_only',
  data_sharing_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COMMUNICATIONS
-- ============================================

-- Announcements/Notifications
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT CHECK (announcement_type IN ('urgent', 'event', 'update', 'general')),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ai_generated BOOLEAN DEFAULT FALSE,
  target_audience TEXT CHECK (target_audience IN ('all', 'members', 'sponsors', 'admins')),
  scheduled_time TIMESTAMP,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- FILES & DOCUMENTS
-- ============================================

-- File storage tracking
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INT,
  bucket_path TEXT,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  related_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  file_category TEXT CHECK (file_category IN ('document', 'image', 'video', 'agenda', 'results', 'other')),
  visibility TEXT CHECK (visibility IN ('private', 'internal', 'public')) DEFAULT 'internal',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOG & AUDIT
-- ============================================

-- Activity log for tracking all actions
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT, -- 'user', 'event', 'member', 'sponsor', etc.
  entity_id UUID,
  description TEXT,
  changes JSONB, -- Track what changed
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- GAMIFICATION & POINTS
-- ============================================

-- Points/rewards transactions
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INT NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('event_attendance', 'feedback', 'referral', 'achievement', 'bonus', 'deduction')),
  description TEXT,
  related_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  criteria JSONB, -- Criteria for earning badge
  created_at TIMESTAMP DEFAULT NOW()
);

-- User badges earned
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(membership_status);
CREATE INDEX idx_event_feedback_event_id ON event_feedback(event_id);
CREATE INDEX idx_event_feedback_user_id ON event_feedback(user_id);
CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_announcements_published ON announcements(published);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Users can view public profile info
CREATE POLICY "Users can view profiles" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Events are viewable by everyone
CREATE POLICY "Events are viewable" ON events
  FOR SELECT USING (status = 'published' OR auth.uid() = organizer_id);

-- Members can register for events
CREATE POLICY "Members can register for events" ON event_attendees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own data
CREATE POLICY "Users can view own data" ON member_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON member_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Upcoming events with attendee count
CREATE OR REPLACE VIEW upcoming_events_summary AS
SELECT 
  e.id,
  e.title,
  e.start_time,
  e.end_time,
  e.location,
  u.full_name as organizer_name,
  COUNT(ea.id) as attendee_count,
  e.capacity,
  (COUNT(ea.id) * 100 / NULLIF(e.capacity, 0)) as capacity_percentage
FROM events e
LEFT JOIN users u ON e.organizer_id = u.id
LEFT JOIN event_attendees ea ON e.id = ea.event_id AND ea.status IN ('registered', 'attended')
WHERE e.status IN ('published', 'ongoing')
  AND e.start_time > NOW()
GROUP BY e.id, e.title, e.start_time, e.end_time, e.location, u.full_name;

-- View: Member engagement summary
CREATE OR REPLACE VIEW member_engagement_summary AS
SELECT 
  u.id,
  u.full_name,
  u.email,
  m.membership_tier,
  COUNT(DISTINCT ea.event_id) as events_attended,
  COALESCE(COUNT(DISTINCT ef.id), 0) as feedbacks_provided,
  m.points,
  m.total_events_attended,
  ROUND(100.0 * COUNT(DISTINCT ea.event_id) / NULLIF((SELECT COUNT(DISTINCT id) FROM events WHERE status IN ('published', 'completed')), 0)) as engagement_percentage
FROM users u
LEFT JOIN members m ON u.id = m.user_id
LEFT JOIN event_attendees ea ON u.id = ea.user_id AND ea.status = 'attended'
LEFT JOIN event_feedback ef ON u.id = ef.user_id
GROUP BY u.id, u.full_name, u.email, m.membership_tier, m.points, m.total_events_attended;

-- View: AI interaction summary
CREATE OR REPLACE VIEW ai_interaction_summary AS
SELECT 
  DATE(created_at) as date,
  interaction_type,
  COUNT(*) as total_interactions,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
  AVG(processing_time_ms) as avg_processing_time_ms
FROM ai_interactions
GROUP BY DATE(created_at), interaction_type;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update user last_login
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET last_login = NOW() WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status IN ('registered', 'attended') THEN
    UPDATE events SET current_attendees = current_attendees + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status IN ('registered', 'attended') THEN
    UPDATE events SET current_attendees = current_attendees - 1 WHERE id = OLD.event_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to add points to member
CREATE OR REPLACE FUNCTION add_member_points(
  p_user_id UUID,
  p_points INT,
  p_transaction_type TEXT,
  p_description TEXT,
  p_event_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Add transaction record
  INSERT INTO point_transactions (user_id, points, transaction_type, description, related_event_id)
  VALUES (p_user_id, p_points, p_transaction_type, p_description, p_event_id);
  
  -- Update member points
  UPDATE members SET points = points + p_points WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (optional)
-- ============================================

-- You can uncomment and modify these to add sample data for testing

-- INSERT INTO badges (badge_name, description, icon_url) VALUES
--   ('First Event', 'Attended your first event', 'https://example.com/badge1.png'),
--   ('Social Butterfly', 'Attended 5+ events', 'https://example.com/badge2.png'),
--   ('Feedback Champion', 'Provided 10+ reviews', 'https://example.com/badge3.png');
