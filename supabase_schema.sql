-- Master Dashboard Supabase Schema

-- 1. Websites Table
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Site Users Table
CREATE TABLE site_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  school_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'نشط', -- 'نشط' (Active) or 'غير نشط' (Inactive)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(website_id, email),
  UNIQUE(website_id, username)
);

-- 3. Site Data Table (Dynamic Content/Toggles)
CREATE TABLE site_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL, -- e.g., 'logo_url', 'welcome_text', 'show_announcements'
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(website_id, key_name)
);

-- 4. Contact Messages Table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Analytics Table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  total_visitors INT NOT NULL DEFAULT 0,
  total_logins INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Function to automatically update 'updated_at' on site_data and analytics
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_data_modtime
BEFORE UPDATE ON site_data
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_analytics_modtime
BEFORE UPDATE ON analytics
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Enable Row Level Security (RLS) policies if required for public usage in the future (Optional).
-- For a Master CMS Dashboard handled entirely by the server/Next.js API Routes (using Service Role key or verified API Keys), RLS can be kept disabled or restricted entirely to authenticated Dashboard admins.
