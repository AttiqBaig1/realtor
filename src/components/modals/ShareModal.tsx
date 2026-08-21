import React, { useState } from 'react';
import { Property } from '../../types';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  MessageCircle, 
  Linkedin, 
  Twitter 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ShareModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ property, isOpen, onClose }) => {
  const { showToast } = useRealEstate();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.origin + '#' + property.slug;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Listing URL copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Exclusive Trophy Property via AURA Estates: ${property.title}\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Discovering architectural excellence: ${property.title} via @auraestates`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(`Confidential Property Briefing: ${property.title}`);
    const body = encodeURIComponent(`Dear Colleague,\n\nPlease review this exceptional luxury estate represented by AURA Estates:\n\n${property.title}\nLocation: ${property.location.city}, ${property.location.country}\n\nView details: ${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white">
              Share Luxury Property
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <img
            src={property.thumbnail}
            alt={property.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{property.title}</h4>
            <span className="text-xs text-amber-400 block">{property.location.city}, {property.location.country}</span>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-medium block">
            Direct Confidential Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          <button
            onClick={shareWhatsApp}
            className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/60 flex flex-col items-center gap-1 text-xs font-medium transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareLinkedIn}
            className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-400 hover:bg-blue-900/60 flex flex-col items-center gap-1 text-xs font-medium transition-colors"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </button>

          <button
            onClick={shareTwitter}
            className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-sky-400 hover:bg-sky-900/60 flex flex-col items-center gap-1 text-xs font-medium transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span>X / Twitter</span>
          </button>

          <button
            onClick={shareEmail}
            className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 flex flex-col items-center gap-1 text-xs font-medium transition-colors"
          >
            <Send className="w-5 h-5" />
            <span>Email</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
