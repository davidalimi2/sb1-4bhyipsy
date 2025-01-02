import { STATE_NAMES } from './courts/states';
import { FEDERAL_COURTS } from './courts/federal';
import { STATE_COURTS } from './courts/courts';
import { COURT_BRANCHES } from './courts/branches';
import { STATE_CITIES } from './courts/cities';

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

export function getCourtBranches(stateCode: string, court: string): string[] {
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

  // Try exact match first
  if (stateCourts[court]) {
    return stateCourts[court];
  }

  // Try matching by court name pattern
  const courtKey = Object.keys(stateCourts).find(key => 
    key.toLowerCase().includes(court.toLowerCase()) ||
    court.toLowerCase().includes(key.toLowerCase())
  );

  return courtKey ? stateCourts[courtKey] : [];
}