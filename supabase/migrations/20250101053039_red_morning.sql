-- Contacts Management Tables

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  type text CHECK (type IN ('client', 'opposing_counsel', 'witness', 'expert', 'other')),
  organization text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Case Contacts Junction Table
CREATE TABLE IF NOT EXISTS case_contacts (
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  role text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (case_id, contact_id)
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their contacts"
  ON contacts FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage case contacts"
  ON case_contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_contacts.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(type);
CREATE INDEX IF NOT EXISTS idx_case_contacts_case ON case_contacts(case_id);
CREATE INDEX IF NOT EXISTS idx_case_contacts_contact ON case_contacts(contact_id);