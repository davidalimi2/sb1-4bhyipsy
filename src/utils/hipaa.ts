```typescript
// HIPAA compliance utilities

// PHI identifiers that need special handling
export const PHI_IDENTIFIERS = [
  'name',
  'address',
  'dates',
  'phone',
  'email',
  'ssn',
  'mrn', // Medical Record Number
  'health_plan',
  'account_numbers',
  'biometric_ids',
  'photos'
] as const;

type PHIIdentifier = typeof PHI_IDENTIFIERS[number];

// Data retention periods in days
export const RETENTION_PERIODS = {
  medical_records: 2190, // 6 years
  audit_logs: 2190,     // 6 years
  backups: 180,         // 6 months
  temp_files: 1         // 1 day
} as const;

// Validate if data contains PHI
export function containsPHI(data: any): boolean {
  if (typeof data === 'string') {
    // Check for common PHI patterns
    return PHI_IDENTIFIERS.some(identifier => 
      hasIdentifierPattern(data, identifier)
    );
  }
  
  if (typeof data === 'object' && data !== null) {
    return Object.values(data).some(value => containsPHI(value));
  }
  
  return false;
}

// Check if data matches PHI patterns
function hasIdentifierPattern(data: string, identifier: PHIIdentifier): boolean {
  const patterns = {
    ssn: /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
    email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    dates: /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/,
    mrn: /\b[A-Z]{2,3}\d{4,10}\b/i
  };

  return patterns[identifier as keyof typeof patterns]?.test(data) || false;
}

// Sanitize PHI from data
export function sanitizePHI(data: any): any {
  if (typeof data === 'string') {
    return PHI_IDENTIFIERS.reduce((sanitized, identifier) => 
      sanitized.replace(
        new RegExp(getIdentifierPattern(identifier), 'g'),
        `[REDACTED ${identifier.toUpperCase()}]`
      ),
      data
    );
  }
  
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((sanitized, [key, value]) => ({
      ...sanitized,
      [key]: sanitizePHI(value)
    }), {});
  }
  
  return data;
}

function getIdentifierPattern(identifier: PHIIdentifier): string {
  switch (identifier) {
    case 'ssn':
      return '\\b\\d{3}[-.]?\\d{2}[-.]?\\d{4}\\b';
    case 'phone':
      return '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b';
    case 'email':
      return '\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b';
    case 'dates':
      return '\\b\\d{1,2}[-/]\\d{1,2}[-/]\\d{2,4}\\b';
    default:
      return '';
  }
}

// Audit logging for PHI access
export async function logPHIAccess(
  userId: string,
  action: 'view' | 'modify' | 'delete',
  dataType: string,
  details: string
) {
  try {
    const { error } = await supabase.from('phi_access_logs').insert({
      user_id: userId,
      action,
      data_type: dataType,
      details,
      ip_address: await getClientIP(),
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to log PHI access:', error);
    // Don't throw - logging should not interrupt normal operation
  }
}

// Get client IP (for audit logging)
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
}
```