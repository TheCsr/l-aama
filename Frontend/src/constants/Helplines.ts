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
  KW: {
    countryCode: 'KW',
    countryName: 'Kuwait',
    emergencyPolice: '112',
    emergencyMedical: '112',
    mentalHealth: [
      { name: 'Kuwait Center for Mental Health', number: '112', description: 'Request mental health dispatch' },
    ],
    embassy: {
      address: 'Plot No. 504, Block 8, Street 13, Jabriya, Kuwait City',
      phone: '+965 2532 1603',
      email: 'eonkuwait@mofa.gov.np',
      website: 'https://kw.nepalembassy.gov.np',
    },
  },
  BH: {
    countryCode: 'BH',
    countryName: 'Bahrain',
    emergencyPolice: '999',
    emergencyMedical: '998',
    mentalHealth: [
      { name: 'Psychiatric Hospital', number: '+973 1728 8888', description: 'Psychiatric emergency reception' },
    ],
    embassy: {
      address: 'Building No. 2563, Road No. 2835, Block No. 328, Juffair, Manama',
      phone: '+973 1772 5583',
      email: 'eonmanama@mofa.gov.np',
      website: 'https://bh.nepalembassy.gov.np',
    },
  },
  OM: {
    countryCode: 'OM',
    countryName: 'Oman',
    emergencyPolice: '9999',
    emergencyMedical: '9999',
    mentalHealth: [
      { name: 'Al Masarra Hospital', number: '+968 24 870000', description: 'National Psychiatric Hospital' },
    ],
    embassy: {
      address: 'Way No. 3014, Building No. 1093, Shatti Al Qurum, Muscat',
      phone: '+968 24 696 177',
      email: 'eonmuscat@mofa.gov.np',
      website: 'https://om.nepalembassy.gov.np',
    },
  },

  // ─── ASIA ───
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    emergencyPolice: '112',
    emergencyMedical: '108',
    mentalHealth: [
      { name: 'KIRAN National Helpline', number: '1800 599 0019', description: 'Available 24/7 in 13 languages' },
      { name: 'Vandrevala Foundation', number: '9999 666 555', description: 'Mental health and crisis support' },
    ],
    embassy: {
      address: 'Barakhamba Road, New Delhi 110001',
      phone: '+91 11 2332 7361',
      email: 'eonnewdelhi@mofa.gov.np',
      website: 'https://in.nepalembassy.gov.np',
    },
  },
  MY: {
    countryCode: 'MY',
    countryName: 'Malaysia',
    emergencyPolice: '999',
    emergencyMedical: '999',
    mentalHealth: [
      { name: 'Befrienders KL', number: '03 7627 2929', description: 'Available 24/7' },
      { name: 'Talian Kasih', number: '15999', description: 'National support hotline' },
      { name: 'MIASA Line', number: '1-800-820-066', description: 'Mental Illness Awareness and Support' },
    ],
    embassy: {
      address: 'Wisma MCA, 163 Jalan Ampang, 50450 Kuala Lumpur',
      phone: '+60 3 2020 1836',
      email: 'eonkualalumpur@mofa.gov.np',
      website: 'https://my.nepalembassy.gov.np',
    },
  },
  JP: {
    countryCode: 'JP',
    countryName: 'Japan',
    emergencyPolice: '110',
    emergencyMedical: '119',
    mentalHealth: [
      { name: 'TELL Japan (English)', number: '03 5774 0992', description: 'Lifeline and Counselling' },
      { name: 'Inochi No Denwa', number: '0570 783 556', description: 'Japanese Lifeline' },
    ],
    embassy: {
      address: '6F, 3-23-20 Shimomeguro, Meguro-ku, Tokyo',
      phone: '+81 3 3713 6241',
      email: 'eontokyo@mofa.gov.np',
      website: 'https://jp.nepalembassy.gov.np',
    },
  },
  KR: {
    countryCode: 'KR',
    countryName: 'South Korea',
    emergencyPolice: '112',
    emergencyMedical: '119',
    mentalHealth: [
      { name: 'Lifeline Korea', number: '1588 9191', description: 'Available 24/7 for crisis support' },
      { name: 'Mental Health Crisis Line', number: '1577 0199', description: 'National 24/7 service' },
    ],
    embassy: {
      address: '19, Seonjam-ro 2-gil, Seongbuk-gu, Seoul 02844',
      phone: '+82 2 3789 8713',
      email: 'eonseoul@mofa.gov.np',
      website: 'https://kr.nepalembassy.gov.np',
    },
  },
  HK: {
    countryCode: 'HK',
    countryName: 'Hong Kong',
    emergencyPolice: '999',
    emergencyMedical: '999',
    mentalHealth: [
      { name: 'The Samaritans HK', number: '2896 0000', description: '24-hour multi-lingual hotline' },
    ],
    embassy: {
      address: 'Room 715, 7/F, China Minmetals Tower, 79 Chatham Road South, Tsim Sha Tsui',
      phone: '+852 2369 2981',
      email: 'cgnhk@biznetvigator.com',
      website: 'https://hk.nepalconsulate.gov.np',
    },
  },
  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    emergencyPolice: '999',
    emergencyMedical: '995',
    mentalHealth: [
      { name: 'Samaritans of Singapore', number: '1 767', description: '24-hour suicide prevention' },
      { name: 'IMH Mental Health Helpline', number: '6389 2222', description: 'Institute of Mental Health 24/7' },
    ],
    embassy: {
      address: 'High Street Centre, 1 North Bridge Road, Singapore (Honorary Consulate)',
      phone: '+65 6337 7780',
      email: 'nepalconsulatesg@gmail.com',
      website: 'https://sg.nepalconsulate.gov.np',
    },
  },

  // ─── EUROPE ───
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
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    emergencyPolice: '110',
    emergencyMedical: '112',
    mentalHealth: [
      { name: 'TelefonSeelsorge', number: '0800 111 0 111', description: 'Free, anonymous, 24/7' },
    ],
    embassy: {
      address: 'Guerickestrasse 27, 10587 BerlinCharlottenburg',
      phone: '+49 30 3435 9920',
      email: 'eonberlin@mofa.gov.np',
      website: 'https://de.nepalembassy.gov.np',
    },
  },
  PT: {
    countryCode: 'PT',
    countryName: 'Portugal',
    emergencyPolice: '112',
    emergencyMedical: '112',
    mentalHealth: [
      { name: 'Linha SNS24', number: '808 24 24 24', description: 'Press 4 for psychological counselling' },
      { name: 'Voz de Apoio', number: '21 354 45 45', description: 'Emotional support line' },
    ],
    embassy: {
      address: 'Av. Conselheiro Fernando de Sousa, No. 11, 4G, 1070-072 Lisbon (Honorary Consulate)',
      phone: '+351 21 099 2244',
      email: 'consuladonepal.pt@gmail.com',
      website: 'https://de.nepalembassy.gov.np', // Covered by Berlin mostly, but this is the Lisbon presence
    },
  },
  PL: {
    countryCode: 'PL',
    countryName: 'Poland',
    emergencyPolice: '112',
    emergencyMedical: '112',
    mentalHealth: [
      { name: 'Kryzysowy Telefon Zaufania', number: '116 123', description: 'Support for adults in emotional crisis' },
    ],
    embassy: {
      address: 'ul. Koszykowa 6, 00-564 Warsaw (Honorary Consulate)',
      phone: '+48 22 849 53 14',
      email: 'nepalconsulate@wp.pl',
      website: 'https://de.nepalembassy.gov.np', // Handled by Germany Embassy
    },
  },
  CY: {
    countryCode: 'CY',
    countryName: 'Cyprus',
    emergencyPolice: '112',
    emergencyMedical: '112',
    mentalHealth: [
      { name: 'Samaritans Cyprus', number: '8000 7773', description: 'English speaking support line' },
    ],
    embassy: {
      address: 'Tel Aviv Embassy handles Cyprus issues. Hon. Consulate Nicosia: 17, Stassinou Ave, Nicosia',
      phone: '+357 22 37 44 11',
      email: 'nepalconsulatecyprus@gmail.com',
      website: 'https://il.nepalembassy.gov.np',
    },
  },

  // ─── AMERICAS & OCEANIA ───
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
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    emergencyPolice: '911',
    emergencyMedical: '911',
    mentalHealth: [
      { name: 'Talk Suicide Canada', number: '1-833-456-4566', description: 'Available 24/7' },
      { name: 'Kids Help Phone', number: '1-800-668-6868', description: 'For youth and youth adults' },
    ],
    embassy: {
      address: '130 Albert Street, Suite 1810, Ottawa, ON K1P 5G4',
      phone: '+1 613 680 5513',
      email: 'eonottawa@mofa.gov.np',
      website: 'https://ca.nepalembassy.gov.np',
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
  NZ: {
    countryCode: 'NZ',
    countryName: 'New Zealand',
    emergencyPolice: '111',
    emergencyMedical: '111',
    mentalHealth: [
      { name: 'Lifeline Aotearoa', number: '0800 543 354', description: 'Free text 4357' },
      { name: 'Need to talk? 1737', number: '1737', description: 'Call or text' },
    ],
    embassy: {
      address: 'Level 1, Epicentre Building, 100 Taranaki St, Wellington (Honorary Consulate)',
      phone: '+64 4 384 4141',
      email: 'hon.consul@nepalconsulate.org.nz',
      website: 'https://nepalconsulate.org.nz',
    },
  },

  // ─── DEFAULT ───
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
