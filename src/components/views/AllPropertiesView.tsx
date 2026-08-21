import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyCard } from '../property/PropertyCard';
import { PropertyMap } from '../property/PropertyMap';
import { MASTER_AMENITIES } from '../../data/initialData';
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  SlidersHorizontal, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Map as MapIcon, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AllPropertiesView: React.FC = () => {
  const { 
    filteredProperties, 
    filter, 
    updateFilter, 
    resetFilter, 
    formatPrice,
    properties 
  } = useRealEstate();

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const toggleAmenity = (amenity: string) => {
    const exists = filter.amenities.includes(amenity);
    if (exists) {
      updateFilter({ amenities: filter.amenities.filter(a => a !== amenity) });
    } else {
      updateFilter({ amenities: [...filter.amenities, amenity] });
    }
  };

  const activeFiltersCount = 
    (filter.search ? 1 : 0) +
    (filter.location ? 1 : 0) +
    (filter.propertyType ? 1 : 0) +
    (filter.purpose !== 'all' ? 1 : 0) +
    (filter.bedrooms ? 1 : 0) +
    (filter.bathrooms ? 1 : 0) +
    (filter.status ? 1 : 0) +
    filter.amenities.length;

  return (
    <div className="pt-28 pb-24 bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 pb-8 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>International Portfolio</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              All Prime Estates & Mansions
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Showing {filteredProperties.length} of {properties.length} verified sovereign residences worldwide.
            </p>
          </div>

          {/* View Mode & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#141B2D] border border-slate-800 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map'
                    ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Interactive Map Split View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filter.sortBy}
                onChange={e => updateFilter({ sortBy: e.target.value as any })}
                className="px-4 py-2.5 rounded-xl bg-[#141B2D] border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#D4AF37] shadow-sm appearance-none pr-8 cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="area-desc">Sort: Area (Largest First)</option>
                <option value="popular">Sort: Most Viewed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
          </div>
        </div>

        {/* Active Filter Pills */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-slate-400 font-medium mr-1">Active Filters:</span>
            
            {filter.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold">
                "{filter.search}"
                <button onClick={() => updateFilter({ search: '' })}><X className="w-3 h-3" /></button>
              </span>
            )}

            {filter.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold">
                Location: {filter.location}
                <button onClick={() => updateFilter({ location: '' })}><X className="w-3 h-3" /></button>
              </span>
            )}

            {filter.propertyType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold">
                Type: {filter.propertyType}
                <button onClick={() => updateFilter({ propertyType: '' })}><X className="w-3 h-3" /></button>
              </span>
            )}

            {filter.purpose !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold">
                Purpose: For {filter.purpose}
                <button onClick={() => updateFilter({ purpose: 'all' })}><X className="w-3 h-3" /></button>
              </span>
            )}

            {filter.amenities.map(am => (
              <span key={am} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold">
                {am}
                <button onClick={() => toggleAmenity(am)}><X className="w-3 h-3" /></button>
              </span>
            ))}

            <button
              onClick={resetFilter}
              className="text-xs text-rose-500 hover:underline font-bold ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}

        {/* Main Layout Grid (Left Sidebar + Right Property Catalog) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 bg-[#141B2D] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Filter Portfolio
                </h3>
              </div>
              <button
                onClick={resetFilter}
                className="text-xs text-[#D4AF37] hover:underline font-medium"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Bel-Air, Penthouse..."
                  value={filter.search}
                  onChange={e => updateFilter({ search: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Location Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Global Location
              </label>
              <select
                value={filter.location}
                onChange={e => updateFilter({ location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">All Global Markets</option>
                <option value="New York">New York City</option>
                <option value="Dubai">Dubai & Palm Jumeirah</option>
                <option value="Los Angeles">Los Angeles & Bel-Air</option>
                <option value="Lake Como">Lake Como, Italy</option>
                <option value="London">London Kensington & Mayfair</option>
                <option value="France">French Riviera & Courchevel</option>
                <option value="Bahamas">Bahamas & Caribbean</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Architecture Type
              </label>
              <select
                value={filter.propertyType}
                onChange={e => updateFilter({ propertyType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">All Categories</option>
                <option value="Penthouse">Sky Penthouses</option>
                <option value="Villa">Waterfront Villas</option>
                <option value="Mansion">Promontory Mansions</option>
                <option value="Island">Private Islands</option>
                <option value="Estate">Historic Palazzos</option>
                <option value="Chalet">Alpine Chalets</option>
              </select>
            </div>

            {/* Purpose */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Acquisition Purpose
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-800">
                {(['all', 'Sale', 'Rent'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => updateFilter({ purpose: p })}
                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      filter.purpose === p
                        ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p === 'all' ? 'All' : p === 'Sale' ? 'Buy' : 'Lease'}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Max Valuation
                </label>
                <span className="text-xs font-bold text-[#D4AF37]">
                  {formatPrice(filter.maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={100000000}
                step={2000000}
                value={filter.maxPrice}
                onChange={e => updateFilter({ maxPrice: Number(e.target.value) })}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Bedrooms
                </label>
                <select
                  value={filter.bedrooms}
                  onChange={e => updateFilter({ bedrooms: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Any Beds</option>
                  <option value="4">4+ Suites</option>
                  <option value="6">6+ Suites</option>
                  <option value="8">8+ Suites</option>
                  <option value="10">10+ Suites</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Bathrooms
                </label>
                <select
                  value={filter.bathrooms}
                  onChange={e => updateFilter({ bathrooms: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">Any Baths</option>
                  <option value="4">4+ Baths</option>
                  <option value="6">6+ Baths</option>
                  <option value="8">8+ Baths</option>
                </select>
              </div>
            </div>

            {/* Amenities Multi-Check */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Luxury Amenities
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {MASTER_AMENITIES.slice(0, 10).map(amenity => {
                  const checked = filter.amenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 text-xs text-slate-300 hover:text-[#D4AF37] cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Properties Catalog or Map View */}
          <div className="lg:col-span-9 space-y-8">
            {viewMode === 'map' ? (
              <div className="space-y-6">
                <PropertyMap properties={filteredProperties} className="h-[550px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map(property => (
                    <PropertyCard key={property.id} property={property} compact />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {filteredProperties.length === 0 ? (
                  <div className="p-16 text-center bg-[#141B2D] rounded-2xl border border-slate-800 space-y-4">
                    <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto" />
                    <h3 className="text-xl font-serif font-bold text-white">
                      No Sovereign Residences Match Criteria
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Adjust your filters or contact our Private Client Concierge for unlisted off-market opportunities.
                    </p>
                    <button
                      onClick={resetFilter}
                      className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.slice(0, itemsPerPage).map(property => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {filteredProperties.length > itemsPerPage && (
                  <div className="text-center pt-8">
                    <button
                      onClick={() => setItemsPerPage(prev => prev + 6)}
                      className="px-8 py-3 rounded-xl bg-[#141B2D] border border-slate-700 hover:border-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    >
                      Load More Sovereign Estates
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#141B2D] rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden text-white shadow-2xl p-6 space-y-4 border border-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="font-serif font-bold text-lg text-white">Filter Properties</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 flex-1 pr-1">
                <div>
                  <label className="text-xs font-bold block mb-1 text-slate-400">Search</label>
                  <input
                    type="text"
                    placeholder="Search titles, cities..."
                    value={filter.search}
                    onChange={e => updateFilter({ search: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1 text-slate-400">Location</label>
                  <select
                    value={filter.location}
                    onChange={e => updateFilter({ location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-white"
                  >
                    <option value="">All Locations</option>
                    <option value="New York">New York</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Lake Como">Lake Como</option>
                    <option value="London">London</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1 text-slate-400">Property Type</label>
                  <select
                    value={filter.propertyType}
                    onChange={e => updateFilter({ propertyType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-white"
                  >
                    <option value="">All Types</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa</option>
                    <option value="Mansion">Mansion</option>
                    <option value="Island">Island</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  onClick={resetFilter}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F172A] text-slate-300 text-xs font-bold border border-slate-800"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold"
                >
                  Apply Filters ({filteredProperties.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
