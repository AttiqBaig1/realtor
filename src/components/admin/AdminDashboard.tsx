import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Property, Lead, Testimonial } from '../../types';
import { PropertyFormModal } from './PropertyFormModal';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MessageSquare, 
  Settings, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Sparkles, 
  LogOut, 
  ExternalLink, 
  Download, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  Wand2,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';

type AdminTab = 'overview' | 'properties' | 'leads' | 'testimonials' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { 
    properties, 
    leads, 
    testimonials, 
    settings, 
    updateSettings, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    updateLeadStatus, 
    deleteLead, 
    addTestimonial, 
    deleteTestimonial, 
    logoutAdmin, 
    formatPrice, 
    setCurrentPage, 
    navigateToPropertyDetails, 
    showToast,
    adminUser,
    realtorProfile,
    isAgencyMode
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Property Modal
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Property Search & Filter in Admin
  const [propSearch, setPropSearch] = useState('');
  const [propCategory, setPropCategory] = useState('all');

  // Lead Filter
  const [leadFilterType, setLeadFilterType] = useState('all');

  // Testimonial Modal / Form
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientRole, setNewClientRole] = useState('');
  const [newClientLoc, setNewClientLoc] = useState('');
  const [newClientReview, setNewClientReview] = useState('');
  const [newClientRating, setNewClientRating] = useState(5);

  // High-Level KPIs
  const totalValuation = properties.reduce((acc, p) => acc + (p.discountPrice || p.price), 0);
  const totalViews = properties.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const activeLeadsCount = leads.filter(l => l.status === 'new' || l.status === 'in-progress').length;
  const showingBookingsCount = leads.filter(l => l.type === 'booking').length;

  const filteredAdminProps = properties.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(propSearch.toLowerCase()) || p.location.city.toLowerCase().includes(propSearch.toLowerCase());
    const matchCat = propCategory === 'all' || p.propertyType.toLowerCase() === propCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  const filteredLeads = leads.filter(l => {
    if (leadFilterType === 'all') return true;
    return l.type === leadFilterType;
  });

  const handleSaveProperty = (data: Partial<Property>) => {
    if (editingProperty) {
      updateProperty(editingProperty.id, data);
    } else {
      addProperty(data as any);
    }
    setEditingProperty(null);
  };

  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientReview) return;
    addTestimonial({
      clientName: newClientName,
      role: newClientRole || 'Private Principal',
      location: newClientLoc || 'Global Enclave',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      review: newClientReview,
      rating: newClientRating
    });
    setTestModalOpen(false);
    setNewClientName('');
    setNewClientRole('');
    setNewClientLoc('');
    setNewClientReview('');
  };

  const exportLeadsToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Name', 'Email', 'Phone', 'Property', 'Message', 'Status'];
    const rows = leads.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleDateString(),
      l.type,
      `"${l.name}"`,
      l.email,
      `"${l.phone}"`,
      `"${l.propertyTitle || 'General'}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aura_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads CSV Export Complete.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Admin Navigation Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold">
            {realtorProfile.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm tracking-wider text-white flex items-center gap-2">
              <span>{realtorProfile.name} Console</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isAgencyMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isAgencyMode ? 'SEO Consultant Master' : 'Verified Portal Admin'}
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 block font-mono">
              Market: {realtorProfile.city} • Logged in as: {adminUser?.email || 'Administrator'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* SEO Generator direct button - Only visible in Agency Master Mode */}
          {isAgencyMode && (
            <button
              onClick={() => setCurrentPage('seo-engine')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:brightness-110"
              title="Agency Master Tool"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEO Engine & Generator</span>
            </button>
          )}

          <button
            onClick={() => setCurrentPage('home')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Live Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout: Sidebar + Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto">
          {[
            { id: 'overview' as const, label: 'Overview & KPIs', icon: LayoutDashboard },
            { id: 'properties' as const, label: `Estates (${properties.length})`, icon: Building2 },
            { id: 'leads' as const, label: `VIP Leads (${leads.length})`, icon: Users },
            { id: 'testimonials' as const, label: `Endorsements (${testimonials.length})`, icon: MessageSquare },
            { id: 'settings' as const, label: 'Console Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Quick link to SEO engine from sidebar - Only in Agency Master Mode */}
          {isAgencyMode && (
            <button
              onClick={() => setCurrentPage('seo-engine')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/20 mt-2 transition-all whitespace-nowrap"
            >
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>SEO Demo Engine</span>
            </button>
          )}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Real-Time Sovereign Telemetry</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Executive Performance Summary
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Active portfolio metrics, inbound buyer leads, and high-priority VIP showings.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      setPropertyModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>List New Estate</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Portfolio Valuation</span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                    {formatPrice(totalValuation)}
                  </div>
                  <span className="text-[11px] text-emerald-400 block font-medium">Across {properties.length} Sovereign Holdings</span>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Inbound VIP Leads</span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {leads.length}
                  </div>
                  <span className="text-[11px] text-amber-400 block font-medium">{activeLeadsCount} Pending Follow-up</span>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Private VIP Showings</span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {showingBookingsCount}
                  </div>
                  <span className="text-[11px] text-slate-400 block font-medium">Scheduled via Concierge</span>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Listing Impressions</span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {totalViews.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-400 block font-medium">+14.2% This Month</span>
                </div>
              </div>

              {/* Recent Inbound Leads Table */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-white">
                    Recent Inbound Buyer Transmissions
                  </h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    View All Leads ({leads.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Client Name</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Property Reference</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {leads.slice(0, 5).map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/30">
                          <td className="py-3 font-semibold text-white">
                            {lead.name}
                            <span className="block text-[10px] text-slate-400 font-normal">{lead.email}</span>
                          </td>
                          <td className="py-3 capitalize text-slate-300">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lead.type === 'booking' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {lead.type}
                            </span>
                          </td>
                          <td className="py-3 text-slate-300 truncate max-w-xs">
                            {lead.propertyTitle || 'General Advisory'}
                          </td>
                          <td className="py-3">
                            <select
                              value={lead.status}
                              onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                              className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-400 font-semibold focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in-progress">In-Progress</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="p-1 text-slate-500 hover:text-rose-400"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              
              {/* Properties Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search title, city, reference..."
                      value={propSearch}
                      onChange={e => setPropSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Category */}
                  <select
                    value={propCategory}
                    onChange={e => setPropCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Villa">Villas</option>
                    <option value="Penthouse">Penthouses</option>
                    <option value="Mansion">Mansions</option>
                    <option value="Island">Islands</option>
                    <option value="Estate">Palazzos</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setEditingProperty(null);
                    setPropertyModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>List New Sovereign Estate</span>
                </button>
              </div>

              {/* Properties List Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                        <th className="p-4 font-semibold">Estate</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Valuation</th>
                        <th className="p-4 font-semibold">Specs</th>
                        <th className="p-4 font-semibold">Featured</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredAdminProps.map(property => (
                        <tr key={property.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={property.thumbnail}
                                alt={property.title}
                                className="w-12 h-12 rounded-lg object-cover bg-slate-950"
                              />
                              <div>
                                <h4 className="font-serif font-bold text-white">{property.title}</h4>
                                <span className="text-[10px] text-amber-400 font-medium">
                                  {property.location.city}, {property.location.country}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-slate-300">
                            {property.propertyType}
                            <span className="block text-[10px] text-slate-500">For {property.purpose}</span>
                          </td>

                          <td className="p-4 font-mono font-bold text-amber-400">
                            {formatPrice(property.discountPrice || property.price)}
                          </td>

                          <td className="p-4 text-slate-300 text-[11px]">
                            {property.bedrooms} Beds • {property.bathrooms} Baths<br />
                            {property.area.toLocaleString()} {property.areaUnit}
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => updateProperty(property.id, { featured: !property.featured })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                property.featured
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {property.featured ? 'Featured' : 'Standard'}
                            </button>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => updateProperty(property.id, { isPublished: !property.isPublished })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                property.isPublished
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {property.isPublished ? 'Published' : 'Draft'}
                            </button>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigateToPropertyDetails(property.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="Preview on Frontend"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  setEditingProperty(property);
                                  setPropertyModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors"
                                title="Edit Listing"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you wish to delete ${property.title}?`)) {
                                    deleteProperty(property.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                                title="Delete Property"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIP LEADS & INQUIRIES */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              
              {/* Leads Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {['all', 'booking', 'inquiry', 'contact'].map(type => (
                    <button
                      key={type}
                      onClick={() => setLeadFilterType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                        leadFilterType === type
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type === 'all' ? 'All Inquiries' : `${type}s`}
                    </button>
                  ))}
                </div>

                <button
                  onClick={exportLeadsToCSV}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-xs font-semibold text-white flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Export CSV Dossier</span>
                </button>
              </div>

              {/* Leads Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLeads.map(lead => (
                  <div
                    key={lead.id}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-white">{lead.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lead.type === 'booking' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                          }`}>
                            {lead.type}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Received: {new Date(lead.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <select
                        value={lead.status}
                        onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 focus:outline-none"
                      >
                        <option value="new">● New</option>
                        <option value="contacted">● Contacted</option>
                        <option value="in-progress">● In-Progress</option>
                        <option value="closed">● Closed</option>
                      </select>
                    </div>

                    {lead.propertyTitle && (
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-amber-300 font-medium">
                        Target Estate: {lead.propertyTitle}
                      </div>
                    )}

                    {lead.preferredDate && (
                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Requested Showing: {lead.preferredDate}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                      "{lead.message}"
                    </p>

                    {/* Direct Contact Actions */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-slate-300 hover:text-amber-400 flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-slate-300 hover:text-amber-400 flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>

                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TESTIMONIALS MANAGEMENT */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-white">
                  Client Endorsements & Provenance
                </h3>
                <button
                  onClick={() => setTestModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Client Endorsement</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(t => (
                  <div key={t.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={t.photo} alt={t.clientName} className="w-12 h-12 rounded-full object-cover border border-amber-500" />
                        <div>
                          <h4 className="font-bold text-white text-sm">{t.clientName}</h4>
                          <span className="text-xs text-amber-400 block">{t.role}</span>
                          <span className="text-[10px] text-slate-400">{t.location}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteTestimonial(t.id)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 italic">
                      "{t.review}"
                    </p>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <h3 className="font-serif font-bold text-xl text-white">
                Global Console & Brokerage Parameters
              </h3>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Active Currency Formatting</label>
                  <select
                    value={settings.currency}
                    onChange={e => updateSettings({ currency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="EUR">EUR (€) - Eurozone</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AED">AED (AED) - UAE Dirham</option>
                    <option value="CHF">CHF (CHF) - Swiss Franc</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Brokerage Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={e => updateSettings({ siteName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Encrypted WhatsApp VIP Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={e => updateSettings({ whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Primary Executive Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={e => updateSettings({ contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Property Create/Edit Modal */}
      <PropertyFormModal
        property={editingProperty}
        isOpen={propertyModalOpen}
        onClose={() => {
          setPropertyModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleSaveProperty}
      />

      {/* Testimonial Create Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-white space-y-4">
            <h3 className="text-lg font-serif font-bold">Add Client Endorsement</h3>
            <form onSubmit={handleCreateTestimonial} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Client Name"
                value={newClientName}
                onChange={e => setNewClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Role / Title (e.g. Managing Partner, Family Office)"
                value={newClientRole}
                onChange={e => setNewClientRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Location (e.g. Geneva, Switzerland)"
                value={newClientLoc}
                onChange={e => setNewClientLoc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <textarea
                rows={3}
                required
                placeholder="Client Testimonial Review..."
                value={newClientReview}
                onChange={e => setNewClientReview(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Add Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
