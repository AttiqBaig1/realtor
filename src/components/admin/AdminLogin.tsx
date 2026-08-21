import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setCurrentPage, realtorProfile } = useRealEstate();
  const [email, setEmail] = useState('admin@auraestates.com');
  const [password, setPassword] = useState('luxury2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(email, password);
      setLoading(false);
      if (!success) {
        setError('Invalid sovereign credentials. Please verify your email and passkey.');
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@auraestates.com');
    setPassword('luxury2026');
    setLoading(true);
    setTimeout(() => {
      loginAdmin('admin@auraestates.com', 'luxury2026');
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs uppercase font-bold tracking-widest pt-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Management Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {realtorProfile.name} Console
          </h2>
          <p className="text-xs text-slate-400">
            Authorized administrative access for managing listings, leads, and client dossiers.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">
              Authorized Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">
              Cryptographic Passkey
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Demo Credentials hint with 1-click quick login */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">Demo Credentials:</span>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded transition-colors"
              >
                1-Click Instant Login
              </button>
            </div>
            <div className="text-[11px] text-slate-400">
              Email: <code className="text-amber-200">admin@auraestates.com</code> | Pass: <code className="text-amber-200">luxury2026</code>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Management Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs text-slate-400 hover:text-white"
          >
            ← Return to Public Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
};
