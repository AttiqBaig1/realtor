import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyCard } from '../property/PropertyCard';
import { ShareModal } from '../modals/ShareModal';
import { 
  Heart, 
  Scale, 
  Share2, 
  Printer, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  Calendar, 
  Sparkles, 
  Compass, 
  Check, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calculator, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  School, 
  Hospital, 
  ShoppingBag, 
  Plane, 
  Layers,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PropertyDetailsView: React.FC = () => {
  const { 
    selectedProperty, 
    setCurrentPage, 
    formatPrice, 
    toggleWishlist, 
    isWishlisted, 
    toggleCompare, 
    isCompared,
    openBookingModal,
    openBrochureModal,
    openVirtualTourModal,
    properties,
    addLead
  } = useRealEstate();

  if (!selectedProperty) {
    return (
      <div className="pt-36 pb-24 text-center min-h-screen">
        <h2 className="text-2xl font-serif font-bold">Property Not Found</h2>
        <button 
          onClick={() => setCurrentPage('properties')}
          className="mt-4 px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
        >
          Return to Portfolio
        </button>
      </div>
    );
  }

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Mortgage Calculator State
  const propertyPrice = selectedProperty.discountPrice || selectedProperty.price;
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  // Quick Inquire Form State
  const [inquireName, setInquireName] = useState('');
  const [inquireEmail, setInquireEmail] = useState('');
  const [inquirePhone, setInquirePhone] = useState('');
  const [inquireMsg, setInquireMsg] = useState(`I would like to request an exclusive viewing of ${selectedProperty.title}.`);

  const wishlisted = isWishlisted(selectedProperty.id);
  const compared = isCompared(selectedProperty.id);

  // Mortgage Math
  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const loanPrincipal = propertyPrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyMortgage =
    monthlyRate > 0
      ? (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : loanPrincipal / numberOfPayments;

  const handleInquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquireName || !inquireEmail || !inquirePhone) return;

    addLead({
      type: 'inquiry',
      name: inquireName,
      email: inquireEmail,
      phone: inquirePhone,
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      message: inquireMsg
    });

    setInquireName('');
    setInquireEmail('');
    setInquirePhone('');
  };

  const similarProperties = properties
    .filter(p => p.id !== selectedProperty.id && (p.propertyType === selectedProperty.propertyType || p.location.country === selectedProperty.location.country))
    .slice(0, 3);

  return (
    <div className="pt-24 pb-24 bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-2">
          <button
            onClick={() => {
              setCurrentPage('properties');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Estates</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(selectedProperty.id)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                wishlisted
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-[#141B2D] text-slate-200 border-slate-800 hover:text-[#D4AF37]'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{wishlisted ? 'Saved to Wishlist' : 'Save'}</span>
            </button>

            {/* Compare */}
            <button
              onClick={() => toggleCompare(selectedProperty.id)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                compared
                  ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] font-bold shadow-md'
                  : 'bg-[#141B2D] text-slate-200 border-slate-800 hover:text-[#D4AF37]'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{compared ? 'In Comparison' : 'Compare'}</span>
            </button>

            {/* Print Brochure */}
            <button
              onClick={() => openBrochureModal(selectedProperty)}
              className="p-2.5 rounded-xl bg-[#141B2D] border border-slate-800 text-slate-200 hover:text-[#D4AF37] flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all"
            >
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">PDF Brochure</span>
            </button>

            {/* Share */}
            <button
              onClick={() => setShareOpen(true)}
              className="p-2.5 rounded-xl bg-[#141B2D] border border-slate-800 text-slate-200 hover:text-[#D4AF37] flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Title & Valuation Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{selectedProperty.propertyType} • {selectedProperty.purpose === 'Rent' ? 'Exclusive Lease' : 'Freehold Title'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              {selectedProperty.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{selectedProperty.location.address}, {selectedProperty.location.city}, {selectedProperty.location.country}</span>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider block">
              Official Valuation
            </span>
            <div className="flex items-baseline lg:justify-end gap-3">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#D4AF37]">
                {formatPrice(selectedProperty.discountPrice || selectedProperty.price)}
              </span>
              {selectedProperty.discountPrice && (
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(selectedProperty.price)}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 block mt-0.5">
              Approx. {formatPrice(Math.round(propertyPrice / selectedProperty.area))} / {selectedProperty.areaUnit}
            </span>
          </div>
        </div>

        {/* Gallery Mosaic */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-10">
          <div 
            onClick={() => setLightboxOpen(true)}
            className="lg:col-span-2 h-80 sm:h-[480px] rounded-2xl overflow-hidden cursor-pointer relative group bg-slate-950"
          >
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#0B0F19]/90 text-white text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-md transition-opacity">
                Click to View High-Res Gallery ({selectedProperty.images.length} Photos)
              </span>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-1 gap-3">
            <div 
              onClick={() => setLightboxOpen(true)}
              className="h-[234px] rounded-2xl overflow-hidden cursor-pointer relative group bg-slate-950"
            >
              <img
                src={selectedProperty.images[1] || selectedProperty.images[0]}
                alt="Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div 
              onClick={() => setLightboxOpen(true)}
              className="h-[234px] rounded-2xl overflow-hidden cursor-pointer relative group bg-slate-950"
            >
              <img
                src={selectedProperty.images[2] || selectedProperty.images[0]}
                alt="Suite"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-1 gap-3">
            <div 
              onClick={() => setLightboxOpen(true)}
              className="h-[234px] rounded-2xl overflow-hidden cursor-pointer relative group bg-slate-950"
            >
              <img
                src={selectedProperty.images[3] || selectedProperty.images[0]}
                alt="Living"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* 3D Virtual Tour Button Box */}
            <div 
              onClick={() => openVirtualTourModal(selectedProperty)}
              className="h-[234px] rounded-2xl overflow-hidden cursor-pointer relative group bg-gradient-to-br from-[#D4AF37]/80 to-slate-950 p-6 flex flex-col justify-between text-white shadow-xl"
            >
              <Compass className="w-8 h-8 text-[#D4AF37] group-hover:rotate-45 transition-transform" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-200 font-bold block">Interactive 3D</span>
                <h4 className="text-lg font-serif font-bold text-white leading-snug">Launch 4K Virtual Walkthrough</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-6 bg-[#141B2D] rounded-2xl border border-slate-800 shadow-xl mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Bedrooms</span>
              <span className="text-sm font-bold text-white">{selectedProperty.bedrooms} Suites</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Bath className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Bathrooms</span>
              <span className="text-sm font-bold text-white">{selectedProperty.bathrooms} Luxury Baths</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Total Area</span>
              <span className="text-sm font-bold text-white">{selectedProperty.area.toLocaleString()} {selectedProperty.areaUnit}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Auto Gallery</span>
              <span className="text-sm font-bold text-white">{selectedProperty.parking} Heated Spaces</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Year Built</span>
              <span className="text-sm font-bold text-white">{selectedProperty.yearBuilt}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Title Status</span>
              <span className="text-sm font-bold text-white">{selectedProperty.status}</span>
            </div>
          </div>
        </div>

        {/* Main Content Details Grid (Left Content + Right Sticky Agent Booking Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Narrative, Amenities, Floor Plan, Map, Mortgage */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-white">
                Architectural Statement & Residence Profile
              </h2>
              <p className="text-slate-300 leading-relaxed text-base font-light">
                {selectedProperty.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
              <h2 className="text-2xl font-serif font-bold text-white">
                Bespoke Estate Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProperty.amenities.map(amenity => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[#141B2D] border border-slate-800 shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plan Section */}
            {selectedProperty.floorPlan && (
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Architectural Floor Plan
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">Scale 1:100 Certified</span>
                </div>
                <div className="p-6 rounded-2xl bg-[#141B2D] border border-slate-800 shadow-sm overflow-hidden">
                  <img
                    src={selectedProperty.floorPlan}
                    alt="Floor Plan"
                    className="w-full max-h-96 object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Nearby Places Section */}
            {selectedProperty.nearbyPlaces && selectedProperty.nearbyPlaces.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Prime Nearby Destinations & Access
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProperty.nearbyPlaces.map((place, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#141B2D] border border-slate-800 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-[#D4AF37] flex items-center justify-center shrink-0">
                          {place.category === 'School' && <School className="w-4 h-4" />}
                          {place.category === 'Hospital' && <Hospital className="w-4 h-4" />}
                          {place.category === 'Mall' && <ShoppingBag className="w-4 h-4" />}
                          {place.category === 'Helipad' && <Plane className="w-4 h-4" />}
                          {place.category === 'Airport' && <Plane className="w-4 h-4" />}
                          {place.category === 'Beach' && <Sparkles className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{place.name}</h4>
                          <span className="text-[10px] text-slate-400">{place.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#D4AF37] block">{place.distance}</span>
                        <span className="text-[10px] text-slate-400">{place.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mortgage & Investment Financial Calculator */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em]">
                <Calculator className="w-4 h-4" />
                <span>Financial Analysis</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">
                Private Escrow & Mortgage Estimator
              </h2>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Down payment */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Down Payment ({downPaymentPercent}%)
                    </label>
                    <div className="text-sm font-bold text-white mb-2">
                      {formatPrice(downPayment)}
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={80}
                      step={5}
                      value={downPaymentPercent}
                      onChange={e => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  {/* Interest rate */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Fixed Interest Rate ({interestRate}%)
                    </label>
                    <div className="text-sm font-bold text-white mb-2">
                      {interestRate}% Annual
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={10}
                      step={0.25}
                      value={interestRate}
                      onChange={e => setInterestRate(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  {/* Loan term */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Loan Term ({loanTermYears} Years)
                    </label>
                    <div className="text-sm font-bold text-white mb-2">
                      {loanTermYears} Years Fixed
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={30}
                      step={5}
                      value={loanTermYears}
                      onChange={e => setLoanTermYears(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Estimated Monthly Payment Banner */}
                <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">
                      Estimated Monthly Amortization
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      {formatPrice(Math.round(monthlyMortgage))} / mo
                    </span>
                  </div>

                  <button
                    onClick={() => openBookingModal(selectedProperty)}
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110"
                  >
                    Discuss Private Financing
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Private Agent Card & Quick Showing Request */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            {/* Private Managing Agent Card */}
            <div className="p-6 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-6">
              
              <div className="flex items-center gap-4">
                <img
                  src={selectedProperty.agent.avatar}
                  alt={selectedProperty.agent.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                    Exclusive Representation
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {selectedProperty.agent.name}
                  </h3>
                  <span className="text-xs text-slate-400 block">
                    {selectedProperty.agent.title}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-semibold">{selectedProperty.agent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span>{selectedProperty.agent.email}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Languages: {selectedProperty.agent.languages.join(', ')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => openBookingModal(selectedProperty)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-[#D4AF37] to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  Schedule Private Showing
                </button>

                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Inquiring regarding ${selectedProperty.title} (${formatPrice(propertyPrice)})`);
                    window.open(`https://api.whatsapp.com/send?phone=12128809944&text=${text}`, '_blank');
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Encrypted WhatsApp VIP</span>
                </button>
              </div>

              {/* Fast Direct Message */}
              <form onSubmit={handleInquireSubmit} className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Direct Agent Message
                </h4>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={inquireName}
                  onChange={e => setInquireName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-white"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={inquireEmail}
                  onChange={e => setInquireEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-white"
                />
                <input
                  type="tel"
                  required
                  placeholder="Your Telephone"
                  value={inquirePhone}
                  onChange={e => setInquirePhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-white"
                />
                <textarea
                  rows={2}
                  value={inquireMsg}
                  onChange={e => setInquireMsg(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                >
                  Send Direct Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar Curated Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-24 pt-12 border-t border-slate-800 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase text-[#D4AF37] font-bold tracking-widest block">
                  Peer Holdings
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Similar Curated Estates
                </h2>
              </div>
              <button
                onClick={() => {
                  setCurrentPage('properties');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        property={selectedProperty}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-amber-400 p-2 z-50"
            >
              ✕ Close
            </button>

            <button
              onClick={() => setActivePhotoIndex(prev => (prev === 0 ? selectedProperty.images.length - 1 : prev - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 text-white hover:text-slate-950 flex items-center justify-center transition-colors z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setActivePhotoIndex(prev => (prev === selectedProperty.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 text-white hover:text-slate-950 flex items-center justify-center transition-colors z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
              <img
                src={selectedProperty.images[activePhotoIndex]}
                alt="Fullscreen Preview"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
              />
              <span className="text-white text-xs mt-3 font-mono">
                Photo {activePhotoIndex + 1} of {selectedProperty.images.length}
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
