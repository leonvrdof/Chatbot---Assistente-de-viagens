/**
 * Simulated Database and Validation for Registered Contacts.
 * Identifies recurring contacts and recovers their profile name.
 */

export interface ContactRecord {
  phone: string;
  name: string;
  status: 'Contato recorrente' | 'Novo contato';
}

// Initial registered contacts database
export const INITIAL_CONTACTS_DB: Record<string, ContactRecord> = {
  '11992483496': {
    phone: '11992483496',
    name: 'Leonardo',
    status: 'Contato recorrente',
  },
};

/**
 * Normalizes phone input by removing spaces, parentheses, hyphens, and optional Brazil 55 country code
 */
export function normalizePhone(rawPhone: string): string {
  const digits = (rawPhone || '').replace(/\D/g, '');
  // If user entered +55 11 99248-3496 (13 digits), strip the 55 prefix
  if (digits.length > 11 && digits.startsWith('55')) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Simulates a lookup in the registered contacts database.
 * Returns ContactRecord if found, null otherwise.
 */
export function lookupContact(rawPhone: string): ContactRecord | null {
  const normalized = normalizePhone(rawPhone);
  if (!normalized) return null;
  return INITIAL_CONTACTS_DB[normalized] || null;
}

/**
 * Formats a phone number for display (e.g. (11) 99248-3496)
 */
export function formatPhoneDisplay(rawPhone: string): string {
  const digits = normalizePhone(rawPhone);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return rawPhone;
}
