// Federal court system structure
export const FEDERAL_COURTS = {
  ussc: {
    name: 'Supreme Court of the United States',
    branches: ['Supreme Court of the United States']
  },
  fed_1st: {
    name: 'U.S. Court of Appeals for the First Circuit',
    branches: [
      'First Circuit - Boston',
      'First Circuit - Portland',
      'First Circuit - Providence',
      'First Circuit - San Juan'
    ]
  },
  fed_2nd: {
    name: 'U.S. Court of Appeals for the Second Circuit',
    branches: [
      'Second Circuit - New York City',
      'Second Circuit - Hartford',
      'Second Circuit - Buffalo'
    ]
  },
  fed_3rd: {
    name: 'U.S. Court of Appeals for the Third Circuit',
    branches: [
      'Third Circuit - Philadelphia',
      'Third Circuit - Pittsburgh',
      'Third Circuit - Newark'
    ]
  },
  fed_4th: {
    name: 'U.S. Court of Appeals for the Fourth Circuit',
    branches: [
      'Fourth Circuit - Richmond',
      'Fourth Circuit - Baltimore',
      'Fourth Circuit - Charlotte'
    ]
  },
  fed_5th: {
    name: 'U.S. Court of Appeals for the Fifth Circuit',
    branches: [
      'Fifth Circuit - New Orleans',
      'Fifth Circuit - Houston',
      'Fifth Circuit - Jackson'
    ]
  },
  fed_6th: {
    name: 'U.S. Court of Appeals for the Sixth Circuit',
    branches: [
      'Sixth Circuit - Cincinnati',
      'Sixth Circuit - Detroit',
      'Sixth Circuit - Louisville'
    ]
  },
  fed_7th: {
    name: 'U.S. Court of Appeals for the Seventh Circuit',
    branches: [
      'Seventh Circuit - Chicago',
      'Seventh Circuit - Milwaukee',
      'Seventh Circuit - Indianapolis'
    ]
  },
  fed_8th: {
    name: 'U.S. Court of Appeals for the Eighth Circuit',
    branches: [
      'Eighth Circuit - St. Louis',
      'Eighth Circuit - Kansas City',
      'Eighth Circuit - St. Paul'
    ]
  },
  fed_9th: {
    name: 'U.S. Court of Appeals for the Ninth Circuit',
    branches: [
      'Ninth Circuit - San Francisco',
      'Ninth Circuit - Los Angeles',
      'Ninth Circuit - Portland',
      'Ninth Circuit - Seattle',
      'Ninth Circuit - Phoenix'
    ]
  },
  fed_10th: {
    name: 'U.S. Court of Appeals for the Tenth Circuit',
    branches: [
      'Tenth Circuit - Denver',
      'Tenth Circuit - Oklahoma City',
      'Tenth Circuit - Salt Lake City'
    ]
  },
  fed_11th: {
    name: 'U.S. Court of Appeals for the Eleventh Circuit',
    branches: [
      'Eleventh Circuit - Atlanta',
      'Eleventh Circuit - Miami',
      'Eleventh Circuit - Montgomery'
    ]
  },
  fed_dc: {
    name: 'U.S. Court of Appeals for the D.C. Circuit',
    branches: ['D.C. Circuit - Washington, D.C.']
  },
  fed_federal: {
    name: 'U.S. Court of Appeals for the Federal Circuit',
    branches: ['Federal Circuit - Washington, D.C.']
  },
  district: {
    name: 'U.S. District Court',
    // District courts will be populated based on state/jurisdiction
    branches: []
  },
  bankruptcy: {
    name: 'U.S. Bankruptcy Court',
    // Bankruptcy courts will be populated based on state/jurisdiction
    branches: []
  }
};