import type { ShareAnalytics } from '../types';

export function aggregateAnalytics(analytics: ShareAnalytics[]) {
  return {
    totalAccesses: analytics.length,
    byType: analytics.reduce((acc, item) => ({
      ...acc,
      [item.accessType]: (acc[item.accessType] || 0) + 1
    }), {} as Record<string, number>),
    byLocation: analytics.reduce((acc, item) => ({
      ...acc,
      [item.metadata?.location || 'Unknown']: (acc[item.metadata?.location || 'Unknown'] || 0) + 1
    }), {} as Record<string, number>),
    mostActive: analytics
      .reduce((acc, item) => ({
        ...acc,
        [item.accessedBy]: (acc[item.accessedBy] || 0) + 1
      }), {} as Record<string, number>)
  };
}