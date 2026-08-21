import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  Scale, 
  X, 
  Trash2, 
  Check, 
  Minus, 
  Sparkles, 
  ArrowRight, 
  Plus 
} from 'lucide-react';

export const CompareView: React.FC = () => {
  const { 
    compareList, 
    toggleCompare, 
    clearCompare, 
    formatPrice, 
    navigateToPropertyDetails, 
    setCurrentPage,
    openBookingModal 
  } = useRealEstate();

  if (compareList.length === 0) {
    return (
      <div className="pt-36 pb-24 text-center min-h-screen bg-[#0B0F19] text-[#F8FAFC] px-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto border border-[#D4AF37]/20">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white">Comparison Matrix Empty</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select up to 4 luxury estates from our portfolio to evaluate specifications, pricing, and architectural amenities side by side.
          </p>
          <button
            onClick={() => setCurrentPage('properties')}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20"
          >
            Explore Portfolio & Add Estates
          </button>
        </div>
      </div>
    );
  }

  const comparisonAttributes = [
    { label: 'Valuation', render: (p: any) => formatPrice(p.discountPrice || p.price) },
    { label: 'Purpose', render: (p: any) => p.purpose === 'Rent' ? 'For Lease' : 'Freehold Sale' },
    { label: 'Location', render: (p: any) => `${p.location.city}, ${p.location.country}` },
    { label: 'Category', render: (p: any) => p.propertyType },
    { label: 'Suites / Beds', render: (p: any) => `${p.bedrooms} Bedrooms` },
    { label: 'Baths', render: (p: any) => `${p.bathrooms} Luxury Baths` },
    { label: 'Total Area', render: (p: any) => `${p.area.toLocaleString()} ${p.areaUnit}` },
    { label: 'Price per Unit', render: (p: any) => `${formatPrice(Math.round((p.discountPrice || p.price) / p.area))} / ${p.areaUnit}` },
    { label: 'Auto Spaces', render: (p: any) => `${p.parking} Heated Spaces` },
    { label: 'Year Built', render: (p: any) => p.yearBuilt },
    { label: 'Status', render: (p: any) => p.status },
    { 
      label: 'Private Pool', 
      render: (p: any) => p.amenities.some((a: string) => a.toLowerCase().includes('pool')) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-600 mx-auto" />
    },
    { 
      label: 'Helipad / Aviation', 
      render: (p: any) => p.amenities.some((a: string) => a.toLowerCase().includes('helipad')) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-600 mx-auto" />
    },
    { 
      label: 'Waterfront / Beach', 
      render: (p: any) => p.amenities.some((a: string) => a.toLowerCase().includes('waterfront') || a.toLowerCase().includes('beach')) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-600 mx-auto" />
    },
    { 
      label: 'Smart Automation', 
      render: (p: any) => p.amenities.some((a: string) => a.toLowerCase().includes('smart') || a.toLowerCase().includes('automation')) ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <Minus className="w-4 h-4 text-slate-600 mx-auto" />
    }
  ];

  return (
    <div className="pt-28 pb-24 bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Side-by-Side Architectural Evaluation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Trophy Estate Comparison Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comparing {compareList.length} of 4 maximum sovereign holdings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('properties')}
              className="px-4 py-2 rounded-xl bg-[#141B2D] border border-slate-800 text-xs font-semibold text-slate-200 hover:border-[#D4AF37] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add Estate</span>
            </button>

            <button
              onClick={clearCompare}
              className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Matrix</span>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#141B2D] shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0F172A]">
                <th className="p-4 sm:p-6 text-xs uppercase font-bold text-slate-400 w-48 sticky left-0 bg-[#0F172A] z-10">
                  Estate Overview
                </th>
                {compareList.map(property => (
                  <th key={property.id} className="p-4 sm:p-6 min-w-[240px] max-w-[280px]">
                    <div className="relative group space-y-3">
                      <button
                        onClick={() => toggleCompare(property.id)}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div 
                        onClick={() => navigateToPropertyDetails(property.id)}
                        className="aspect-[16/10] rounded-xl overflow-hidden cursor-pointer bg-slate-950"
                      >
                        <img
                          src={property.thumbnail}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
                          {property.location.city}
                        </span>
                        <h4 
                          onClick={() => navigateToPropertyDetails(property.id)}
                          className="font-serif font-bold text-sm text-white line-clamp-1 hover:text-[#D4AF37] cursor-pointer"
                        >
                          {property.title}
                        </h4>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openBookingModal(property)}
                          className="w-full py-2 rounded-lg bg-[#D4AF37] text-slate-950 font-bold text-[11px] uppercase tracking-wider hover:brightness-110"
                        >
                          VIP Tour
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 text-xs">
              {comparisonAttributes.map((attr, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-400 uppercase tracking-wider text-[11px] sticky left-0 bg-[#141B2D] z-10 border-r border-slate-800">
                    {attr.label}
                  </td>
                  {compareList.map(property => (
                    <td key={property.id} className="p-4 sm:p-5 text-center font-medium text-slate-200">
                      {attr.render(property)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
