import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  Lead, 
  Testimonial, 
  SiteSettings, 
  AdminUser, 
  PropertyFilterState,
  LeadStatus,
  RealtorProfile,
  ChatMessage
} from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';
import { INITIAL_TESTIMONIALS, INITIAL_LEADS, INITIAL_SETTINGS } from '../data/initialData';
import { DEFAULT_REALTOR_PROFILE, REALTOR_PRESETS } from '../data/realtorPresets';
import confetti from 'canvas-confetti';

export type NavigationPage = 
  | 'home'
  | 'properties'
  | 'property-details'
  | 'why-choose'
  | 'about'
  | 'contact'
  | 'compare'
  | 'wishlist'
  | 'admin'
  | 'admin-login'
  | 'admin-dashboard'
  | 'seo-engine';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const DEFAULT_FILTER: PropertyFilterState = {
  search: '',
  location: '',
  propertyType: '',
  purpose: 'all',
  minPrice: 0,
  maxPrice: 100000000,
  bedrooms: '',
  bathrooms: '',
  status: '',
  amenities: [],
  sortBy: 'newest'
};

interface RealEstateContextType {
  // Properties
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'views' | 'rating'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  duplicateProperty: (id: string) => void;
  toggleFeatured: (id: string) => void;
  togglePublished: (id: string) => void;
  
  // Navigation & View
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  selectedPropertyId: string | null;
  navigateToPropertyDetails: (id: string) => void;
  selectedProperty: Property | undefined;
  
  // Filter State
  filter: PropertyFilterState;
  setFilter: React.Dispatch<React.SetStateAction<PropertyFilterState>>;
  updateFilter: (updates: Partial<PropertyFilterState>) => void;
  resetFilter: () => void;
  filteredProperties: Property[];
  
  // Leads / Inquiries
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadStatus, notes?: string) => void;
  deleteLead: (id: string) => void;
  exportLeadsToCSV: () => void;
  
  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (t: Omit<Testimonial, 'id' | 'date'>) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  
  // Settings
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  
  // Realtor & Local SEO Engine State
  realtorProfile: RealtorProfile;
  updateRealtorProfile: (updates: Partial<RealtorProfile>) => void;
  loadRealtorPreset: (presetIndex: number) => void;
  resetRealtorProfile: () => void;
  generateDynamicUrl: (profile?: Partial<RealtorProfile>) => string;
  isCustomDemoActive: boolean;
  isAgencyMode: boolean;
  setIsAgencyMode: (active: boolean) => void;
  toggleAgencyMode: () => void;
  
  // AI Chat Assistant
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  
  // Wishlist & Compare
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  compareList: string[];
  toggleCompare: (id: string) => void;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;
  recentViewed: string[];
  
  // Currency & Theme
  currency: 'USD' | 'EUR' | 'GBP' | 'AED' | 'CHF';
  setCurrency: (c: 'USD' | 'EUR' | 'GBP' | 'AED' | 'CHF') => void;
  formatPrice: (amount: number) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Admin Auth
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  loginAdmin: (email?: string, pass?: string) => boolean;
  loginAsDemoClient: () => void;
  logoutAdmin: () => void;
  
  // Modals
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  bookingProperty: Property | null;
  openBookingModal: (prop?: Property) => void;
  
  brochureModalOpen: boolean;
  setBrochureModalOpen: (open: boolean) => void;
  brochureProperty: Property | null;
  openBrochureModal: (prop: Property) => void;
  
  virtualTourModalOpen: boolean;
  setVirtualTourModalOpen: (open: boolean) => void;
  tourProperty: Property | null;
  openVirtualTourModal: (prop: Property) => void;
  
  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

export const RealEstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse dynamic URL parameters on startup (supporting ?name=... or #/demo?name=...)
  const parseUrlRealtor = (): RealtorProfile => {
    try {
      if (typeof window === 'undefined') return DEFAULT_REALTOR_PROFILE;
      
      const searchStr = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
      const params = new URLSearchParams(searchStr);
      
      const name = params.get('name') || params.get('realtor') || params.get('company');
      const city = params.get('city') || params.get('loc') || params.get('location');
      const phone = params.get('phone') || params.get('tel');
      const email = params.get('email');
      const address = params.get('addr') || params.get('address');
      const agentName = params.get('agent') || params.get('agentName') || name;
      const primaryKeyword = params.get('keyword') || params.get('kw') || 'Top-Rated 5-Star Professional Realtor';
      const whatsapp = params.get('wa') || params.get('whatsapp') || phone;

      if (name || city || phone) {
        return {
          ...DEFAULT_REALTOR_PROFILE,
          name: name || DEFAULT_REALTOR_PROFILE.name,
          agentName: agentName || name || DEFAULT_REALTOR_PROFILE.agentName,
          city: city || DEFAULT_REALTOR_PROFILE.city,
          phone: phone || DEFAULT_REALTOR_PROFILE.phone,
          email: email || (name ? `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` : DEFAULT_REALTOR_PROFILE.email),
          address: address || (city ? `Prime Business District, ${city}` : DEFAULT_REALTOR_PROFILE.address),
          whatsapp: whatsapp ? whatsapp.replace(/[^0-9+]/g, '') : DEFAULT_REALTOR_PROFILE.whatsapp,
          primaryKeyword: primaryKeyword || DEFAULT_REALTOR_PROFILE.primaryKeyword,
          isCustomDemo: true
        };
      }
    } catch (e) {
      console.error('Error parsing URL parameters:', e);
    }
    
    // Check saved custom profile
    const saved = localStorage.getItem('aura_realtor_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_REALTOR_PROFILE;
  };

  // Realtor State
  const [realtorProfile, setRealtorProfile] = useState<RealtorProfile>(parseUrlRealtor);

  // Agency Master Mode State (Only active for the agency owner via ?agency=true or Alt+A)
  const [isAgencyMode, setIsAgencyModeState] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const searchStr = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
      const params = new URLSearchParams(searchStr);
      if (params.get('agency') === 'true' || params.get('agency') === '1' || params.get('master') === 'true') {
        localStorage.setItem('aura_agency_mode', 'true');
        return true;
      }
      return localStorage.getItem('aura_agency_mode') === 'true';
    } catch (e) {
      return false;
    }
  });

  const setIsAgencyMode = (active: boolean) => {
    setIsAgencyModeState(active);
    if (active) {
      localStorage.setItem('aura_agency_mode', 'true');
    } else {
      localStorage.removeItem('aura_agency_mode');
    }
  };

  const toggleAgencyMode = () => {
    setIsAgencyModeState(prev => {
      const next = !prev;
      if (next) {
        localStorage.setItem('aura_agency_mode', 'true');
        showToast('Agency Master Mode Activated (SEO Generator Unlocked)', 'success');
      } else {
        localStorage.removeItem('aura_agency_mode');
        showToast('Switched to Client Preview Mode', 'info');
      }
      return next;
    });
  };

  // Keyboard shortcut: Alt+A or Ctrl+Shift+A for agency master toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        toggleAgencyMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Properties State
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('aura_properties');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PROPERTIES;
  });

  // Leads State
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('aura_leads');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LEADS;
  });

  // Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('aura_testimonials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TESTIMONIALS;
  });

  // Settings State
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('aura_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SETTINGS;
  });

  // Navigation State
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Filter State
  const [filter, setFilter] = useState<PropertyFilterState>(DEFAULT_FILTER);

  // User Engagement State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_wishlist');
    return saved ? JSON.parse(saved) : ['prop-1', 'prop-3'];
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_compare');
    return saved ? JSON.parse(saved) : ['prop-1', 'prop-2'];
  });

  const [recentViewed, setRecentViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_recent');
    return saved ? JSON.parse(saved) : ['prop-1', 'prop-2', 'prop-3'];
  });

  // AI Chat Messages State
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I'm the AI Assistant for ${realtorProfile.name || 'our private brokerage'} in ${realtorProfile.city || 'your area'}. How can I assist with your luxury property search or private showing today?`,
      timestamp: 'Just now',
      quickActions: [
        { label: `View Properties in ${realtorProfile.city.split(',')[0]}`, action: 'view_properties' },
        { label: 'Schedule Private Showing', action: 'schedule_showing' },
        { label: 'Get Free Home Valuation', action: 'home_valuation' },
        { label: `Contact ${realtorProfile.agentName || 'Advisor'}`, action: 'direct_call' }
      ]
    }
  ]);

  // Update initial AI greeting when realtor profile changes
  useEffect(() => {
    setChatMessages([
      {
        id: 'msg-1',
        sender: 'ai',
        text: `Hello! I'm the AI Real Estate Concierge for ${realtorProfile.name} in ${realtorProfile.city}. How can I assist with your property search or private showing today?`,
        timestamp: 'Just now',
        quickActions: [
          { label: `View Listings in ${realtorProfile.city.split(',')[0]}`, action: 'view_properties' },
          { label: 'Schedule VIP Showing', action: 'schedule_showing' },
          { label: 'Request Market Valuation', action: 'home_valuation' },
          { label: `Direct WhatsApp with ${realtorProfile.agentName}`, action: 'whatsapp_realtor' }
        ]
      }
    ]);
  }, [realtorProfile.name, realtorProfile.city, realtorProfile.agentName]);

  // Preferences
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'AED' | 'CHF'>('USD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('aura_admin_token');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  const isAdminLoggedIn = adminUser !== null;

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);

  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [brochureProperty, setBrochureProperty] = useState<Property | null>(null);

  const [virtualTourModalOpen, setVirtualTourModalOpen] = useState(false);
  const [tourProperty, setTourProperty] = useState<Property | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aura_realtor_profile', JSON.stringify(realtorProfile));
  }, [realtorProfile]);

  useEffect(() => {
    localStorage.setItem('aura_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('aura_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('aura_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('aura_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('aura_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('aura_recent', JSON.stringify(recentViewed));
  }, [recentViewed]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Realtor Profile Methods
  const updateRealtorProfile = (updates: Partial<RealtorProfile>) => {
    setRealtorProfile(prev => ({
      ...prev,
      ...updates,
      isCustomDemo: true
    }));
    showToast(`Updated demo profile for ${updates.name || realtorProfile.name}!`);
  };

  const loadRealtorPreset = (index: number) => {
    const preset = REALTOR_PRESETS[index];
    if (preset) {
      setRealtorProfile({ ...preset, isCustomDemo: true });
      showToast(`Loaded live SEO demo for ${preset.name} in ${preset.city}!`);
    }
  };

  const resetRealtorProfile = () => {
    setRealtorProfile(DEFAULT_REALTOR_PROFILE);
    localStorage.removeItem('aura_realtor_profile');
    showToast('Reset to default flagship demonstration profile.', 'info');
  };

  // Clean Dynamic URL Generator for GitHub Pages & static hosting
  const generateDynamicUrl = (profile?: Partial<RealtorProfile>) => {
    const target = { ...realtorProfile, ...(profile || {}) };
    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://yourname.github.io/realtor-demo/';
    
    const params = new URLSearchParams();
    if (target.name) params.set('realtor', target.name);
    if (target.city) params.set('city', target.city);
    if (target.phone) params.set('phone', target.phone);
    if (target.email) params.set('email', target.email);
    if (target.address) params.set('addr', target.address);
    if (target.agentName && target.agentName !== target.name) params.set('agent', target.agentName);
    if (target.primaryKeyword) params.set('kw', target.primaryKeyword);
    if (target.whatsapp) params.set('wa', target.whatsapp);

    return `${baseUrl}?${params.toString()}`;
  };

  // AI Chat message sender
  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Intelligent context-aware AI response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let quickActions: { label: string; action: string }[] | undefined = undefined;

      if (lower.includes('schedule') || lower.includes('showing') || lower.includes('visit') || lower.includes('tour')) {
        reply = `I would be delighted to arrange a private VIP showing for you with ${realtorProfile.agentName} in ${realtorProfile.city}. What date and time works best for your schedule?`;
        quickActions = [
          { label: '📅 Open Booking Calendar', action: 'schedule_showing' },
          { label: `💬 WhatsApp ${realtorProfile.agentName}`, action: 'whatsapp_realtor' }
        ];
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('valuation') || lower.includes('worth') || lower.includes('sell')) {
        reply = `${realtorProfile.name} provides confidential, complimentary market valuations for prime properties across ${realtorProfile.city}. Please provide your property address or click below to submit your details.`;
        quickActions = [
          { label: '📊 Request Valuation Analysis', action: 'home_valuation' },
          { label: `📞 Call ${realtorProfile.phone}`, action: 'direct_call' }
        ];
      } else if (lower.includes('phone') || lower.includes('call') || lower.includes('contact') || lower.includes('email') || lower.includes('number')) {
        reply = `You can reach ${realtorProfile.agentName} directly at ${realtorProfile.phone} or via email at ${realtorProfile.email}. Office address: ${realtorProfile.address}.`;
        quickActions = [
          { label: `📞 Call ${realtorProfile.phone}`, action: 'direct_call' },
          { label: '💬 Open WhatsApp', action: 'whatsapp_realtor' }
        ];
      } else if (lower.includes('property') || lower.includes('properties') || lower.includes('villa') || lower.includes('house') || lower.includes('penthouse') || lower.includes('listing')) {
        reply = `We have exclusive private listings in ${realtorProfile.city}, ranging from contemporary luxury estates to discreet off-market holdings. Let me navigate you to our active portfolio.`;
        quickActions = [
          { label: '🏠 Browse All Listings', action: 'view_properties' },
          { label: '⭐ Compare Featured Estates', action: 'compare_properties' }
        ];
      } else {
        reply = `Thank you for your message! As the private digital concierge for ${realtorProfile.name} in ${realtorProfile.city}, I can assist with private showings, detailed neighborhood insights, off-market opportunities, or connecting you directly with ${realtorProfile.agentName}.`;
        quickActions = [
          { label: 'View Properties', action: 'view_properties' },
          { label: 'Schedule Showing', action: 'schedule_showing' },
          { label: 'WhatsApp Concierge', action: 'whatsapp_realtor' }
        ];
      }

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions
      };

      setChatMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  // Property Actions
  const addProperty = (newProp: Omit<Property, 'id' | 'createdAt' | 'views' | 'rating'>) => {
    const id = 'prop-' + Date.now();
    const created: Property = {
      ...newProp,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
      rating: 5.0
    };
    setProperties(prev => [created, ...prev]);
    showToast(`Property "${created.title}" successfully published!`);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Property details updated successfully.');
  };

  const deleteProperty = (id: string) => {
    const item = properties.find(p => p.id === id);
    setProperties(prev => prev.filter(p => p.id !== id));
    showToast(`Removed "${item?.title || 'Property'}" from portfolio.`, 'info');
  };

  const duplicateProperty = (id: string) => {
    const existing = properties.find(p => p.id === id);
    if (!existing) return;
    const duplicated: Property = {
      ...existing,
      id: 'prop-' + Date.now(),
      title: `${existing.title} (Copy)`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0
    };
    setProperties(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${existing.title}".`);
  };

  const toggleFeatured = (id: string) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, featured: !p.featured } : p)));
    showToast('Updated featured status.');
  };

  const togglePublished = (id: string) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, isPublished: !p.isPublished } : p)));
    showToast('Updated publication status.');
  };

  // Navigation Helper
  const navigateToPropertyDetails = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-details');
    setRecentViewed(prev => {
      const filtered = prev.filter(item => item !== id);
      return [id, ...filtered].slice(0, 8);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  // Filter Updates
  const updateFilter = (updates: Partial<PropertyFilterState>) => {
    setFilter(prev => ({ ...prev, ...updates }));
  };

  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
  };

  // Filtered Properties Computation
  const filteredProperties = properties.filter(prop => {
    if (!prop.isPublished && !adminUser) return false;

    if (filter.search.trim()) {
      const query = filter.search.toLowerCase();
      const match = 
        prop.title.toLowerCase().includes(query) ||
        prop.location.city.toLowerCase().includes(query) ||
        prop.location.country.toLowerCase().includes(query) ||
        prop.location.address.toLowerCase().includes(query) ||
        prop.propertyType.toLowerCase().includes(query) ||
        prop.description.toLowerCase().includes(query);
      if (!match) return false;
    }

    if (filter.location && filter.location !== 'all') {
      const locMatch = 
        prop.location.city.toLowerCase().includes(filter.location.toLowerCase()) ||
        prop.location.country.toLowerCase().includes(filter.location.toLowerCase());
      if (!locMatch) return false;
    }

    if (filter.propertyType && filter.propertyType !== 'all') {
      if (prop.propertyType.toLowerCase() !== filter.propertyType.toLowerCase()) return false;
    }

    if (filter.purpose && filter.purpose !== 'all') {
      if (prop.purpose !== filter.purpose) return false;
    }

    const priceToCheck = prop.discountPrice || prop.price;
    if (filter.minPrice && priceToCheck < filter.minPrice) return false;
    if (filter.maxPrice && priceToCheck > filter.maxPrice) return false;

    if (filter.bedrooms && filter.bedrooms !== 'all') {
      const minBeds = parseInt(filter.bedrooms, 10);
      if (prop.bedrooms < minBeds) return false;
    }

    if (filter.bathrooms && filter.bathrooms !== 'all') {
      const minBaths = parseInt(filter.bathrooms, 10);
      if (prop.bathrooms < minBaths) return false;
    }

    if (filter.status && filter.status !== 'all') {
      if (prop.status !== filter.status) return false;
    }

    if (filter.amenities.length > 0) {
      const hasAll = filter.amenities.every(amenity => prop.amenities.includes(amenity));
      if (!hasAll) return false;
    }

    return true;
  }).sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    if (filter.sortBy === 'price-asc') return priceA - priceB;
    if (filter.sortBy === 'price-desc') return priceB - priceA;
    if (filter.sortBy === 'area-desc') return b.area - a.area;
    if (filter.sortBy === 'popular') return b.views - a.views;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Leads
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Date.now(),
      status: 'New',
      createdAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
    };
    setLeads(prev => [newLead, ...prev]);
    showToast(`Your message has been sent to ${realtorProfile.agentName}! They will contact you shortly.`);
    
    if (leadData.type === 'schedule_visit') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateLeadStatus = (id: string, status: LeadStatus, notes?: string) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status, notes: notes !== undefined ? notes : l.notes } : l)));
    showToast(`Lead status updated to ${status}.`);
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    showToast('Lead removed.');
  };

  const exportLeadsToCSV = () => {
    const headers = ['ID', 'Type', 'Name', 'Email', 'Phone', 'Property', 'Date', 'Time Slot', 'Status', 'Created At', 'Message'];
    const rows = leads.map(l => [
      l.id,
      l.type,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      l.phone,
      `"${(l.propertyTitle || 'General').replace(/"/g, '""')}"`,
      l.date || '',
      l.timeSlot || '',
      l.status,
      l.createdAt,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${realtorProfile.name.replace(/[^a-zA-Z0-9]/g, '_')}_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads CSV exported successfully!');
  };

  // Testimonials
  const addTestimonial = (t: Omit<Testimonial, 'id' | 'date'>) => {
    const newT: Testimonial = {
      ...t,
      id: 'test-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setTestimonials(prev => [newT, ...prev]);
    showToast('Testimonial added successfully.');
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Testimonial updated.');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    showToast('Testimonial deleted.');
  };

  // Settings
  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    showToast('Website and API settings saved.');
  };

  // Wishlist & Compare
  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from Saved Wishlist.', 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast('Added to Saved Wishlist!');
        return [...prev, id];
      }
    });
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from comparison tray.', 'info');
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 properties simultaneously.', 'error');
          return prev;
        }
        showToast('Added to comparison tray!');
        return [...prev, id];
      }
    });
  };

  const isCompared = (id: string) => compareList.includes(id);

  const clearCompare = () => {
    setCompareList([]);
    showToast('Cleared comparison list.');
  };

  // Currency Formatter
  const formatPrice = (amount: number) => {
    const rates: Record<string, { rate: number, symbol: string, prefix: boolean }> = {
      USD: { rate: 1.0, symbol: '$', prefix: true },
      EUR: { rate: 0.92, symbol: '€', prefix: true },
      GBP: { rate: 0.79, symbol: '£', prefix: true },
      AED: { rate: 3.67, symbol: ' AED', prefix: false },
      CHF: { rate: 0.88, symbol: ' CHF', prefix: false }
    };

    const config = rates[currency] || rates.USD;
    const converted = amount * config.rate;

    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(converted);

    return config.prefix ? `${config.symbol}${formatted}` : `${formatted}${config.symbol}`;
  };

  // Admin Auth Methods
  const loginAdmin = (email: string = 'admin@auraestates.com', pass: string = 'luxury2026') => {
    const cleanEmail = email.toLowerCase().trim();
    // Allow either the master demo credentials OR client test login
    if (cleanEmail === 'admin@auraestates.com' && pass === 'luxury2026') {
      const user: AdminUser = {
        id: 'usr-1',
        name: realtorProfile.agentName || 'Alexander Sterling',
        email: cleanEmail,
        role: 'Super Admin',
        avatar: realtorProfile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        token: 'jwt_aura_session_' + Date.now()
      };
      setAdminUser(user);
      localStorage.setItem('aura_admin_token', JSON.stringify(user));
      showToast(`Welcome back, ${user.name}. Admin session verified.`);
      setCurrentPage('admin-dashboard');
      return true;
    } else if (cleanEmail && pass) {
      // Allow flexible test credentials for client preview
      const user: AdminUser = {
        id: 'usr-client',
        name: realtorProfile.agentName || 'Realtor Client',
        email: cleanEmail,
        role: 'Senior Partner',
        avatar: realtorProfile.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
        token: 'jwt_client_session_' + Date.now()
      };
      setAdminUser(user);
      localStorage.setItem('aura_admin_token', JSON.stringify(user));
      showToast(`Welcome, ${user.name}! Client Management Portal activated.`);
      setCurrentPage('admin-dashboard');
      return true;
    }
    showToast('Invalid credentials. Use demo credentials or click 1-Click Demo Login.', 'error');
    return false;
  };

  // 1-Click instant login for prospective clients testing the demo
  const loginAsDemoClient = () => {
    const user: AdminUser = {
      id: 'usr-demo-client',
      name: realtorProfile.agentName,
      email: realtorProfile.email,
      role: 'Super Admin',
      avatar: realtorProfile.avatar,
      token: 'jwt_demo_client_' + Date.now()
    };
    setAdminUser(user);
    localStorage.setItem('aura_admin_token', JSON.stringify(user));
    showToast(`Client Portal opened for ${realtorProfile.name}!`);
    setCurrentPage('admin-dashboard');
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('aura_admin_token');
    showToast('Logged out of Management Portal.');
    setCurrentPage('home');
  };

  // Modals
  const openBookingModal = (prop?: Property) => {
    setBookingProperty(prop || selectedProperty || properties[0]);
    setBookingModalOpen(true);
  };

  const openBrochureModal = (prop: Property) => {
    setBrochureProperty(prop);
    setBrochureModalOpen(true);
  };

  const openVirtualTourModal = (prop: Property) => {
    setTourProperty(prop);
    setVirtualTourModalOpen(true);
  };

  return (
    <RealEstateContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        duplicateProperty,
        toggleFeatured,
        togglePublished,
        currentPage,
        setCurrentPage,
        selectedPropertyId,
        navigateToPropertyDetails,
        selectedProperty,
        filter,
        setFilter,
        updateFilter,
        resetFilter,
        filteredProperties,
        leads,
        addLead,
        updateLeadStatus,
        deleteLead,
        exportLeadsToCSV,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        settings,
        updateSettings,
        realtorProfile,
        updateRealtorProfile,
        loadRealtorPreset,
        resetRealtorProfile,
        generateDynamicUrl,
        isCustomDemoActive: !!realtorProfile.isCustomDemo,
        isAgencyMode,
        setIsAgencyMode,
        toggleAgencyMode,
        chatMessages,
        sendChatMessage,
        isAiChatOpen,
        setIsAiChatOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        compareList,
        toggleCompare,
        isCompared,
        clearCompare,
        recentViewed,
        currency,
        setCurrency,
        formatPrice,
        theme,
        toggleTheme,
        adminUser,
        isAdminLoggedIn,
        loginAdmin,
        loginAsDemoClient,
        logoutAdmin,
        bookingModalOpen,
        setBookingModalOpen,
        bookingProperty,
        openBookingModal,
        brochureModalOpen,
        setBrochureModalOpen,
        brochureProperty,
        openBrochureModal,
        virtualTourModalOpen,
        setVirtualTourModalOpen,
        tourProperty,
        openVirtualTourModal,
        toasts,
        showToast,
        removeToast
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </RealEstateContext.Provider>
  );
};

export const useRealEstate = () => {
  const context = useContext(RealEstateContext);
  if (!context) {
    throw new Error('useRealEstate must be used within a RealEstateProvider');
  }
  return context;
};
