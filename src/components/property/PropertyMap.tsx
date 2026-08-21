import React, { useState } from 'react';
import { Property } from '../../types';
import { useRealEstate } from '../../context/RealEstateContext';
import { MapPin, Sparkles, Navigation, Layers, Compass, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelectProperty?: (property: Property) => void;
  className?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  className = 'h-[500px]'
}) => {
  const { navigateToPropertyDetails, formatPrice } = useRealEstate();
  const [hoveredProp, setHoveredProp] = useState<Property | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Map pin position calculations (normalized map projection simulation)
  const getCoordinatesPosition = (lat: number, lng: number) => {
    // Mercator normalization for global points
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(10, Math.min(90, y))}%` };
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl ${className}`}>
      
      {/* Stylized Vector World Map Grid Background */}
      <div 
        className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.4s ease-out' }}
      />

      {/* Stylized SVG Map Silhouette */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none fill-slate-700 stroke-slate-800 stroke-[0.5]"
        style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.4s ease-out' }}
      >
        <path d="M150,150 Q180,100 260,110 T350,180 T260,260 T180,240 Z" /> {/* Americas simplified */}
        <path d="M220,280 Q260,260 300,320 T260,420 T200,360 Z" /> {/* S America */}
        <path d="M480,110 Q560,90 600,140 T540,210 T460,170 Z" /> {/* Europe */}
        <path d="M470,220 Q560,210 580,310 T500,420 T440,300 Z" /> {/* Africa */}
        <path d="M620,100 Q780,80 880,160 T780,290 T640,220 Z" /> {/* Asia */}
        <path d="M780,330 Q860,320 880,380 T800,430 T750,380 Z" /> {/* Australia */}
      </svg>

      {/* Map Header Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs text-white shadow-xl">
        <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
        <span className="font-semibold tracking-wide">AURA Global Prime Coordinates</span>
        <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
          {properties.length} Estates Pinned
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Property Pins */}
      <div 
        className="absolute inset-0"
        style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.4s ease-out' }}
      >
        {properties.map(property => {
          const { lat, lng } = property.location.coordinates;
          const pos = getCoordinatesPosition(lat, lng);
          const isSelected = selectedProperty?.id === property.id;
          const isHovered = hoveredProp?.id === property.id;

          return (
            <div
              key={property.id}
              style={{ left: pos.left, top: pos.top }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
              onMouseEnter={() => setHoveredProp(property)}
              onMouseLeave={() => setHoveredProp(null)}
              onClick={() => {
                if (onSelectProperty) {
                  onSelectProperty(property);
                } else {
                  navigateToPropertyDetails(property.id);
                }
              }}
            >
              {/* Radar pulse */}
              <span className="absolute -inset-2 rounded-full bg-amber-400/20 animate-ping pointer-events-none" />

              {/* Pin Bubble */}
              <div
                className={`relative px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-xl flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected || isHovered
                    ? 'bg-amber-400 text-slate-950 scale-110 border-2 border-white ring-4 ring-amber-500/40 z-30'
                    : 'bg-slate-900 text-white border border-amber-500/60 hover:bg-amber-500 hover:text-slate-950 z-10'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{formatPrice(property.discountPrice || property.price)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hovered / Active Property Preview Card */}
      <AnimatePresence>
        {(hoveredProp || selectedProperty) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-30 bg-slate-900/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-700 shadow-2xl text-white cursor-pointer"
            onClick={() => {
              const target = hoveredProp || selectedProperty;
              if (target) navigateToPropertyDetails(target.id);
            }}
          >
            {(() => {
              const item = hoveredProp || selectedProperty!;
              return (
                <div className="flex gap-3 items-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      {item.location.city}, {item.location.country}
                    </span>
                    <h4 className="text-xs font-serif font-bold text-white truncate">{item.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-amber-400">
                        {formatPrice(item.discountPrice || item.price)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.bedrooms} Beds • {item.area.toLocaleString()} {item.areaUnit}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Info bar */}
      <div className="absolute bottom-3 left-4 z-20 hidden sm:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
        <Navigation className="w-3 h-3 text-amber-400" />
        <span>Satellite Geodesic Precision Map • Verified Real Estate GPS Coordinates</span>
      </div>
    </div>
  );
};
