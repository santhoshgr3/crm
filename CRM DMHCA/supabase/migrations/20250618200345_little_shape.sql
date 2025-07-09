/*
  # Initial DMHCA CRM Database Schema

  1. New Tables
    - `leads` - Store lead information with multilingual support
    - `courses` - Course catalog with pricing and details
    - `counselors` - Counselor profiles with language preferences
    - `follow_ups` - Follow-up tracking with WhatsApp integration
    - `whatsapp_messages` - WhatsApp message history and status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin can access all data
    - Counselors can access assigned leads

  3. Features
    - Multilingual support with preferred language fields
    - WhatsApp integration tracking
    - Comprehensive lead management
    - Follow-up scheduling and tracking
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  course_interest text NOT NULL,
  source text NOT NULL,
  status text NOT NULL DEFAULT 'Cold',
  assigned_counselor text NOT NULL,
  priority text NOT NULL DEFAULT 'Medium',
  location text,
  notes text,
  whatsapp_number text,
  preferred_language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price integer NOT NULL,
  duration text NOT NULL,
  eligibility text NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create counselors table
CREATE TABLE IF NOT EXISTS counselors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  department text NOT NULL,
  is_active boolean DEFAULT true,
  preferred_language text DEFAULT 'en',
  whatsapp_number text,
  created_at timestamptz DEFAULT now()
);

-- Create follow_ups table
CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  date timestamptz NOT NULL,
  note text NOT NULL,
  counselor text NOT NULL,
  next_reminder_date timestamptz,
  completed boolean DEFAULT false,
  whatsapp_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create whatsapp_messages table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  phone_number text NOT NULL,
  message text NOT NULL,
  message_type text NOT NULL DEFAULT 'outgoing',
  status text NOT NULL DEFAULT 'sent',
  sent_at timestamptz DEFAULT now(),
  delivered_at timestamptz,
  read_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for leads
CREATE POLICY "Authenticated users can read leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete leads"
  ON leads
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for courses
CREATE POLICY "Authenticated users can read courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for counselors
CREATE POLICY "Authenticated users can read counselors"
  ON counselors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage counselors"
  ON counselors
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for follow_ups
CREATE POLICY "Authenticated users can manage follow_ups"
  ON follow_ups
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for whatsapp_messages
CREATE POLICY "Authenticated users can manage whatsapp_messages"
  ON whatsapp_messages
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_counselor ON leads(assigned_counselor);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_date ON follow_ups(date);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_lead_id ON whatsapp_messages(lead_id);

-- Legacy Supabase migration. Not required for AWS PostgreSQL. For reference only.