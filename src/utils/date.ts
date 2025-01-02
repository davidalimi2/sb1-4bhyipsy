export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const diff = Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function isUpcoming(date: Date, days: number = 7): boolean {
  const today = new Date();
  const diff = getDaysDifference(new Date(date), today);
  return diff <= days && diff >= 0;
}