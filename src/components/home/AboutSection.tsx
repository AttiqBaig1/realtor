import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Sparkles, Shield, CheckCircle2, Award, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { setCurrentPage, realtorProfile } = useRealEstate();

  const achievements = [
    { title: 'Global Footprint', desc: 'Private offices spanning New York, Dubai, London, Zurich, and Monaco.' },
    { title: 'Off-Market Access', desc: 'Over 60% of represented transactions conducted entirely off-market with strict NDAs.' },
    { title: 'Full Escrow Security', desc: 'Integrated legal counsel, multi-currency escrow, and tax advisory for cross-border investments.' }
  ];

  return (
    <section className="py-24 bg-[#0B0F19] text-[#F8FAFC] border-y border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Estate Architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            {/* Floating Experience Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-4 sm:-right-8 bg-[#141B2D]/95 backdrop-blur-xl text-white p-6 rounded-2xl border border-[#D4AF37]/30 shadow-2xl max-w-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-[#D4AF37] flex items-center justify-center text-slate-950 font-bold shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-serif font-bold text-white block">{realtorProfile.experienceYears || '25+ Years'}</span>
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                    Sovereign Real Estate Excellence
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Editorial Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em]">
              <Sparkles className="w-4 h-4" />
              <span>The Sovereign Legacy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              Curating the World’s Most Extraordinary Real Estate.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Founded on principles of unwavering discretion, architectural connoisseurship, and sovereign asset advisory, {realtorProfile.name} serves private family offices, royal dignitaries, and institutional investors worldwide.
            </p>

            <div className="space-y-4 pt-2">
              {achievements.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => {
                  setCurrentPage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:brightness-110 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
              >
                <span>Read Full Company Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
