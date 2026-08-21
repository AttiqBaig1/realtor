import React from 'react';
import { ContactSection } from '../home/ContactSection';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  return (
    <div className="pt-28 pb-24 bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em]">
            <Sparkles className="w-4 h-4" />
            <span>Private Global Concierge</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight">
            Connect With Our Managing Partners
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Direct access to senior real estate partners in New York, London, Dubai, and Monaco for private asset acquisition and confidential representation.
          </p>
        </div>

        {/* Global Offices Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-white">New York</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              432 Park Avenue, 54th Floor<br />
              Manhattan, NY 10022
            </p>
            <div className="text-xs font-semibold text-slate-200 pt-2 border-t border-slate-800">
              +1 (212) 880-9944
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-white">Dubai DIFC</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Burj Daman, Level 14<br />
              DIFC, Dubai, UAE
            </p>
            <div className="text-xs font-semibold text-slate-200 pt-2 border-t border-slate-800">
              +971 4 889 2200
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-white">London Mayfair</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              14 Berkeley Square<br />
              Mayfair, London W1J 6BD
            </p>
            <div className="text-xs font-semibold text-slate-200 pt-2 border-t border-slate-800">
              +44 20 7946 0912
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-white">Monaco</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Boulevard de Suisse<br />
              98000 Monaco
            </p>
            <div className="text-xs font-semibold text-slate-200 pt-2 border-t border-slate-800">
              +377 98 97 00 11
            </div>
          </div>
        </div>

        {/* Reusable Contact Section with Map & Inquiry Form */}
        <ContactSection />
      </div>
    </div>
  );
};
