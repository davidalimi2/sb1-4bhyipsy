-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access to lawyers" ON lawyers;
  DROP POLICY IF EXISTS "Public read access to lawyer education" ON lawyer_education;
  DROP POLICY IF EXISTS "Public read access to lawyer certifications" ON lawyer_certifications;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create lawyers table
CREATE TABLE IF NOT EXISTS lawyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  avatar_url text,
  location text NOT NULL,
  practice_areas text[] NOT NULL DEFAULT '{}',
  years_experience integer NOT NULL,
  cases_won integer DEFAULT 0,
  hourly_rate integer NOT NULL,
  rating numeric(3,2) DEFAULT 0,
  languages text[] NOT NULL DEFAULT '{}',
  bar_number text NOT NULL,
  bar_state text NOT NULL,
  availability text CHECK (availability IN ('immediate', 'within_week', 'within_month', 'unavailable')),
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lawyer education table
CREATE TABLE IF NOT EXISTS lawyer_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES lawyers(id) ON DELETE CASCADE,
  school text NOT NULL,
  degree text NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lawyer certifications table
CREATE TABLE IF NOT EXISTS lawyer_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid REFERENCES lawyers(id) ON DELETE CASCADE,
  name text NOT NULL,
  issuer text NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_certifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access to lawyers"
  ON lawyers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access to lawyer education"
  ON lawyer_education FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public read access to lawyer certifications"
  ON lawyer_certifications FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lawyers_practice_areas ON lawyers USING gin(practice_areas);
CREATE INDEX IF NOT EXISTS idx_lawyers_languages ON lawyers USING gin(languages);
CREATE INDEX IF NOT EXISTS idx_lawyers_location ON lawyers(location);
CREATE INDEX IF NOT EXISTS idx_lawyers_hourly_rate ON lawyers(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_lawyers_rating ON lawyers(rating);
CREATE INDEX IF NOT EXISTS idx_lawyer_education_lawyer ON lawyer_education(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_certifications_lawyer ON lawyer_certifications(lawyer_id);