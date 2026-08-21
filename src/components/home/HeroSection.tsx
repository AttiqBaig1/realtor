import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  Search, 
  MapPin, 
  Home, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Users, 
  Building2,
  ChevronDown,
  Phone,
  MessageCircle,
  Star,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const { 
    setCurrentPage, 
    updateFilter, 
    openBookingModal,
    formatPrice,
    realtorProfile,
    isCustomDemoActive
  } = useRealEstate();

  const [searchPurpose, setSearchPurpose] = useState<'all' | 'Sale' | 'Rent'>('Sale');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMaxBudget, setSearchMaxBudget] = useState(100000000);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({
      purpose: searchPurpose,
      location: searchLocation,
      propertyType: searchType,
      maxPrice: searchMaxBudget
    });
    setCurrentPage('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroStats = [
    { label: 'Verified Career Sales', value: realtorProfile.salesVolume || '$380M+', icon: Award },
    { label: 'Client Satisfaction', value: `${realtorProfile.rating || 5.0} ★ (${realtorProfile.reviewCount || 150}+)`, icon: Users },
    { label: 'Local Market Tenure', value: realtorProfile.experienceYears || '18+ Years', icon: Building2 },
    { label: 'Confidential Discretion', value: '100%', icon: ShieldCheck }
  ];

  // Dynamic Local SEO Headline generator
  const getSeoHeadline = () => {
    const city = realtorProfile.city || 'Premier Locations';
    const keyword = realtorProfile.primaryKeyword || '5-Star Professional Realtor';
    return (
      <>
        {keyword} in <span className="gold-gradient-text">{city}</span>
      </>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 overflow-hidden bg-slate-950 text-white">
      
      {/* Background Architectural Luxury Image with Parallax & Dark Radial Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85"
          alt="Luxury Architecture"
          className="w-full h-full object-cover object-center brightness-[0.40] scale-105 transition-transform duration-[10000ms] hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-center py-8">
        
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-[0.2em] mb-6 shadow-xl w-fit"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{realtorProfile.name} • Certified Luxury Specialist</span>
        </motion.div>

        {/* Headlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-8"
          >
            {/* Dynamic Local SEO H1 Tag */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]" id="main-local-seo-h1">
              {getSeoHeadline()}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mt-4 leading-relaxed font-light">
              Represented by <strong>{realtorProfile.agentName}</strong> — providing high-touch residential acquisitions, bespoke marketing, and confidential private sales in {realtorProfile.city} and surrounding prime enclaves.
            </p>

            {/* Direct Realtor Verified NAP Trust Strip */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-5 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium text-slate-200">{realtorProfile.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${realtorProfile.phone}`} className="font-semibold text-amber-300 hover:underline">{realtorProfile.phone}</a>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Local Authority</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Action Button Matrix */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-3 justify-end"
          >
            {/* Direct WhatsApp Callout */}
            <a
              href={`https://wa.me/${realtorProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${realtorProfile.agentName}, I saw your ${realtorProfile.city} luxury property website and would like more details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02]"
              id="hero-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp {realtorProfile.agentName.split(' ')[0]} Directly</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setCurrentPage('properties');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all text-center"
              >
                <span>View Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => openBookingModal()}
                className="px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white font-semibold text-xs tracking-wider border border-slate-700 hover:border-amber-500/50 flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Book Showing</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Luxury Glassmorphic Quick Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-slate-900/90 backdrop-blur-2xl p-4 sm:p-6 rounded-2xl border border-slate-700/80 shadow-2xl"
        >
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4">
            {[
              { label: 'Buy Property', value: 'Sale' as const },
              { label: 'Rent Luxury Estate', value: 'Rent' as const },
              { label: 'All Prime Holdings', value: 'all' as const }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setSearchPurpose(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  searchPurpose === tab.value
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Location selector */}
            <div className="relative">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                Market / Neighborhood
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={realtorProfile.city || "Search city or area..."}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="relative">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                Property Category
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="Penthouse">Sky Penthouses</option>
                  <option value="Villa">Waterfront & Vineyard Villas</option>
                  <option value="Mansion">Promontory Mansions</option>
                  <option value="Island">Private Estates</option>
                  <option value="Estate">Architectural Residences</option>
                  <option value="Chalet">Alpine & Modern Chalets</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Budget Max */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Max Budget
                </label>
                <span className="text-xs font-bold text-amber-400">
                  {formatPrice(searchMaxBudget)}
                </span>
              </div>
              <div className="py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-700 flex items-center">
                <input
                  type="range"
                  min={1000000}
                  max={100000000}
                  step={2000000}
                  value={searchMaxBudget}
                  onChange={(e) => setSearchMaxBudget(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Search Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Floating Statistics Bottom Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80">
          {heroStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-serif font-bold text-white block leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-400 block font-medium">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
