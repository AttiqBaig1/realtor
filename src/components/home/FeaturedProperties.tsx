import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyCard } from '../property/PropertyCard';
import { Sparkles, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedProperties: React.FC = () => {
  const { properties, setCurrentPage, updateFilter } = useRealEstate();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { label: 'All Featured', value: 'all' },
    { label: 'Penthouses', value: 'Penthouse' },
    { label: 'Waterfront Villas', value: 'Villa' },
    { label: 'Mansions', value: 'Mansion' },
    { label: 'Private Islands', value: 'Island' },
    { label: 'Alpine Chalets', value: 'Chalet' }
  ];

  const featuredList = properties.filter(p => {
    if (!p.isPublished) return false;
    if (activeCategory === 'all') return p.featured || true;
    return p.propertyType.toLowerCase() === activeCategory.toLowerCase();
  }).slice(0, 6);

  return (
    <section className="py-24 bg-[#0B0F19] text-[#F8FAFC] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Curated Masterpieces</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              Featured Sovereign Residences
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mt-2 font-light">
              Handpicked luxury estates with iconic architecture, private waterfronts, and discrete private client representation.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.value
                    ? 'bg-[#D4AF37] text-slate-950 shadow-md font-bold'
                    : 'bg-[#141B2D] text-slate-400 border border-slate-800 hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredList.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => {
              setCurrentPage('properties');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#141B2D] hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider shadow-xl hover:border-[#D4AF37]/50 border border-slate-800 transition-all group"
          >
            <span>View Full Portfolio ({properties.length} Estates)</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
