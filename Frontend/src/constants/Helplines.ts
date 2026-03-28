export interface HelplineContact {
  name: string;
  number: string;
  description?: string;
}

export interface EmbassyContact {
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface RegionalSupport {
  countryCode: string;
  countryName: string;
  emergencyPolice: string;
  emergencyMedical: string;
  mentalHealth: HelplineContact[];
  embassy: EmbassyContact;
}

export const SUPPORT_REGIONS: Record<string, RegionalSupport> = {
  US: {
    countryCode: 'US',
    countryName: 'United States',
    emergencyPolice: '911',
    emergencyMedical: '911',
    mentalHealth: [
      { name: 'Suicide & Crisis Lifeline', number: '988', description: 'Available 24/7 (Call or Text)' },
      { name: 'Crisis Text Line', number: '741741', description: 'Text HOME to 741741' },
      { name: 'SAMHSA National Helpline', number: '1-800-662-4357', description: 'Referral & info service' },
    ],
    embassy: {
      address: '2730 34th Place, NW, Washington, DC 20007',
      phone: '+1 202 774 4780',
      email: 'info@nepalembassyusa.org',
      website: 'https://us.nepalembassy.gov.np',
    },
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    emergencyPolice: '999',
    emergencyMedical: '999',
    mentalHealth: [
      { name: 'Samaritans', number: '116 123', description: 'Free, available 24/7' },
      { name: 'NHS Urgent Mental Health', number: '111', description: 'Call 111 & select mental health option (2)' },
      { name: 'Shout Crisis Text Line', number: '85258', description: 'Text SHOUT to 85258' },
    ],
    embassy: {
      address: '12A Kensington Palace Gardens, London W8 4QU',
      phone: '+44 207 229 1594',
      email: 'info@nepembassy.org.uk',
      website: 'https://uk.nepalembassy.gov.np',
    },
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia',
    emergencyPolice: '000',
    emergencyMedical: '000',
    mentalHealth: [
      { name: 'Lifeline', number: '13 11 14', description: 'Available 24/7' },
      { name: 'Beyond Blue', number: '1300 22 4636', description: 'Available 24/7 Support' },
      { name: 'Suicide Call Back Service', number: '1300 659 467', description: '24/7 Counselling' },
    ],
    embassy: {
      address: '22 Kareelah Vista, O\'Malley, Canberra ACT 2606',
      phone: '+61 02 6286 8006',
      email: 'eoncanberra@mofa.gov.np',
      website: 'https://au.nepalembassy.gov.np',
    },
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    emergencyPolice: '999',
    emergencyMedical: '998',
    mentalHealth: [
      { name: 'MoHAP Mental Support Line', number: '8004673', description: 'National support line, 24/7' },
      { name: 'Dubai Health Authority Helpline', number: '800111', description: 'Available 24/7' },
      { name: 'Abu Dhabi SAKINA Helpline', number: '800725462', description: 'Available 24/7' },
    ],
    embassy: {
      address: 'Villa No. 5, Plot No. 1, Sector 19_2, Al Aradah Street, Al Nahyan Area, Abu Dhabi',
      phone: '+971 2 634 4767',
      email: 'eonabudhabi@mofa.gov.np',
      website: 'https://ae.nepalembassy.gov.np',
    },
  },
  QA: {
    countryCode: 'QA',
    countryName: 'Qatar',
    emergencyPolice: '999',
    emergencyMedical: '999',
    mentalHealth: [
      { name: 'National Mental Health Helpline', number: '16000', description: 'Call 16000 and select mental health' },
      { name: 'Sidra Medicine (Women/Children)', number: '+974 4457 8333', description: '8am-8pm, Sun-Thu' },
    ],
    embassy: {
      address: 'Zone 56, Rawdat Umm Al-Theyab St, Street 681, Abu Hamour Area, Doha',
      phone: '+974 4467 5681',
      email: 'eondoha@mofa.gov.np',
      website: 'https://qa.nepalembassy.gov.np',
    },
  },
  SA: {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    emergencyPolice: '999',
    emergencyMedical: '997',
    mentalHealth: [
      { name: 'MOH Mental Health Helpline', number: '937', description: 'Available 24/7' },
      { name: 'National Center for Mental Health', number: '920033360', description: 'Available 24/7' },
      { name: 'Family Safety Program', number: '1919', description: 'Domestic Violence / Trauma 24/7' },
    ],
    embassy: {
      address: 'Al Urubah Street, Al-Jouf Road, Riyadh 11693',
      phone: '+966 11 461 1108',
      email: 'eonriyadh@mofa.gov.np',
      website: 'https://sa.nepalembassy.gov.np',
    },
  },
  DEFAULT: {
    countryCode: 'DEFAULT',
    countryName: 'International',
    emergencyPolice: '112', // standard GSM emergency number
    emergencyMedical: '112',
    mentalHealth: [
      { name: 'International Suicide Hotlines', number: 'https://blog.opencounseling.com/suicide-hotlines/', description: 'Find local support in your country' },
      { name: 'Befrienders Worldwide', number: 'https://www.befrienders.org/', description: 'Global network of helplines' }
    ],
    embassy: {
      address: 'Ministry of Foreign Affairs, Singha Durbar, Kathmandu, Nepal',
      phone: '+977 1 4200182',
      email: 'info@mofa.gov.np',
      website: 'https://mofa.gov.np',
    },
  }
};
