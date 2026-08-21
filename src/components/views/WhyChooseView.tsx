import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { WhyChooseUs } from '../home/WhyChooseUs';
import { Sparkles, ShieldCheck, ArrowRight, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const WhyChooseView: React.FC = () => {
  const { setCurrentPage, openBookingModal } = useRealEstate();

  return (
    <div className="pt-28 pb-24 bg-[#0B0F19] text-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em]">
            <Sparkles className="w-4 h-4" />
            <span>Uncompromising Distinction</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight">
            The Sovereign Standard in Client Advisory
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Every transaction is executed with mathematical precision, institutional-grade legal security, and bespoke white-glove service.
          </p>
        </div>

        {/* Reusable Why Choose Component */}
        <WhyChooseUs />

        {/* Deep Dive Security & Escrow Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#141B2D] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs uppercase font-bold tracking-widest">
              <Lock className="w-4 h-4" />
              <span>Security Protocols</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white">
              Institutional Escrow & Cross-Border Legal Advisory
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We eliminate geopolitical and currency friction for international clients. From multi-jurisdiction tax optimization to Swiss banking escrow reserves, we ensure every acquisition is legally sound and tax-efficient.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Multi-Currency Sovereign Escrow (USD, EUR, GBP, AED, CHF)',
                'Full Architectural Structural & Environmental Audits',
                'Title Deed & Land Registry Clean Lien Certifications',
                'Strict Non-Disclosure Agreements for Buyers and Sellers'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 border border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
              alt="Luxury Escrow Security"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">Zero Settlement Failure</span>
              <h4 className="text-xl font-serif font-bold">$4.8 Billion+ Settled Without Dispute</h4>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => openBookingModal()}
            className="px-8 py-4 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition-all"
          >
            Connect With Private Advisor
          </button>
        </div>
      </div>
    </div>
  );
};
