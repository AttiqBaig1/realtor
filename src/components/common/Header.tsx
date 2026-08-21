import React, { useState, useEffect } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  Heart, 
  Scale, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Phone,
  MessageCircle,
  Wand2,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    wishlist, 
    compareList, 
    openBookingModal,
    adminUser,
    realtorProfile,
    isAgencyMode,
    toggleAgencyMode
  } = useRealEstate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [secretClickCount, setSecretClickCount] = useState(0);

  const handleSecretLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 5) {
      setSecretClickCount(0);
      toggleAgencyMode();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setIsScrolled(currentScroll > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Properties', page: 'properties' as const },
    { label: 'Why Choose Us', page: 'why-choose' as const },
    { label: 'About', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const }
  ];

  return (
    <>
      {/* Scroll progress bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-200 z-50 transition-all duration-100 ease-out pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Banner ONLY for Agency Master Mode (?agency=true) */}
      {isAgencyMode && (
        <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/40 text-amber-200 text-xs py-1.5 px-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 max-w-4xl truncate">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
              Agency Master Mode
            </span>
            <span className="font-medium text-slate-200 truncate text-[11px] sm:text-xs">
              Previewing client: <strong className="text-amber-300 font-semibold">{realtorProfile.name}</strong> ({realtorProfile.city})
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setCurrentPage('seo-engine');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all shadow"
            >
              <Wand2 className="w-3 h-3" />
              <span>SEO Generator & Bulk CSV</span>
            </button>
            <button
              onClick={() => toggleAgencyMode()}
              className="text-[11px] text-slate-400 hover:text-white underline underline-offset-2 ml-1"
              title="Switch to pure client preview"
            >
              Exit Agency Mode
            </button>
          </div>
        </div>
      )}

      <header
        className={`fixed ${isAgencyMode ? 'top-[31px]' : 'top-0'} left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-950/92 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3.5 text-white'
            : 'bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-transparent py-4 sm:py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo / Realtor Brand Name */}
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group text-left shrink-0"
            id="aura-brand-logo"
          >
            <div 
              onClick={handleSecretLogoClick}
              title={isAgencyMode ? 'Agency Master Active (Click 5x to hide)' : undefined}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div className="max-w-[200px] sm:max-w-[280px]">
              <span className="text-base sm:text-lg font-bold tracking-tight sm:tracking-[0.05em] font-display text-white group-hover:text-amber-300 transition-colors block truncate leading-tight">
                {realtorProfile.name || 'AURA Luxury Estates'}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400/90 font-medium truncate mt-0.5">
                <MapPin className="w-2.5 h-2.5 shrink-0 text-amber-400" />
                <span className="truncate">{realtorProfile.city || 'Private Client Real Estate'}</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => {
              const active = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => {
                    setCurrentPage(link.page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-sm font-medium tracking-wide transition-all relative py-1 ${
                    active 
                      ? 'text-amber-400 font-semibold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="header-active-tab"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls - Pristine & Clean Client Real Estate Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct Realtor Phone */}
            <a
              href={`tel:${realtorProfile.phone}`}
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-800 transition-colors"
              title={`Call ${realtorProfile.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{realtorProfile.phone}</span>
            </a>

            {/* Client Portal / Admin Button */}
            <button
              onClick={() => {
                if (adminUser) {
                  setCurrentPage('admin-dashboard');
                } else {
                  setCurrentPage('admin-login');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Client Admin Dashboard & Portal"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                currentPage === 'admin' || currentPage === 'admin-dashboard' || currentPage === 'admin-login'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-amber-500/30 hover:border-amber-400/60 shadow-sm'
              }`}
              id="header-client-portal-btn"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{adminUser ? 'Admin Portal' : 'Admin Portal'}</span>
              <span className="sm:hidden">Portal</span>
              {adminUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                setCurrentPage('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="View Wishlist"
              className="relative p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-700/60 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Compare Button */}
            <button
              onClick={() => {
                setCurrentPage('compare');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Compare Properties"
              className="relative p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-700/60 transition-colors"
              aria-label="Compare Properties"
            >
              <Scale className="w-4 h-4" />
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-md">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* CTA: Book VIP Visit */}
            <button
              onClick={() => openBookingModal()}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Book Showing
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900/80 text-white border border-slate-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-x-0 ${isAgencyMode ? 'top-[95px]' : 'top-[68px]'} bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 z-40 p-6 flex flex-col gap-4 shadow-2xl text-white lg:hidden`}
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map(link => (
                <button
                  key={link.page}
                  onClick={() => {
                    setCurrentPage(link.page);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-left text-base font-medium py-2.5 px-3 rounded-lg transition-colors ${
                    currentPage === link.page 
                      ? 'bg-amber-500/10 text-amber-400 font-semibold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              {/* Client Portal / Admin in Mobile Drawer */}
              <button
                onClick={() => {
                  if (adminUser) {
                    setCurrentPage('admin-dashboard');
                  } else {
                    setCurrentPage('admin-login');
                  }
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-left text-sm font-semibold py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors ${
                  currentPage === 'admin' || currentPage === 'admin-dashboard' || currentPage === 'admin-login'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Client Admin Portal</span>
                </div>
                {adminUser && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    Logged In
                  </span>
                )}
              </button>

              {/* Only shown in mobile drawer if Agency Master is active */}
              {isAgencyMode && (
                <button
                  onClick={() => {
                    setCurrentPage('seo-engine');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-base font-semibold py-2.5 px-3 rounded-lg text-amber-300 bg-amber-500/10 border border-amber-500/20 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    SEO Website Generator & Bulk CSV
                  </span>
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Master
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  setCurrentPage('wishlist');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-base font-medium py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" />
                  Saved Wishlist
                </span>
                <span className="bg-slate-800 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('compare');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-base font-medium py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Compare Properties
                </span>
                <span className="bg-slate-800 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                  {compareList.length}
                </span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Direct Office Phone:</span>
                <a href={`tel:${realtorProfile.phone}`} className="text-amber-300 font-semibold">{realtorProfile.phone}</a>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-xs font-bold text-center shadow-lg"
              >
                Book VIP Showing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
