import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyCard } from '../property/PropertyCard';
import { Heart, Sparkles, Trash2, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, properties, setCurrentPage, clearWishlist } = useRealEstate();

  const wishlistedProperties = properties.filter(p => wishlist.includes(p.id));

  if (wishlistedProperties.length === 0) {
    return (
      <div className="pt-36 pb-24 text-center min-h-screen bg-[#0B0F19] text-[#F8FAFC] px-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white">Your Private Dossier is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Bookmark your preferred trophy estates across the portfolio for private review or confidential sharing with your family office.
          </p>
          <button
            onClick={() => setCurrentPage('properties')}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20"
          >
            Explore Sovereign Residences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Saved Portfolio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Private Curated Wishlist ({wishlistedProperties.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your confidential selection of luxury estates saved for private evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-[#141B2D] border border-slate-800 text-xs font-semibold text-slate-200 hover:border-[#D4AF37]"
            >
              Export Confidential PDF Dossier
            </button>

            <button
              onClick={clearWishlist}
              className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Dossier</span>
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistedProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};
