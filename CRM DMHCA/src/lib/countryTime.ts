const countryTimezones: Record<string, string> = {
  IN: 'Asia/Kolkata',
  India: 'Asia/Kolkata',
  US: 'America/New_York',
  USA: 'America/New_York',
  BD: 'Asia/Dhaka',
  Bangladesh: 'Asia/Dhaka',
  NP: 'Asia/Kathmandu',
  Nepal: 'Asia/Kathmandu',
  PK: 'Asia/Karachi',
  PH: 'Asia/Manila',
  AE: 'Asia/Dubai',
  UAE: 'Asia/Dubai',
  // Add more as needed
};

export function getCountryTime(country: string): string {
  const tz = countryTimezones[country] || 'UTC';
  try {
    return new Date().toLocaleTimeString('en-US', { timeZone: tz });
  } catch {
    return '';
  }
}
