import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  X, 
  Maximize2, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Navigation, 
  Info,
  ChevronLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VirtualTourModal: React.FC = () => {
  const { 
    virtualTourModalOpen, 
    setVirtualTourModalOpen, 
    tourProperty,
    openBookingModal
  } = useRealEstate();

  const [activeHotspotIndex, setActiveHotspotIndex] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState<1 | 2 | 3>(1);
  const [showHotspotInfo, setShowHotspotInfo] = useState(true);

  if (!virtualTourModalOpen || !tourProperty) return null;

  const tourRooms = [
    {
      name: 'Grand Salon & Central Loggia',
      floor: 1,
      image: tourProperty.images[0],
      tag: '14ft Ceilings & Floor-to-Ceiling Motorized Glass',
      specs: 'Custom Calacatta Marble Fireplace • Automated Acoustic Drapes'
    },
    {
      name: 'Primary Master Wing & Terrace',
      floor: 2,
      image: tourProperty.images[1] || tourProperty.images[0],
      tag: 'Wraparound Sunset Balcony & Dual En-Suites',
      specs: 'Finnish Dry Sauna • Bespoke Italian Leather Walk-in Closets'
    },
    {
      name: 'Private Infinity Pool & Outdoor Sky Deck',
      floor: 1,
      image: tourProperty.images[2] || tourProperty.images[0],
      tag: 'Zero-Edge Ozone Lagoon with Submerged Daybeds',
      specs: 'Heated 365 Days • Custom Fire Grotto & Alfresco Chef Bar'
    },
    {
      name: 'Sommelier Wine Vault & Private Cinema',
      floor: 3,
      image: tourProperty.images[3] || tourProperty.images[0],
      tag: 'Dolby Atmos 4K Laser Projection Suite',
      specs: '2,000-Bottle Climate Controlled Cellar • Tasting Lounge'
    }
  ];

  const currentRoom = tourRooms[activeHotspotIndex] || tourRooms[0];

  return (
    <div 
      onClick={() => setVirtualTourModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-slate-950 border border-slate-800 rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl relative text-white"
      >
        {/* Top Bar */}
        <div className="bg-slate-900/90 px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block">
                AURA 3D Interactive Matterport Simulation
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white truncate max-w-xs sm:max-w-md">
                {tourProperty.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setVirtualTourModalOpen(false);
                openBookingModal(tourProperty);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-amber-500/20"
            >
              Book In-Person
            </button>
            <button
              onClick={() => setVirtualTourModalOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 360 Viewport */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center select-none group">
          {/* Main Panorama Image */}
          <motion.img
            key={currentRoom.name}
            src={currentRoom.image}
            alt={currentRoom.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />

          {/* Compass & 360 badge */}
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-2 shadow-lg">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-slate-300 font-medium">360° Walkthrough Active</span>
          </div>

          {/* Room details overlay card */}
          {showHotspotInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                  Hotspot #{activeHotspotIndex + 1} of {tourRooms.length}
                </span>
                <button
                  onClick={() => setShowHotspotInfo(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-base font-serif font-bold text-white">{currentRoom.name}</h4>
              <p className="text-xs text-amber-200/90 font-medium">{currentRoom.tag}</p>
              <p className="text-[11px] text-slate-400">{currentRoom.specs}</p>
            </motion.div>
          )}

          {/* Interactive Navigation Arrows */}
          <button
            onClick={() => setActiveHotspotIndex(prev => (prev === 0 ? tourRooms.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-lg transition-all"
            aria-label="Previous hotspot"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveHotspotIndex(prev => (prev === tourRooms.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-white flex items-center justify-center shadow-lg transition-all"
            aria-label="Next hotspot"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Hotspots Carousel Bottom Bar */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 uppercase tracking-wider">
              Explore Residence Hotspots
            </span>
            <span>Click any node to navigate instantly</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tourRooms.map((room, idx) => (
              <button
                key={room.name}
                onClick={() => {
                  setActiveHotspotIndex(idx);
                  setShowHotspotInfo(true);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  activeHotspotIndex === idx
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold block truncate text-slate-200">{room.name}</span>
                  <span className="text-[10px] text-amber-400 block">Level {room.floor}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
