import React, { useState, useEffect } from 'react';
import { Property, PropertyType, PropertyPurpose, PropertyStatus } from '../../types';
import { MASTER_AMENITIES, LUXURY_LOCATIONS } from '../../data/initialData';
import { X, Plus, Trash2, Upload, Sparkles, Building2, MapPin, DollarSign, Image } from 'lucide-react';

interface PropertyFormModalProps {
  property?: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (propertyData: Partial<Property>) => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  property,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Villa');
  const [purpose, setPurpose] = useState<PropertyPurpose>('Sale');
  const [status, setStatus] = useState<PropertyStatus>('Ready');
  const [price, setPrice] = useState(25000000);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  
  // Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dubai');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [zipCode, setZipCode] = useState('');
  const [lat, setLat] = useState(25.1124);
  const [lng, setLng] = useState(55.139);

  // Specs
  const [bedrooms, setBedrooms] = useState(5);
  const [bathrooms, setBathrooms] = useState(6);
  const [balcony, setBalcony] = useState(4);
  const [parking, setParking] = useState(6);
  const [area, setArea] = useState(12500);
  const [yearBuilt, setYearBuilt] = useState(2025);

  // Images & Amenities
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
  const [imagesText, setImagesText] = useState('');
  const [floorPlan, setFloorPlan] = useState('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80');
  const [virtualTourUrl, setVirtualTourUrl] = useState('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Sync state on property change
  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setShortDescription(property.shortDescription);
      setDescription(property.description);
      setPropertyType(property.propertyType);
      setPurpose(property.purpose);
      setStatus(property.status);
      setPrice(property.price);
      setDiscountPrice(property.discountPrice);
      setAddress(property.location.address);
      setCity(property.location.city);
      setState(property.location.state || '');
      setCountry(property.location.country);
      setZipCode(property.location.zipCode || '');
      setLat(property.location.coordinates.lat);
      setLng(property.location.coordinates.lng);
      setBedrooms(property.bedrooms);
      setBathrooms(property.bathrooms);
      setBalcony(property.balcony || 0);
      setParking(property.parking);
      setArea(property.area);
      setYearBuilt(property.yearBuilt);
      setThumbnail(property.thumbnail);
      setImagesText(property.images.join('\n'));
      setFloorPlan(property.floorPlan || '');
      setVirtualTourUrl(property.virtualTourUrl || '');
      setAmenities(property.amenities || []);
      setFeatured(property.featured);
      setIsPublished(property.isPublished);
    } else {
      // Reset defaults for new property
      setTitle('');
      setShortDescription('');
      setDescription('');
      setPropertyType('Villa');
      setPurpose('Sale');
      setStatus('Ready');
      setPrice(25000000);
      setDiscountPrice(undefined);
      setAddress('');
      setCity('Dubai');
      setState('');
      setCountry('United Arab Emirates');
      setZipCode('');
      setLat(25.1124);
      setLng(55.139);
      setBedrooms(5);
      setBathrooms(6);
      setBalcony(4);
      setParking(6);
      setArea(12500);
      setYearBuilt(2025);
      setThumbnail('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
      setImagesText('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80');
      setFloorPlan('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80');
      setVirtualTourUrl('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90');
      setAmenities(['Private Swimming Pool', 'Helipad Access', 'Smart Home Automation', 'Panoramic Views', 'Spa & Wellness Suite', 'Private Cinema']);
      setFeatured(true);
      setIsPublished(true);
    }
  }, [property, isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedImages = imagesText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload: Partial<Property> = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      shortDescription,
      description,
      propertyType,
      purpose,
      status,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      location: {
        address,
        city,
        state,
        country,
        zipCode,
        coordinates: { lat: Number(lat), lng: Number(lng) }
      },
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      balcony: Number(balcony),
      parking: Number(parking),
      area: Number(area),
      areaUnit: 'sq ft',
      yearBuilt: Number(yearBuilt),
      thumbnail: thumbnail || (parsedImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'),
      images: parsedImages.length > 0 ? parsedImages : [thumbnail],
      floorPlan,
      virtualTourUrl,
      amenities,
      featured,
      isPublished
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-serif font-bold text-white">
              {property ? 'Edit Sovereign Property' : 'List New Sovereign Estate'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              1. Title & Classification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Estate Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Grand Elysian Promontory Estate"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-500 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Architecture Category</label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-500 text-white"
                >
                  <option value="Villa">Waterfront Villa</option>
                  <option value="Penthouse">Sky Penthouse</option>
                  <option value="Mansion">Promontory Mansion</option>
                  <option value="Island">Private Island</option>
                  <option value="Estate">Historic Palazzo</option>
                  <option value="Chalet">Alpine Ski Chalet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Acquisition Purpose</label>
                <select
                  value={purpose}
                  onChange={e => setPurpose(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-500 text-white"
                >
                  <option value="Sale">Freehold Sale</option>
                  <option value="Rent">Exclusive Lease</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Construction / Title Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-amber-500 text-white"
                >
                  <option value="Ready">Ready to Move</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Exclusive">Off-Market Exclusive</option>
                  <option value="Sold">Archived / Sold</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Year Built</label>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={e => setYearBuilt(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              2. Valuation & Financial Terms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Official Valuation ($ USD) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Special Offering Price (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 22000000"
                  value={discountPrice || ''}
                  onChange={e => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              3. Prime Location & GPS Coordinates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. Frond G, Billionaires Bay"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">City / Enclave</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Postal / Zip</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">GPS Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={e => setLat(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">GPS Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={e => setLng(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              4. Architectural Dimensions
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={e => setBedrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={e => setBathrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Balcony</label>
                <input
                  type="number"
                  value={balcony}
                  onChange={e => setBalcony(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Parking / Garage</label>
                <input
                  type="number"
                  value={parking}
                  onChange={e => setParking(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Area (sq ft)</label>
                <input
                  type="number"
                  value={area}
                  onChange={e => setArea(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Media & Photos */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              5. High-Resolution Imagery & 3D Walkthrough
            </h4>
            <div>
              <label className="block text-slate-400 mb-1">Primary Thumbnail Image URL *</label>
              <input
                type="url"
                required
                value={thumbnail}
                onChange={e => setThumbnail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Gallery Image URLs (One URL per line)</label>
              <textarea
                rows={3}
                value={imagesText}
                onChange={e => setImagesText(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              6. Editorial Narrative
            </h4>
            <div>
              <label className="block text-slate-400 mb-1">Short Hook / Subtitle</label>
              <input
                type="text"
                placeholder="A triumph of contemporary minimalism on the exclusive fronds..."
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Full Architectural Narrative</label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white leading-relaxed"
              />
            </div>
          </div>

          {/* Amenities Multi-Check */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              7. Bespoke Amenities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
              {MASTER_AMENITIES.map(amenity => {
                const checked = amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition-colors ${
                      checked
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded accent-amber-500"
                    />
                    <span className="truncate">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="font-bold text-white">Feature in Hero & Top Curations</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="font-bold text-white">Publish Directly to Live Portfolio</span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:bg-amber-400"
            >
              {property ? 'Save Estate Modifications' : 'Create & Publish Estate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
