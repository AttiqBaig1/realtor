import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { LUXURY_LOCATIONS } from '../../data/initialData';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const LocationsSection: React.FC = () => {
  const { setCurrentPage, updateFilter } = useRealEstate();

  const handleLocationClick = (locName: string) => {
    updateFilter({ location: locName });
    setCurrentPage('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#0B0F19] text-[#F8FAFC] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>International Presence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              Iconic Global Prime Enclaves
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mt-2 font-light">
              Explore world-renowned waterfronts, alpine peaks, and metropolitan sky towers.
            </p>
          </div>

          <button
            onClick={() => {
              updateFilter({ location: '' });
              setCurrentPage('properties');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>Explore All Regions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Locations Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LUXURY_LOCATIONS.map((loc, idx) => (
            <motion.div
              key={loc.name}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleLocationClick(loc.name)}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-slate-800"
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                {loc.count}+ Estates
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-medium block">
                  {loc.country}
                </span>
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  {loc.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
