import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyMap } from '../property/PropertyMap';
import { 
  Sparkles, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Check,
  Building2,
  UserCheck
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { addLead, settings, properties, showToast, realtorProfile } = useRealEstate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interestType, setInterestType] = useState('Acquisition / Buying');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast('Please fill in required contact fields.', 'error');
      return;
    }

    addLead({
      type: 'contact',
      name,
      email,
      phone,
      message: `[${interestType}] ${message}`
    });

    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  const handleWhatsApp = () => {
    const cleanWa = realtorProfile.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${realtorProfile.agentName}, I would like to inquire about your private off-market luxury portfolio in ${realtorProfile.city}.`);
    window.open(`https://wa.me/${cleanWa}?text=${text}`, '_blank');
  };

  return (
    <section className="py-24 bg-[#0B0F19] text-[#F8FAFC] transition-colors relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.25em] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Private Client Advisory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            Connect with {realtorProfile.agentName}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed font-light">
            Providing bespoke representation and confidential acquisitions across <strong>{realtorProfile.city}</strong> and worldwide prime markets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive Map & NAP Office Cards */}
          <div className="lg:col-span-6 space-y-6">
            <PropertyMap properties={properties} className="h-[340px]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#141B2D] border border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{realtorProfile.city} Office</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {realtorProfile.address}
                </p>
                <a href={`tel:${realtorProfile.phone}`} className="text-xs font-bold text-amber-300 hover:underline block">
                  {realtorProfile.phone}
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-[#141B2D] border border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Direct Broker</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {realtorProfile.agentName}<br />
                  <span className="text-slate-400">{realtorProfile.name}</span>
                </p>
                <a href={`mailto:${realtorProfile.email}`} className="text-xs font-bold text-slate-200 hover:underline block truncate">
                  {realtorProfile.email}
                </a>
              </div>
            </div>

            {/* Direct WhatsApp VIP button */}
            <button
              onClick={handleWhatsApp}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp {realtorProfile.agentName === realtorProfile.name ? 'Us' : realtorProfile.agentName.split(' ')[0]} Directly ({realtorProfile.whatsapp})</span>
            </button>
          </div>

          {/* Right Column: Confidential Form */}
          <div className="lg:col-span-6 bg-[#141B2D] p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  Direct Private Consultation
                </h3>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Guaranteed Prompt Response • Non-Disclosure Adherent
                </span>
              </div>
              <ShieldCheck className="w-8 h-8 text-[#D4AF37] shrink-0" />
            </div>

            {sent ? (
              <div className="p-8 text-center space-y-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/30">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-slate-950 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif font-bold text-white">Inquiry Received</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your confidential brief has been forwarded directly to {realtorProfile.agentName}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-slate-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">
                      Direct Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-slate-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-slate-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">
                    Nature of Inquiry
                  </label>
                  <select
                    value={interestType}
                    onChange={e => setInterestType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-slate-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Acquisition / Buying">Prime Real Estate Acquisition</option>
                    <option value="Discreet Sale / Representation">Discreet Sale / Representation</option>
                    <option value="Luxury Lease">Luxury Seasonal / Annual Lease</option>
                    <option value="Private Showing Itinerary">Private VIP Showing Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">
                    Portfolio Requirements or Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Looking for properties in ${realtorProfile.city}...`}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#D4AF37] hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to {realtorProfile.agentName}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
