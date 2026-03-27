import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Home, DollarSign, ArrowRight, Building2, Trees } from 'lucide-react';
import { useBiensFilters } from '../hooks/useBiensFilters';

export default function Hero() {
  const { filters } = useBiensFilters();
  const [activeTab, setActiveTab] = useState<'acheter' | 'louer' | 'terrain' | 'commercial'>('acheter');
  const [selectedZone, setSelectedZone] = useState('Toutes les zones');
  const [selectedType, setSelectedType] = useState('all');
  const [budget, setBudget] = useState('');

  const tabs = [
    { id: 'acheter', label: 'Acheter', icon: Home },
    { id: 'louer', label: 'Louer', icon: Building2 },
    { id: 'terrain', label: 'Terrain', icon: Trees },
    { id: 'commercial', label: 'Commercial', icon: DollarSign },
  ] as const;

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
          alt="Luxury home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D354E]/80 via-[#0D354E]/60 to-[#0D354E]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Script Title */}
            <h1 className="font-script text-4xl md:text-5xl lg:text-6xl text-white mb-4 fade-in-up">
              Plus qu'un bien immobilier,
            </h1>
            <h2 className="font-script text-3xl md:text-4xl lg:text-5xl text-[#7A9E9F] mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
              nous trouvons le lieu où commence votre histoire.
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.4s' }}>
              Votre partenaire de confiance en immobilier au Congo.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link
              to="/biens"
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              Voir nos biens
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
            >
              Nous contacter
            </Link>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden fade-in-up" style={{ animationDelay: '0.8s' }}>
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#0D354E] text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Localisation
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent appearance-none"
                    >
                      {filters.zones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Type de bien
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent appearance-none"
                    >
                      {filters.types.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Budget max
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Ex: 100 000 000"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Link
                    to={`/biens?type=${activeTab}&zone=${selectedZone}&bien=${selectedType}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#0D354E] text-white font-semibold rounded-lg hover:bg-[#0D354E]/90 transition-all duration-300 hover:shadow-lg"
                  >
                    <Search className="w-5 h-5" />
                    Rechercher
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            fill="#7A9E9F"
            d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
