import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  X, 
  Printer, 
  Download, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Car, 
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

export const BrochureModal: React.FC = () => {
  const { 
    brochureModalOpen, 
    setBrochureModalOpen, 
    brochureProperty, 
    formatPrice,
    showToast 
  } = useRealEstate();

  if (!brochureModalOpen || !brochureProperty) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast('Preparing high-resolution PDF Dossier...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div 
      onClick={() => setBrochureModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Modal Toolbar (hidden during print) */}
        <div className="bg-slate-950 text-white p-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold tracking-wide">
              Official Property Dossier & PDF Brochure
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setBrochureModalOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 space-y-8 bg-slate-50 text-slate-900">
          
          {/* Header */}
          <div className="border-b-2 border-amber-600/30 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-[0.25em] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>AURA ESTATES PRIVATE DOSSIER</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                {brochureProperty.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-600 text-sm mt-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{brochureProperty.location.address}, {brochureProperty.location.city}, {brochureProperty.location.country}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase text-slate-500 tracking-wider font-semibold block">
                Official Valuation
              </span>
              <span className="text-3xl font-bold font-serif text-amber-600">
                {formatPrice(brochureProperty.discountPrice || brochureProperty.price)}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                {brochureProperty.purpose === 'Rent' ? '/ Month Exclusive' : 'Freehold Title'}
              </span>
            </div>
          </div>

          {/* Main Hero Photo + Gallery Mosaic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 h-72 sm:h-96 rounded-xl overflow-hidden shadow-md">
              <img
                src={brochureProperty.images[0]}
                alt={brochureProperty.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <div className="h-36 sm:h-46 rounded-xl overflow-hidden shadow-md">
                <img
                  src={brochureProperty.images[1] || brochureProperty.images[0]}
                  alt="Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-36 sm:h-46 rounded-xl overflow-hidden shadow-md">
                <img
                  src={brochureProperty.images[2] || brochureProperty.images[0]}
                  alt="Grounds"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Key Specs Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs text-slate-500 block">Bedrooms</span>
                <span className="font-bold text-slate-900">{brochureProperty.bedrooms} Suites</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs text-slate-500 block">Bathrooms</span>
                <span className="font-bold text-slate-900">{brochureProperty.bathrooms} Baths</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Maximize2 className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs text-slate-500 block">Total Area</span>
                <span className="font-bold text-slate-900">{brochureProperty.area.toLocaleString()} {brochureProperty.areaUnit}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs text-slate-500 block">Auto Gallery</span>
                <span className="font-bold text-slate-900">{brochureProperty.parking} Heated</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs text-slate-500 block">Year Built</span>
                <span className="font-bold text-slate-900">{brochureProperty.yearBuilt}</span>
              </div>
            </div>
          </div>

          {/* Description & Narrative */}
          <div className="space-y-3">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Architectural Overview & Residence Narrative
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              {brochureProperty.description}
            </p>
          </div>

          {/* Amenities Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Notable Amenities & Bespoke Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {brochureProperty.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-slate-800 font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floor Plan Highlight */}
          {brochureProperty.floorPlan && (
            <div className="space-y-3">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Architectural Floor Plan
              </h3>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-4">
                <img
                  src={brochureProperty.floorPlan}
                  alt="Floor Plan"
                  className="w-full max-h-72 object-contain mx-auto"
                />
              </div>
            </div>
          )}

          {/* Agent Sign-off & Representation */}
          <div className="border-t-2 border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-xl border">
            <div className="flex items-center gap-4">
              <img
                src={brochureProperty.agent.avatar}
                alt={brochureProperty.agent.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-500 shadow-md"
              />
              <div>
                <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block">
                  Exclusive Representative
                </span>
                <span className="font-bold text-slate-900 text-base">{brochureProperty.agent.name}</span>
                <span className="text-xs text-slate-500 block">{brochureProperty.agent.title}</span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600 sm:text-right">
              <div className="flex items-center sm:justify-end gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold">{brochureProperty.agent.phone}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>{brochureProperty.agent.email}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Languages: {brochureProperty.agent.languages.join(', ')}
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-200">
            AURA Estates International • Confidential Client Document • All measurements approximate • Subject to Title Verification
          </div>
        </div>
      </motion.div>
    </div>
  );
};
