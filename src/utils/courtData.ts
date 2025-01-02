import { STATE_CITIES, STATE_COURTS } from './courtConstants';

export function getStateCities(stateCode: string): string[] {
  return STATE_CITIES[stateCode.toLowerCase()] || [];
}

export function getStateCourts(stateCode: string): string[] {
  return STATE_COURTS[stateCode.toLowerCase()] || [];
}