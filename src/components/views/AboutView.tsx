import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Sparkles, Award, Globe, Shield, Users, Building, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutView: React.FC = () => {
  const { setCurrentPage, openBookingModal, realtorProfile } = useRealEstate();

  const leadership = [
    {
      name: 'Alexander Sterling',
      role: 'Founder & Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: '25+ years spearheading landmark prime real estate transactions exceeding $3B across North America and Europe.'
    },
    {
      name: 'Sophia Al-Maktoum Vance',
      role: 'Managing Partner - Middle East & Asia',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Advising sovereign wealth funds and royal family offices on trophy asset acquisition and ultra-luxury developments.'
    },
    {
      name: 'Henri de Montmirail',
      role: 'Head of European Estates & Historic Palazzos',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Specialist in heritage preservation, Mediterranean vineyard estates, and Swiss alpine chalet portfolios.'
    }
  ];

  return (
    <div className="pt-28 pb-24 bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em]">
            <Sparkles className="w-4 h-4" />
            <span>Heritage & Connoisseurship</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight">
            The Sovereign Standard in Ultra-Prime Real Estate
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Founded with a singular mission: to represent the world's most distinguished architectural estates with consummate discretion, intellectual rigor, and bespoke financial stewardship.
          </p>
        </div>

        {/* Hero Narrative Image & Stats */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] bg-slate-950 border border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80"
            alt={`${realtorProfile.name} Architecture`}
            className="w-full h-full object-cover brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between text-white gap-4">
            <div>
              <span className="text-xs uppercase text-[#D4AF37] font-bold tracking-widest block">Est. {realtorProfile.establishedYear || '2008'}</span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold">{realtorProfile.experienceYears || '25+ Years'} of Unbroken Trust</h3>
            </div>
            <div className="flex gap-6 sm:gap-12">
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] block">$4.8B+</span>
                <span className="text-xs text-slate-300">Closed Volume</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] block">18+</span>
                <span className="text-xs text-slate-300">Global Prime Desks</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] block">100%</span>
                <span className="text-xs text-slate-300">Discretion Adherence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Absolute Discretion</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              We operate under institutional-grade non-disclosure protocols. Client identities, portfolio balances, and transaction dynamics remain strictly confidential.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Architectural Connoisseurship</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              We exclusively represent properties that exemplify master craftsmanship, world-class provenance, and irreplaceable geographic positioning.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Global Capital Reach</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              Seamlessly facilitating multi-currency escrow, international legal compliance, and tax structuring for clients worldwide.
            </p>
          </div>
        </div>

        {/* Executive Leadership */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase text-[#D4AF37] font-bold tracking-widest block mb-1">
              Leadership & Advisory
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Senior Managing Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((exec, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#141B2D] border border-slate-800 shadow-xl space-y-4 text-center">
                <img
                  src={exec.image}
                  alt={exec.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-[#D4AF37] shadow-lg"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">{exec.name}</h3>
                  <span className="text-xs text-[#D4AF37] font-semibold block">{exec.role}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {exec.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-[#141B2D] to-slate-950 border border-slate-800 text-white text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">
            Looking to Acquire or Liquidate a Sovereign Asset?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Our Senior Partners are available for confidential consultations at your family office or private residence.
          </p>
          <button
            onClick={() => openBookingModal()}
            className="px-8 py-4 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition-all"
          >
            Initiate Private Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
