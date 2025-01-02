-- Create video meetings table
CREATE TABLE IF NOT EXISTS video_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  host_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  scheduled_for timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  meeting_url text NOT NULL,
  status text CHECK (status IN ('scheduled', 'started', 'ended', 'cancelled')) DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meeting participants table
CREATE TABLE IF NOT EXISTS meeting_participants (
  meeting_id uuid REFERENCES video_meetings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  role text CHECK (role IN ('host', 'participant')) DEFAULT 'participant',
  joined_at timestamptz,
  PRIMARY KEY (meeting_id, user_id)
);

-- Enable RLS
ALTER TABLE video_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access meetings for their cases"
  ON video_meetings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = video_meetings.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can access meeting participants"
  ON meeting_participants FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_meetings m
      JOIN cases ON cases.id = m.case_id
      WHERE m.id = meeting_participants.meeting_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_video_meetings_case ON video_meetings(case_id);
CREATE INDEX IF NOT EXISTS idx_video_meetings_host ON video_meetings(host_id);
CREATE INDEX IF NOT EXISTS idx_video_meetings_scheduled ON video_meetings(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting ON meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_user ON meeting_participants(user_id);