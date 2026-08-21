export type PropertyType = 'Villa' | 'Penthouse' | 'Mansion' | 'Apartment' | 'Island' | 'Estate' | 'Chalet';
export type PropertyPurpose = 'Sale' | 'Rent';
export type PropertyStatus = 'Ready' | 'Under Construction' | 'Sold' | 'Exclusive';
export type AreaUnit = 'sq ft' | 'sq m';

export interface LocationInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface NearbyPlace {
  name: string;
  category: 'School' | 'Hospital' | 'Mall' | 'Metro' | 'Airport' | 'Beach' | 'Helipad';
  distance: string;
  time: string;
}

export interface AgentInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
  experience: string;
  languages: string[];
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  purpose: PropertyPurpose;
  propertyType: PropertyType;
  location: LocationInfo;
  
  // Specifications
  bedrooms: number;
  bathrooms: number;
  balcony: number;
  parking: number;
  area: number;
  areaUnit: AreaUnit;
  yearBuilt: number;
  status: PropertyStatus;
  
  // Features & Amenities
  amenities: string[];
  
  // Media
  images: string[];
  thumbnail: string;
  floorPlan?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  
  // SEO & Metadata
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  featured: boolean;
  isPublished: boolean;
  views: number;
  rating: number;
  agent: AgentInfo;
  nearbyPlaces: NearbyPlace[];
  createdAt: string;
}

export type LeadType = 'contact' | 'inquiry' | 'schedule_visit' | 'call_back';
export type LeadStatus = 'New' | 'Contacted' | 'Scheduled' | 'Closed';

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  date?: string;
  timeSlot?: string;
  visitType?: 'In-Person VIP Tour' | 'Private Helicopter' | 'Live 4K Virtual Walkthrough';
  message: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  location: string;
  photo: string;
  rating: number;
  review: string;
  propertyBought?: string;
  featured: boolean;
  date: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  logo: string;
  favicon: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  googleMapsCoordinates: {
    lat: number;
    lng: number;
  };
  socialLinks: {
    instagram: string;
    linkedin: string;
    youtube: string;
    facebook: string;
    twitter: string;
  };
  smtpSettings: {
    host: string;
    port: number;
    user: string;
    senderEmail: string;
    secure: boolean;
  };
  currency: 'USD' | 'EUR' | 'GBP' | 'AED' | 'CHF';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Senior Partner' | 'Listing Manager';
  avatar: string;
  token: string;
}

export interface RealtorProfile {
  name: string; // e.g. "Vance & Co. Luxury Real Estate"
  agentName: string; // e.g. "Marcus Vance"
  title: string; // e.g. "Principal Broker & Managing Partner"
  city: string; // e.g. "Paso Robles, CA"
  address: string; // e.g. "1240 Spring Street, Paso Robles, CA 93446"
  phone: string; // e.g. "+1 (805) 238-9900"
  email: string; // e.g. "marcus@vanceproperties.com"
  whatsapp: string; // e.g. "+18052389900"
  primaryKeyword: string; // e.g. "5-Star Professional Realtor"
  salesVolume: string; // e.g. "$380M+"
  experienceYears: string; // e.g. "18+ Years"
  rating: number; // e.g. 5.0
  reviewCount: number; // e.g. 156
  avatar: string;
  bio?: string;
  isCustomDemo?: boolean;
}

export interface BatchRealtorItem {
  id: string;
  name: string;
  agentName?: string;
  city: string;
  phone: string;
  email: string;
  address?: string;
  whatsapp?: string;
  keyword?: string;
  salesVolume?: string;
  generatedUrl?: string;
  tinyUrl?: string;
  isShortening?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

export interface PropertyFilterState {
  search: string;
  location: string;
  propertyType: string;
  purpose: 'all' | 'Sale' | 'Rent';
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  status: string;
  amenities: string[];
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'area-desc' | 'popular';
}
