// Map of state and court to specific branches
export const COURT_BRANCHES: Record<string, Record<string, string[]>> = {
  ny: {
    'New York Family Court': [
      'New York County Family Court',
      'Kings County Family Court',
      'Queens County Family Court',
      'Bronx County Family Court',
      'Richmond County Family Court',
      'Nassau County Family Court',
      'Suffolk County Family Court',
      'Westchester County Family Court',
      'Albany County Family Court',
      'Monroe County Family Court'
    ],
    'New York Supreme Court': [
      'New York County Supreme Court',
      'Kings County Supreme Court',
      'Queens County Supreme Court',
      'Bronx County Supreme Court',
      'Richmond County Supreme Court',
      'Nassau County Supreme Court',
      'Suffolk County Supreme Court',
      'Westchester County Supreme Court',
      'Albany County Supreme Court',
      'Monroe County Supreme Court'
    ]
  }
  // Add other states as needed
};