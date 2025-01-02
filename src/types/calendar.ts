export type EventType = 'deadline' | 'hearing' | 'filing';
export type EventPriority = 'high' | 'medium' | 'low';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
  priority: EventPriority;
  caseId: string;
  caseName?: string;
  description?: string;
  location?: string;
  participants?: string[];
}