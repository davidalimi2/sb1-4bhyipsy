import { STATE_NAMES } from './states';
import { FEDERAL_COURTS } from './federal';
import { STATE_COURTS } from './courts';
import { STATE_CITIES } from './cities';
import { COURT_BRANCHES } from './branches';

export function getStateName(stateCode: string): string {
  return STATE_NAMES[stateCode.toLowerCase()] || stateCode;
}

export function getStateCourts(stateCode: string): string[] {
  // Handle federal courts
  if (stateCode.startsWith('fed_') || stateCode === 'ussc') {
    const federalCourt = FEDERAL_COURTS[stateCode];
    if (!federalCourt) return [];
    return [federalCourt.name];
  }
  
  // Handle state courts
  const stateCourts = STATE_COURTS[stateCode.toLowerCase()];
  if (!stateCourts) return [];
  return stateCourts;
}

export function getStateCities(stateCode: string): string[] {
  return STATE_CITIES[stateCode.toLowerCase()] || [];
}

export function getCourtBranches(stateCode: string, court: string, city?: string): string[] {
  // Handle federal courts
  if (stateCode.startsWith('fed_') || stateCode === 'ussc') {
    const federalCourt = FEDERAL_COURTS[stateCode];
    if (!federalCourt) return [];
    
    // Exact match on court name
    if (federalCourt.name === court) {
      return federalCourt.branches;
    }
    return [];
  }

  // Handle state courts
  const stateCourts = COURT_BRANCHES[stateCode.toLowerCase()];
  if (!stateCourts) return [];

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

  return [];
}