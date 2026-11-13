import React, { useState, useEffect, useRef } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealtorProfile, BatchRealtorItem } from '../../types';
import { REALTOR_PRESETS } from '../../data/realtorPresets';
import { shortenWithTinyUrl, batchShortenUrls, isShortened } from '../../utils/urlShortener';
import { parseRealtorCsv, exportBatchRealtorsToCsv, downloadSampleCsvTemplate } from '../../utils/csvHelper';
import { 
  Wand2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ArrowLeft, 
  Download, 
  Upload, 
  RefreshCw,
  Eye,
  Sliders,
  Award,
  Globe,
  Share2,
  CheckCircle2,
  ListPlus,
  Link as LinkIcon,
  FileSpreadsheet,
  Zap,
  Clock,
  MessageCircle,
  Scissors
} from 'lucide-react';
import { motion } from 'motion/react';
import { WordPressPublisher } from './WordPressPublisher';

export const SeoEngineGenerator: React.FC = () => {
  const { 
    realtorProfile, 
    updateRealtorProfile, 
    resetRealtorProfile, 
    loadRealtorPreset, 
    generateDynamicUrl,
    setCurrentPage,
    showToast,
    isAgencyMode,
    setIsAgencyMode
  } = useRealEstate();

  // Automatically activate Agency Mode while in SEO Generator Suite
  useEffect(() => {
    if (!isAgencyMode) {
      setIsAgencyMode(true);
    }
  }, []);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'presets' | 'seo-preview' | 'wordpress'>('bulk');

  // Form State for Single Client Demo Generator
  const [formData, setFormData] = useState<Partial<RealtorProfile>>({
    name: realtorProfile.name,
    agentName: realtorProfile.agentName,
    city: realtorProfile.city,
    address: realtorProfile.address,
    phone: realtorProfile.phone,
    email: realtorProfile.email,
    whatsapp: realtorProfile.whatsapp,
    primaryKeyword: realtorProfile.primaryKeyword || 'Top-Rated 5-Star Professional Realtor',
    salesVolume: realtorProfile.salesVolume || '$380M+',
    experienceYears: realtorProfile.experienceYears || '18+ Years',
    rating: realtorProfile.rating || 5.0,
    reviewCount: realtorProfile.reviewCount || 156
  });

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [singleTinyUrl, setSingleTinyUrl] = useState<string>('');
  const [isSingleShortening, setIsSingleShortening] = useState(false);
  const [copiedSingleTiny, setCopiedSingleTiny] = useState(false);

  // Bulk CSV / Tabular input
  const defaultRawCsv = `Name,Agent Name,Address,City,Phone,Email,WhatsApp,SEO Keyword,Sales Volume
Vance & Co. Luxury Real Estate,Marcus Vance,"1240 Spring Street, Paso Robles, CA 93446","Paso Robles, CA",+1 (805) 238-9900,marcus@vanceproperties.com,+18052389900,"5-Star Professional Realtor","$380M+"
Central Valley Prime Realty,David Sterling,"7110 N Fresno St, Fresno, CA 93720","Fresno, CA",+1 (559) 438-2200,david@fresnoprimerealty.com,+15594382200,"Premier Luxury Realtor","$420M+"
Montecito & Riviera Real Estate,Victoria Kensington,"1150 Coast Village Rd, Santa Barbara, CA 93108","Santa Barbara, CA",+1 (805) 969-4400,victoria@santabarbaraluxury.com,+18059694400,"Top-Tier Luxury Real Estate Specialist","$650M+"
Waterloo Tech-Corridor Estates,Liam Gallagher,"7 Erb St W, Waterloo, ON N2L 1S8","Waterloo, ON",+1 (519) 886-3000,liam@waterlooestates.ca,+15198863000,"Trusted Luxury Realtor","$290M+"
Grand River Heritage Realty,Emily Chen,"305 King St W, Kitchener, ON N2G 1B9","Kitchener, ON",+1 (519) 745-8000,emily@grandriverheritage.com,+15197458000,"Local Real Estate Consultant","$240M+"`;

  const [bulkInput, setBulkInput] = useState<string>(defaultRawCsv);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [generatedBatch, setGeneratedBatch] = useState<BatchRealtorItem[]>([]);
  const [isBatchShortening, setIsBatchShortening] = useState(false);
  const [shorteningProgress, setShorteningProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [copiedBatchId, setCopiedBatchId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate initial Short Link when single URL changes
  const currentGeneratedUrl = generateDynamicUrl(formData);

  useEffect(() => {
    let active = true;
    const fetchSingleShort = async () => {
      setIsSingleShortening(true);
      try {
        const short = await shortenWithTinyUrl(currentGeneratedUrl);
        if (active) {
          setSingleTinyUrl(short);
        }
      } catch (err) {
        if (active) {
          setSingleTinyUrl(currentGeneratedUrl);
        }
      } finally {
        if (active) setIsSingleShortening(false);
      }
    };

    fetchSingleShort();
    return () => { active = false; };
  }, [currentGeneratedUrl]);

  // Initial populate of default batch on mount
  useEffect(() => {
    if (generatedBatch.length === 0) {
      const parsed = parseRealtorCsv(bulkInput, generateDynamicUrl);
      setGeneratedBatch(parsed);
      // Auto shorten default batch
      triggerBatchShortening(parsed);
    }
  }, []);

  // Trigger batch shortening with Short Link
  const triggerBatchShortening = async (items: BatchRealtorItem[]) => {
    if (items.length === 0) return;
    setIsBatchShortening(true);
    setShorteningProgress({ current: 0, total: items.length });

    const urlList = items.map(it => ({ id: it.id, url: it.generatedUrl || '' }));

    try {
      const shortMap = await batchShortenUrls(urlList, (completed, total, currentItem) => {
        setShorteningProgress({ current: completed, total });
        if (currentItem) {
          setGeneratedBatch(prev => prev.map(item => 
            item.id === currentItem.id ? { ...item, tinyUrl: currentItem.shortUrl, isShortening: false } : item
          ));
        }
      });

      setGeneratedBatch(prev => prev.map(item => ({
        ...item,
        tinyUrl: shortMap[item.id] || item.tinyUrl || item.generatedUrl,
        isShortening: false
      })));

      showToast(`Generated Short Links for all ${items.length} realtors!`, 'success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsBatchShortening(false);
    }
  };

  // Automatically extract city from address when typing if city is empty
  const handleAddressChange = (addressText: string) => {
    let guessedCity = formData.city;
    if (!guessedCity || guessedCity === 'Paso Robles, CA') {
      const parts = addressText.split(',');
      if (parts.length >= 2) {
        guessedCity = parts[parts.length - 2].trim() + (parts.length >= 3 ? ', ' + parts[parts.length - 1].trim().split(' ')[0] : '');
      }
    }
    setFormData(prev => ({
      ...prev,
      address: addressText,
      city: guessedCity || prev.city
    }));
  };

  const handleApplyToLive = (e: React.FormEvent) => {
    e.preventDefault();
    updateRealtorProfile({
      ...formData,
      isCustomDemo: true
    });
    showToast(`Live demonstration updated for ${formData.name || 'client'}!`);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentGeneratedUrl);
    setCopiedUrl(true);
    showToast('Full dynamic link copied to clipboard!');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopySingleTinyUrl = () => {
    const urlToCopy = singleTinyUrl || currentGeneratedUrl;
    navigator.clipboard.writeText(urlToCopy);
    setCopiedSingleTiny(true);
    showToast('Short link copied to clipboard! Ready to send to client.');
    setTimeout(() => setCopiedSingleTiny(false), 2500);
  };

  // Handle CSV File Selection via input or drag-and-drop
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBulkInput(content);
        const parsed = parseRealtorCsv(content, generateDynamicUrl);
        setGeneratedBatch(parsed);
        showToast(`Imported ${parsed.length} realtors from ${file.name}! Processing Short Links...`);
        triggerBatchShortening(parsed);
      }
    };
    reader.readAsText(file);
  };

  // Process Bulk CSV / Textarea Data
  const handleProcessBulk = () => {
    try {
      const parsed = parseRealtorCsv(bulkInput, generateDynamicUrl);
      if (parsed.length === 0) {
        showToast('No valid realtor data detected. Please check CSV format.', 'error');
        return;
      }
      setGeneratedBatch(parsed);
      showToast(`Processed ${parsed.length} client demo URLs successfully! Generating Short Links...`);
      triggerBatchShortening(parsed);
    } catch (e) {
      showToast('Error parsing CSV. Please check formatting or download template.', 'error');
    }
  };

  // Export processed items to CSV
  const handleExportCsv = () => {
    if (generatedBatch.length === 0) {
      showToast('No realtor batch data to export. Please process a CSV first.', 'info');
      return;
    }
    exportBatchRealtorsToCsv(generatedBatch, `Realtor_Demos_${new Date().toISOString().slice(0,10)}.csv`);
    showToast('Downloaded processed CSV with Live Website URLs & Short Links!', 'success');
  };

  // Copy all Short Links formatted list
  const handleCopyAllTinyUrls = () => {
    if (generatedBatch.length === 0) return;
    const textList = generatedBatch.map(item => 
      `${item.name} (${item.city}): ${item.tinyUrl || item.generatedUrl}`
    ).join('\n');

    navigator.clipboard.writeText(textList);
    showToast(`Copied ${generatedBatch.length} Short Links to clipboard!`);
  };

  const handleLaunchBatchItem = (item: BatchRealtorItem) => {
    updateRealtorProfile({
      name: item.name,
      agentName: item.agentName,
      address: item.address,
      city: item.city,
      phone: item.phone,
      email: item.email,
      whatsapp: item.whatsapp || item.phone.replace(/[^0-9+]/g, ''),
      primaryKeyword: item.keyword || '5-Star Professional Realtor',
      salesVolume: item.salesVolume || '$250M+',
      isCustomDemo: true
    });
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner for Local SEO Consultant */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border border-amber-500/40 shadow-2xl">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0 mt-1 sm:mt-0">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                  Agency Master Suite
                </span>
                <span className="text-xs text-amber-400 font-medium hidden sm:inline">Bulk CSV & Short Link Generator</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                Realtor Bulk CSV & Short Link Demo Generator
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Upload your realtor dataset (Name, Address, Phone, City) in bulk CSV. The engine creates tailored Local SEO H1 headlines, NAP citations, and returns a downloadable CSV with live links & clean <strong>Short Links</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Preview Demo Site</span>
            </button>

            <button
              onClick={resetRealtorProfile}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Reset profile"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'wordpress', label: 'Publish to WordPress', icon: Globe },
            { id: 'bulk', label: 'Bulk CSV Upload & Export (with Short Links)', icon: FileSpreadsheet },
            { id: 'single', label: '1-Click Single Demo Generator', icon: Sliders },
            { id: 'presets', label: 'Requested City Presets (Paso Robles, Fresno, Santa Barbara, etc.)', icon: MapPin },
            { id: 'seo-preview', label: 'Local SEO H1 & Meta Audit', icon: Globe }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">

        {activeTab === 'wordpress' && (
          <WordPressPublisher single={formData} batch={generatedBatch} goToBulk={() => setActiveTab('bulk')} />
        )}

        {/* ========================================================================= */}
        {/* TAB 1: BULK CSV PROCESSOR & TINYURL GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === 'bulk' && (
          <div className="space-y-8">
            
            {/* Top Bulk Action Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: CSV File Upload & Text Area */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Upload className="w-5 h-5 text-amber-400" />
                      <span>Upload Bulk Realtor CSV</span>
                    </h2>
                    <button
                      onClick={downloadSampleCsvTemplate}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold underline underline-offset-2"
                      title="Download template for Excel or Google Sheets"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Template.csv</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-4">
                    Upload your CSV file containing realtor names, cities, addresses, and phone numbers.
                  </p>

                  {/* Drag-and-Drop / Browse File Upload Card */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-950/60 hover:bg-amber-950/10 rounded-2xl p-5 text-center cursor-pointer transition-all mb-4 group"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept=".csv,text/csv,text/plain" 
                      className="hidden" 
                    />
                    <FileSpreadsheet className="w-8 h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                      {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to Upload CSV or Drag & Drop File'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Supports standard CSV, comma, pipe, or tab-delimited sheets
                    </p>
                  </div>

                  {/* Manual Paste Textarea */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Or Paste CSV / Table Data Directly:</span>
                      <span className="text-[10px] text-slate-500 font-mono">Auto-detects columns</span>
                    </div>
                    <textarea
                      rows={8}
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-[11px] focus:border-amber-500 focus:outline-none leading-relaxed"
                      placeholder="Name,Agent Name,Address,City,Phone,Email..."
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleProcessBulk}
                    disabled={isBatchShortening}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{isBatchShortening ? 'Processing...' : 'Process CSV & Generate Short Links'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setBulkInput(defaultRawCsv);
                      setUploadedFileName('');
                      const parsed = parseRealtorCsv(defaultRawCsv, generateDynamicUrl);
                      setGeneratedBatch(parsed);
                      triggerBatchShortening(parsed);
                    }}
                    className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    title="Load 5 Sample Realtors"
                  >
                    Load Sample
                  </button>
                </div>
              </div>

              {/* Right Column: Processing Metrics & Actions */}
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span>Processed Realtors ({generatedBatch.length})</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Each realtor receives their custom Local SEO H1, NAP citation, full URL, and neat Short Link link.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportCsv}
                        disabled={generatedBatch.length === 0}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Results CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Shortening Progress Bar */}
                  {isBatchShortening && (
                    <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 mb-4 text-xs">
                      <div className="flex items-center justify-between font-semibold text-amber-300 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Scissors className="w-3.5 h-3.5 animate-spin" />
                          Shortening links with Short Link...
                        </span>
                        <span>{shorteningProgress.current} / {shorteningProgress.total}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-200"
                          style={{ width: `${(shorteningProgress.current / (shorteningProgress.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Summary Bar */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Clients</span>
                      <span className="text-lg font-bold text-white">{generatedBatch.length}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Short Links Ready</span>
                      <span className="text-lg font-bold text-amber-400">
                        {generatedBatch.filter(b => isShortened(b.tinyUrl, b.generatedUrl)).length}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Format</span>
                      <span className="text-xs font-bold text-emerald-400">Clean Short Link</span>
                    </div>
                  </div>

                  {/* Quick Copy List Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 text-xs text-slate-400">
                    <span>Generated Client Links:</span>
                    <button
                      onClick={handleCopyAllTinyUrls}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy All Short Links</span>
                    </button>
                  </div>
                </div>

                {/* Batch Items List */}
                <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
                  {generatedBatch.map((item, index) => {
                    const cleanTiny = item.tinyUrl || item.generatedUrl || '';
                    const isCopied = copiedBatchId === item.id;

                    return (
                      <div
                        key={item.id || index}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                {item.city}
                              </span>
                              <span className="text-xs text-slate-400">#{index + 1}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-1">{item.name}</h4>
                            <p className="text-xs text-slate-300">{item.agentName} • <span className="text-amber-300/90">{item.phone}</span></p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleLaunchBatchItem(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold flex items-center gap-1 shadow transition-all"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Site</span>
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(cleanTiny);
                                setCopiedBatchId(item.id);
                                showToast(`Copied Short Link for ${item.name}!`);
                                setTimeout(() => setCopiedBatchId(null), 2000);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                                isCopied 
                                  ? 'bg-emerald-500 text-slate-950' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                              }`}
                              title="Copy Clean Short Link"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-slate-950" /> : <Scissors className="w-3 h-3" />}
                              <span>{isCopied ? 'Copied' : 'Copy Short Link'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Short Link display box */}
                        <div className="p-2 bg-slate-900 rounded-xl flex items-center justify-between text-[11px] font-mono text-amber-300/90 border border-slate-800 truncate gap-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <LinkIcon className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{cleanTiny}</span>
                          </div>
                          <a
                            href={cleanTiny}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white shrink-0 p-0.5"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom CSV Export Banner */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Export contains all client records + Live URLs + Short Links.
                  </span>
                  <button
                    onClick={handleExportCsv}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Processed CSV</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SINGLE DEMO GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Form: Realtor Input Details */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <span>Realtor Client Information</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Fill in client details to instantly customize the live preview and generate their unique Short Link.
              </p>

              <form onSubmit={handleApplyToLive} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Brokerage / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vance & Co. Luxury Real Estate"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Lead Agent / Principal Broker Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={formData.agentName || ''}
                      onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      City / Target Market * (Used in H1 & SEO)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Paso Robles, CA"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Phone Number * (Direct NAP)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +1 (805) 238-9900"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: formData.whatsapp || e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Physical Office Address (NAP Local Citation)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1240 Spring Street, Paso Robles, CA 93446"
                    value={formData.address || ''}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="marcus@vanceproperties.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      WhatsApp Number (For Direct Concierge)
                    </label>
                    <input
                      type="text"
                      placeholder="+18052389900"
                      value={formData.whatsapp || ''}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Primary Local SEO Keyword Formula
                    </label>
                    <select
                      value={formData.primaryKeyword}
                      onChange={(e) => setFormData({ ...formData, primaryKeyword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Top-Rated 5-Star Professional Realtor">Top-Rated 5-Star Professional Realtor</option>
                      <option value="Premier Professional Realtor Services">Premier Professional Realtor Services</option>
                      <option value="5-Star Professional Realtor">5-Star Professional Realtor</option>
                      <option value="Top-Tier Luxury Real Estate Specialist">Top-Tier Luxury Real Estate Specialist</option>
                      <option value="Trusted 5-Star Real Estate Consultant">Trusted 5-Star Real Estate Consultant</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Sales Volume Metric (Social Proof)
                    </label>
                    <input
                      type="text"
                      placeholder="$380M+"
                      value={formData.salesVolume || ''}
                      onChange={(e) => setFormData({ ...formData, salesVolume: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Apply & Launch Live Demo Site</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySingleTinyUrl}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    {copiedSingleTiny ? <Check className="w-4 h-4" /> : <Scissors className="w-4 h-4" />}
                    <span>{copiedSingleTiny ? 'Short Link Copied!' : 'Copy Short Link'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card: Live Generated Preview & Shareable URL */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Clean Short Link Share Box */}
              <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Scissors className="w-4 h-4 text-amber-400" />
                    Short link (Client Ready)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Shortened
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Send this short, clean URL directly to your client via WhatsApp, SMS, or Email:
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-sm font-mono text-amber-300 font-bold break-all select-all flex items-center justify-between gap-2">
                  <span>{isSingleShortening ? 'Generating Short Link...' : (singleTinyUrl || currentGeneratedUrl)}</span>
                  <a
                    href={singleTinyUrl || currentGeneratedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white p-1 shrink-0"
                    title="Test Short Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={handleCopySingleTinyUrl}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow"
                  >
                    {copiedSingleTiny ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSingleTiny ? 'Short Link Copied!' : 'Copy Short Link to Clipboard'}</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    title="Copy Full Long Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic H1 & NAP SEO Verification Preview */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Dynamically Generated SEO Headline</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">H1 Target Headline:</span>
                    <p className="font-serif font-bold text-amber-300 text-sm mt-0.5">
                      {formData.primaryKeyword || '5-Star Professional Realtor'} in {formData.city || 'Your Target Market'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Verified NAP Citation:</span>
                    <p className="text-slate-200 mt-0.5">
                      <strong>Name:</strong> {formData.name || 'Brokerage Name'}<br />
                      <strong>Address:</strong> {formData.address || 'Office Address'}<br />
                      <strong>Phone:</strong> {formData.phone || 'Phone Number'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: REQUESTED CITY PRESETS */}
        {/* ========================================================================= */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Pre-Configured City Demonstrations</h2>
              <p className="text-xs text-slate-400">
                Click any preset to test the exact scenarios you requested (Paso Robles, Fresno, Santa Barbara, Waterloo, Kitchener).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {REALTOR_PRESETS.map((preset, idx) => {
                const isCurrent = realtorProfile.city === preset.city;
                const dynamicLink = generateDynamicUrl(preset);

                return (
                  <div
                    key={idx}
                    className={`rounded-3xl p-6 transition-all flex flex-col justify-between ${
                      isCurrent 
                        ? 'bg-amber-950/40 border-2 border-amber-500 shadow-xl shadow-amber-500/10' 
                        : 'bg-slate-900/80 border border-slate-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            <MapPin className="w-2.5 h-2.5" />
                            {preset.city}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1.5">{preset.name}</h3>
                          <p className="text-xs text-slate-400">{preset.agentName}</p>
                        </div>

                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                            Live Now
                          </span>
                        )}
                      </div>

                      {/* H1 Headline Preview */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 mb-4 text-xs">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase block">H1 Target:</span>
                        <p className="font-serif font-bold text-amber-300 mt-0.5">
                          {preset.primaryKeyword} in {preset.city}
                        </p>
                      </div>

                      {/* Info details */}
                      <div className="space-y-1.5 text-xs text-slate-300 mb-6">
                        <p className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{preset.address}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{preset.phone}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{preset.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => {
                          loadRealtorPreset(idx);
                          setCurrentPage('home');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Launch Demo</span>
                      </button>

                      <button
                        onClick={async () => {
                          const short = await shortenWithTinyUrl(dynamicLink);
                          navigator.clipboard.writeText(short);
                          showToast(`Copied Short Link for ${preset.name}!`);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        title="Copy Clean Short Link"
                      >
                        <Scissors className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: LOCAL SEO AUDIT PREVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'seo-preview' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Local SEO Technical & Metadata Audit</h2>
              <p className="text-xs text-slate-400">
                Verification of on-page SEO signals dynamically generated for {realtorProfile.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>H1 Local Keyword Matching</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  &lt;h1&gt;{realtorProfile.primaryKeyword || '5-Star Professional Realtor'} in {realtorProfile.city}&lt;/h1&gt;
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>NAP Consistency Rating</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  100% matched across Hero, Contact Section, Header Call Actions, and Footer Schema.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Conversion Channels</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct WhatsApp click-to-chat + AI Real Estate Assistant + VIP Tour Booking Modal.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
