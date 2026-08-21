import { Lead, SiteSettings, Testimonial } from '../types';

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Lord Alistair Sterling-Grant',
    role: 'Private Equity Chairman & Art Collector',
    location: 'London & Geneva',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    rating: 5,
    review: 'AURA Estates managed the acquisition of our Lake Como palazzo with unmatched discretion and architectural rigor. Their private client advisory team resolved complex heritage escrow in record time. Truly the world benchmark in high-end real estate.',
    propertyBought: 'Palazzo Del Lago, Lake Como',
    featured: true,
    date: '2025-01-20'
  },
  {
    id: 'test-2',
    clientName: 'Elena Rostova & Mikhail Rostov',
    role: 'Tech Founders & Angel Investors',
    location: 'Zurich & Dubai',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    rating: 5,
    review: 'From the private helicopter tour of the Palm Jumeirah waterfront to the bespoke interior hand-off with Roche Bobois, our experience with AURA was flawless. Their off-market listings are simply inaccessible anywhere else.',
    propertyBought: 'Villa Solaria, Palm Jumeirah',
    featured: true,
    date: '2025-02-04'
  },
  {
    id: 'test-3',
    clientName: 'Dr. Harrison & Sarah Vance',
    role: 'Biotech Executive & Philanthropist',
    location: 'New York City',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    rating: 5,
    review: 'Selling our Bel-Air promontory required absolute privacy and targeted access to global ultra-high-net-worth buyers. AURA achieved a record-setting closing within 45 days with zero public press leaks until finalized.',
    propertyBought: 'Bel-Air Promontory Estate, Los Angeles',
    featured: true,
    date: '2025-02-12'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    type: 'schedule_visit',
    name: 'Prince Faisal Al-Saud',
    email: 'faisal.office@investcorp.com',
    phone: '+971 50 992 4411',
    propertyId: 'prop-1',
    propertyTitle: 'The Sky Glass Penthouse at One Billionaire Row',
    date: '2025-03-05',
    timeSlot: '14:00 - 16:00 EST',
    visitType: 'In-Person VIP Tour',
    message: 'Requesting private viewing with principal advisor. Chauffeur transport required from JFK.',
    status: 'Scheduled',
    notes: 'Requested sommelier tasting during penthouse tour.',
    createdAt: '2025-02-14 11:30'
  },
  {
    id: 'lead-102',
    type: 'inquiry',
    name: 'Madame Claire Beaumont',
    email: 'c.beaumont@beaumontfamily.fr',
    phone: '+33 6 12 34 56 78',
    propertyId: 'prop-8',
    propertyTitle: 'Villa Riviera Celeste | Cap d’Antibes Waterfront',
    message: 'Inquiring regarding helipad permits and neighboring mooring rights for 45m vessel.',
    status: 'Contacted',
    notes: 'Legal memorandum and title deeds forwarded to her family office.',
    createdAt: '2025-02-15 09:15'
  },
  {
    id: 'lead-103',
    type: 'contact',
    name: 'Sebastian Wolfe',
    email: 'swolfe@wolfe-holdings.co.uk',
    phone: '+44 20 7946 0912',
    message: 'Looking to liquidate a prime Mayfair commercial/residential portfolio. Requesting confidential valuation.',
    status: 'New',
    createdAt: '2025-02-16 08:45'
  },
  {
    id: 'lead-104',
    type: 'call_back',
    name: 'Kenji Takahashi',
    email: 'k.takahashi@tokyofinancial.jp',
    phone: '+81 90 1234 5678',
    propertyId: 'prop-6',
    propertyTitle: 'Isla de la Luna | Private Caribbean Coral Atoll',
    message: 'Call back requested regarding solar micro-grid specifications and Bahamian permanent residency tax benefits.',
    status: 'New',
    createdAt: '2025-02-16 10:20'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'AURA Estates International',
  tagline: 'Private Client Ultra-Luxury Real Estate & Advisory',
  logo: 'AURA',
  favicon: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=64&q=80',
  contactNumber: '+1 (800) 920-AURA',
  whatsappNumber: '+12128809944',
  email: 'concierge@auraestates.com',
  address: '432 Park Avenue, 54th Floor, New York, NY 10022',
  googleMapsCoordinates: {
    lat: 40.7618,
    lng: -73.9712
  },
  socialLinks: {
    instagram: 'https://instagram.com/aura.luxuryestates',
    linkedin: 'https://linkedin.com/company/aura-estates',
    youtube: 'https://youtube.com/@auraestates',
    facebook: 'https://facebook.com/auraestates',
    twitter: 'https://twitter.com/auraestates'
  },
  smtpSettings: {
    host: 'smtp.mailgun.org',
    port: 587,
    user: 'postmaster@auraestates.com',
    senderEmail: 'notifications@auraestates.com',
    secure: true
  },
  currency: 'USD'
};

export const LUXURY_LOCATIONS = [
  { name: 'New York City', count: 18, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', country: 'United States' },
  { name: 'Dubai', count: 24, image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80', country: 'United Arab Emirates' },
  { name: 'Los Angeles', count: 15, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', country: 'United States' },
  { name: 'Lake Como', count: 9, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80', country: 'Italy' },
  { name: 'London', count: 12, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', country: 'United Kingdom' },
  { name: 'French Riviera', count: 14, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80', country: 'France' },
  { name: 'Courchevel 1850', count: 6, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80', country: 'France' },
  { name: 'Bahamas & Caribbean', count: 8, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', country: 'Bahamas' }
];

export const MASTER_AMENITIES = [
  'Infinity Pool',
  'Private Helipad Access',
  'Smart Home Automation',
  'Wine Cellar (2000 Bottles)',
  'Private Spa & Sauna',
  'Private Screening Cinema',
  '24/7 White Glove Concierge',
  'Private Elevator',
  'Gym & Wellness Suite',
  'Biometric Security',
  'Private 160ft Beachfront',
  'Private Yacht Berth',
  'Subterranean Auto Gallery (12 Cars)',
  'Tennis / Pickleball Championship Court',
  'Direct Ski-In / Ski-Out Access',
  'Solar Micro-Grid & 100% Self-Sustaining'
];
