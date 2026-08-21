import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  Sparkles, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Facebook, 
  Shield, 
  FileText, 
  Compass,
  ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, showToast, settings, isAgencyMode, realtorProfile } = useRealEstate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please provide a valid private client email.', 'error');
      return;
    }
    setSubscribed(true);
    showToast(`Subscribed to ${realtorProfile.name} Private Off-Market Dossier.`);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#0B0F19] text-slate-300 pt-20 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Background luxury subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <button
              onClick={() => {
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-[#D4AF37] to-amber-700 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight sm:tracking-[0.05em] font-display text-white group-hover:text-[#D4AF37] transition-colors block leading-tight">
                  {realtorProfile.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium block mt-1">
                  {realtorProfile.primaryKeyword || `${realtorProfile.city} Luxury Estates`}
                </span>
              </div>
            </button>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {realtorProfile.bio || `The premier real estate authority representing exquisite properties, private luxury estates, and high-value residential acquisitions across ${realtorProfile.city} and prime worldwide destinations.`}
            </p>

            <div className="flex items-center gap-3">
              <a 
                href={settings.socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#141B2D] hover:bg-[#D4AF37] hover:text-slate-950 text-slate-400 flex items-center justify-center border border-slate-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#141B2D] hover:bg-[#D4AF37] hover:text-slate-950 text-slate-400 flex items-center justify-center border border-slate-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks.youtube} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#141B2D] hover:bg-[#D4AF37] hover:text-slate-950 text-slate-400 flex items-center justify-center border border-slate-800 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks.facebook} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#141B2D] hover:bg-[#D4AF37] hover:text-slate-950 text-slate-400 flex items-center justify-center border border-slate-800 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.2em] font-sans">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-[#D4AF37] transition-colors"
                >
                  Home Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('properties'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-[#D4AF37] transition-colors"
                >
                  All Prime Listings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('why-choose'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-[#D4AF37] transition-colors"
                >
                  Private Advisory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-[#D4AF37] transition-colors"
                >
                  About {realtorProfile.name}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-[#D4AF37] transition-colors"
                >
                  Contact & Office
                </button>
              </li>
            </ul>
          </div>

          {/* Luxury Portfolios */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.2em] font-sans">
              Prime Markets
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="text-amber-400 font-semibold">{realtorProfile.city} Premier</li>
              <li>Manhattan & The Hamptons</li>
              <li>Dubai Palm & Emirates Hills</li>
              <li>Beverly Hills & Bel-Air</li>
              <li>Lake Como & Costa Smeralda</li>
              <li>London Mayfair & Kensington</li>
            </ul>
          </div>

          {/* Private Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.2em] font-sans">
              Private Dossier
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive confidential off-market briefings and quarterly luxury real estate market reports.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-amber-300 text-xs font-medium">
                ✓ Confidential invitation confirmed.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter private email"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B2D] border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#D4AF37] hover:brightness-110 text-slate-950 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block">Strict non-disclosure & spam-free policy.</span>
              </form>
            )}
          </div>
        </div>

        {/* Global Offices / Realtor Contact Bar */}
        <div className="border-t border-slate-800/80 pt-8 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-400">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Primary Headquarters</span>
              <span>{realtorProfile.address || `${realtorProfile.city}`}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Direct Advisory Email</span>
              <a href={`mailto:${realtorProfile.email}`} className="hover:text-amber-300 transition-colors">
                {realtorProfile.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Licensed Authority</span>
              <span>{realtorProfile.experienceYears || '20+ Years'} Market Leader</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">24/7 VIP Concierge Line</span>
              <a href={`tel:${realtorProfile.phone}`} className="hover:text-amber-300 transition-colors">
                {realtorProfile.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {realtorProfile.name}. All Rights Reserved.</p>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => showToast(`${realtorProfile.name} Privacy Statement: We adhere to Swiss Banking grade data encryption and NDA standards.`, 'info')} 
              className="hover:text-slate-300 transition-colors"
            >
              Privacy NDA Policy
            </button>
            <button 
              onClick={() => showToast('Terms of Exclusive Representation & Advisory.', 'info')} 
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => showToast('Sitemap: /home, /properties, /why-choose, /about, /contact', 'info')} 
              className="hover:text-slate-300 transition-colors"
            >
              XML Sitemap
            </button>
            {isAgencyMode ? (
              <button 
                onClick={() => {
                  setCurrentPage('seo-engine');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors font-medium flex items-center gap-1"
              >
                SEO Generator Suite
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
};
