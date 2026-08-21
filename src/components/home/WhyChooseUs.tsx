import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Sparkles, ShieldCheck, FileCheck, DollarSign, Clock, Users, Gem } from 'lucide-react';
import { motion } from 'motion/react';

export const WhyChooseUs: React.FC = () => {
  const { realtorProfile } = useRealEstate();
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Verified Title & Due Diligence',
      desc: 'Every estate undergoes exhaustive legal scrutiny, architectural structural audits, and clear title deed verification.'
    },
    {
      icon: Gem,
      title: 'Off-Market Exclusivity',
      desc: 'Direct access to sovereign private listings and trophy assets never marketed across public portals.'
    },
    {
      icon: FileCheck,
      title: 'Bespoke Legal & Escrow Counsel',
      desc: 'Cross-border investment structuring, multi-currency escrow, and high-level tax optimization advisory.'
    },
    {
      icon: DollarSign,
      title: 'Institutional Valuations',
      desc: 'Proprietary architectural pricing models ensuring fair acquisition value and solid capital appreciation.'
    },
    {
      icon: Clock,
      title: '24/7 Dedicated Concierge',
      desc: 'Private helicopter transfers, security details, and personalized property onboarding protocols.'
    },
    {
      icon: Users,
      title: 'Global Advisory Network',
      desc: 'Multilingual private client partners stationed across New York, London, Dubai, Geneva, and Tokyo.'
    }
  ];

  return (
    <section className="py-24 bg-[#0B0F19] text-[#F8FAFC] relative overflow-hidden">
      
      {/* Background subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>The {realtorProfile.name} Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            Why Discerning Clients Choose {realtorProfile.name}.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed font-light">
            We bridge architectural connoisseurship with elite financial security, protecting and elevating our clients’ private real estate portfolios in {realtorProfile.city} and global prime markets.
          </p>
        </div>

        {/* 6 Grid Cards with Hover Glow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl bg-[#141B2D] border border-slate-800 hover:border-[#D4AF37]/50 shadow-xl transition-all space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
