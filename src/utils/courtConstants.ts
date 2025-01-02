// Map of states to their major cities
export const STATE_CITIES: Record<string, string[]> = {
  al: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa'],
  ak: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'],
  az: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
  hi: ['Honolulu', 'Hilo', 'Kailua', 'Kaneohe', 'Waipahu'],
  // ... Add more states and cities as needed
};

// Map of states to their courts
export const STATE_COURTS: Record<string, string[]> = {
  hi: [
    'Hawaii Supreme Court',
    'Hawaii Intermediate Court of Appeals', 
    'Hawaii Circuit Courts',
    'Hawaii Family Courts',
    'Hawaii District Courts'
  ],
  al: [
    'Alabama Supreme Court',
    'Alabama Court of Civil Appeals',
    'Alabama Court of Criminal Appeals',
    'Alabama Circuit Courts',
    'Alabama District Courts',
    'Alabama Municipal Courts'
  ],
  ak: [
    'Alaska Supreme Court',
    'Alaska Court of Appeals',
    'Alaska Superior Courts',
    'Alaska District Courts',
    'Alaska Magistrate Courts'
  ],
  // ... Add more states and courts as needed
};

// Map of state and court to specific branches
export const COURT_BRANCHES: Record<string, Record<string, string[]>> = {
  hi: {
    'Hawaii Circuit Courts': [
      'First Circuit Court (Oahu)',
      'Second Circuit Court (Maui)',
      'Third Circuit Court (Hawaii)',
      'Fifth Circuit Court (Kauai)'
    ],
    'Hawaii District Courts': [
      'First District Court (Honolulu)',
      'Second District Court (Wailuku)', 
      'Third District Court (Hilo)',
      'Fifth District Court (Lihue)'
    ],
    'Hawaii Family Courts': [
      'First Circuit Family Court',
      'Second Circuit Family Court',
      'Third Circuit Family Court', 
      'Fifth Circuit Family Court'
    ]
  },
  al: {
    'Alabama Circuit Courts': [
      'Jefferson County Circuit Court',
      'Mobile County Circuit Court',
      'Madison County Circuit Court',
      'Montgomery County Circuit Court',
      'Tuscaloosa County Circuit Court'
    ],
    'Alabama District Courts': [
      'Jefferson County District Court',
      'Mobile County District Court',
      'Madison County District Court',
      'Montgomery County District Court',
      'Tuscaloosa County District Court'
    ]
  },
  ak: {
    'Alaska Superior Courts': [
      'Anchorage Superior Court',
      'Fairbanks Superior Court',
      'Juneau Superior Court',
      'Palmer Superior Court',
      'Kenai Superior Court'
    ],
    'Alaska District Courts': [
      'Anchorage District Court',
      'Fairbanks District Court',
      'Juneau District Court',
      'Palmer District Court',
      'Kenai District Court'
    ]
  },
  // ... Add more states and court branches as needed
};