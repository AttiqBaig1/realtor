import React, { useState, useEffect } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Sparkles, Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TestimonialSection: React.FC = () => {
  const { testimonials } = useRealEstate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[activeIndex] || testimonials[0];

  return (
    <section className="py-24 bg-[#0B0F19] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Private Client Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            Endorsements from Sovereign Principals
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed font-light">
            Confidential feedback from ultra-high-net-worth buyers, family office directors, and institutional leaders.
          </p>
        </div>

        {/* Testimonial Stage */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="p-8 sm:p-12 rounded-3xl bg-[#141B2D] border border-slate-800 backdrop-blur-xl shadow-2xl relative"
            >
              <Quote className="w-12 h-12 text-[#D4AF37]/20 absolute top-8 right-8 pointer-events-none" />

              {/* Stars */}
              <div className="flex items-center gap-1 text-[#D4AF37] mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base sm:text-xl font-serif text-slate-200 leading-relaxed italic mb-8">
                "{current.review}"
              </p>

              {/* Client Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={current.photo}
                    alt={current.clientName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{current.clientName}</h4>
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" title="Verified Transaction" />
                    </div>
                    <span className="text-xs text-[#D4AF37] font-medium block">{current.role}</span>
                    <span className="text-[11px] text-slate-400 block">{current.location}</span>
                  </div>
                </div>

                {current.propertyBought && (
                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Represented Acquisition
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {current.propertyBought}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="w-10 h-10 rounded-full bg-[#141B2D] hover:bg-[#D4AF37] hover:text-slate-950 text-white border border-slate-800 flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === idx ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-slate-800'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="w-10 h-10 rounded-full bg-[#141B2D] hover:bg-[#D4AF37] hover:text-slate-950 text-white border border-slate-800 flex items-center justify-center transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
