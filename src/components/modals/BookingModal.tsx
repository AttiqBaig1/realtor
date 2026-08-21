import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Plane, 
  Car, 
  Glasses 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BookingModal: React.FC = () => {
  const { 
    bookingModalOpen, 
    setBookingModalOpen, 
    bookingProperty, 
    addLead, 
    formatPrice 
  } = useRealEstate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('14:00 - 16:00 (Afternoon)');
  const [visitType, setVisitType] = useState<'In-Person VIP Tour' | 'Private Helicopter' | 'Live 4K Virtual Walkthrough'>('In-Person VIP Tour');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!bookingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    addLead({
      type: 'schedule_visit',
      name,
      email,
      phone,
      propertyId: bookingProperty?.id,
      propertyTitle: bookingProperty?.title || 'General Portfolio Inspection',
      date: date || 'Immediate / Flexible',
      timeSlot,
      visitType,
      message: message || `Private viewing request for ${bookingProperty?.title || 'Luxury Portfolio'}`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setBookingModalOpen(false);
    }, 2500);
  };

  return (
    <div 
      onClick={() => setBookingModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full text-white shadow-2xl overflow-hidden relative my-8"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-6 relative">
          <button
            onClick={() => setBookingModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-slate-950 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Private Showing Reservation</span>
          </div>
          
          <h3 className="text-2xl font-serif font-bold text-slate-950">
            Book Bespoke Private Visit
          </h3>
          
          {bookingProperty && (
            <p className="text-slate-900/90 text-sm mt-1 font-medium truncate">
              {bookingProperty.title} ({formatPrice(bookingProperty.discountPrice || bookingProperty.price)})
            </p>
          )}
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-serif font-bold text-white">Private Tour Reserved</h4>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Our Senior Managing Partner has received your confidential itinerary and will contact you directly within 2 hours to confirm security logistics.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Tour Type Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Select Showing Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'In-Person VIP', value: 'In-Person VIP Tour' as const, icon: Car },
                  { label: 'Helicopter Air', value: 'Private Helicopter' as const, icon: Plane },
                  { label: '4K Live Virtual', value: 'Live 4K Virtual Walkthrough' as const, icon: Glasses }
                ].map(item => {
                  const Icon = item.icon;
                  const active = visitType === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => setVisitType(item.value)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                        active
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Full Name / Principal
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Lord / Lady / Dr. Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Direct Telephone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Confidential Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="client@familyoffice.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Time Preference
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="10:00 - 12:00 (Morning)">10:00 - 12:00 (Morning)</option>
                    <option value="14:00 - 16:00 (Afternoon)">14:00 - 16:00 (Afternoon)</option>
                    <option value="17:00 - 19:00 (Sunset Champagne Showing)">17:00 - 19:00 (Sunset Champagne Showing)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Specific Concierge or Security Logistics
              </label>
              <textarea
                rows={2}
                placeholder="Airport chauffeur pickup, NDA requirements, private jet tarmac access..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-sm font-bold tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Confirm VIP Showing
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
