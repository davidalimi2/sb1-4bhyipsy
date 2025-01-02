import { COURT_BRANCHES } from './courtConstants';

export function getCourtBranches(stateCode: string, court: string, city?: string): string[] {
  const stateCourts = COURT_BRANCHES[stateCode.toLowerCase()];
  if (!stateCourts) {
    console.warn(`No courts found for state: ${stateCode}`);
    return [];
  }

  // If no city specified or city is 'all', return all branches for this court
  if (!city || city === 'all') {
    const branches = stateCourts[court];
    if (!branches) {
      console.warn(`No branches found for court: ${court}`);
      return [];
    }
    return branches;
  }

  // Look for city-specific court branches
  const citySpecificCourt = `${court} - ${city}`;
  const cityBranches = stateCourts[citySpecificCourt];
  if (cityBranches && cityBranches.length > 0) {
    return cityBranches;
  }

  // If no city-specific branches found, try to filter general branches by city
  const generalBranches = stateCourts[court];
  if (generalBranches) {
    const cityFiltered = generalBranches.filter(branch => 
      branch.toLowerCase().includes(city.toLowerCase()) ||
      branch.toLowerCase().includes(city.toLowerCase().replace(' ', '')) ||
      branch.toLowerCase().includes(city.toLowerCase().split(' ')[0])
    );
    return cityFiltered.length > 0 ? cityFiltered : generalBranches;
  }

  console.warn(`No branches found for court: ${court} and city: ${city}`);
  return [];
}