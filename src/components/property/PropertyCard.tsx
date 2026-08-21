import React, { useState } from 'react';
import { Property } from '../../types';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  Heart, 
  Scale, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Sparkles,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';
import { ShareModal } from '../modals/ShareModal';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { 
    navigateToPropertyDetails, 
    formatPrice, 
    toggleWishlist, 
    isWishlisted, 
    toggleCompare, 
    isCompared,
    openVirtualTourModal 
  } = useRealEstate();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const wishlisted = isWishlisted(property.id);
  const compared = isCompared(property.id);

  const images = property.images && property.images.length > 0 ? property.images : [property.thumbnail];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={() => navigateToPropertyDetails(property.id)}
        className="group relative bg-[#141B2D] rounded-2xl overflow-hidden border border-slate-800 hover:border-[#D4AF37]/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col h-full"
      >
        {/* Image Container with Slider */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          <img
            src={images[activeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Badges Top Left */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
            {property.featured && (
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white font-semibold text-[10px] uppercase tracking-wider border border-white/10">
              {property.purpose === 'Rent' ? 'For Lease' : 'For Sale'}
            </span>
            <span className="px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-amber-300 font-semibold text-[10px] uppercase tracking-wider border border-slate-700">
              {property.propertyType}
            </span>
          </div>

          {/* Action Buttons Top Right */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
            {/* 3D Virtual Tour Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openVirtualTourModal(property);
              }}
              title="3D Virtual Tour"
              className="w-8 h-8 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 backdrop-blur-md text-white flex items-center justify-center border border-white/15 transition-all shadow-md"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>

            {/* Compare Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(property.id);
              }}
              title={compared ? 'Remove from Compare' : 'Add to Compare'}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center border transition-all shadow-md ${
                compared
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-white border-white/15'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Wishlist Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(property.id);
              }}
              title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center border transition-all shadow-md ${
                wishlisted
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-white border-white/15'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen(true);
              }}
              title="Share Listing"
              className="w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-800 backdrop-blur-md text-white flex items-center justify-center border border-white/15 transition-all shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Image Slider Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="opacity-0 group-hover:opacity-100 absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm transition-all z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextImage}
                className="opacity-0 group-hover:opacity-100 absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm transition-all z-10"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none">
                {images.slice(0, 5).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImageIndex === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Price Tag pinned to bottom left of photo */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-serif text-white drop-shadow-md">
                {formatPrice(property.discountPrice || property.price)}
              </span>
              {property.discountPrice && (
                <span className="text-xs text-slate-300 line-through">
                  {formatPrice(property.price)}
                </span>
              )}
              {property.purpose === 'Rent' && (
                <span className="text-[11px] text-amber-300 font-semibold">/mo</span>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
          <div>
            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">{property.location.city}, {property.location.country}</span>
            </div>

            {/* Title */}
            <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">
              {property.title}
            </h3>

            {/* Short description */}
            {!compact && (
              <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {property.shortDescription}
              </p>
            )}
          </div>

          {/* Specs Bar */}
          <div className="border-t border-slate-800/80 pt-3.5 flex items-center justify-between text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5" title="Bedrooms">
              <Bed className="w-4 h-4 text-[#D4AF37]" />
              <span>{property.bedrooms} Beds</span>
            </div>

            <div className="flex items-center gap-1.5" title="Bathrooms">
              <Bath className="w-4 h-4 text-[#D4AF37]" />
              <span>{property.bathrooms} Baths</span>
            </div>

            <div className="flex items-center gap-1.5" title="Living Area">
              <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
              <span>{property.area.toLocaleString()} {property.areaUnit}</span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {property.status}
            </span>

            <span className="text-xs font-bold text-[#D4AF37] group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Explore Residence →
            </span>
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      <ShareModal
        property={property}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
};
