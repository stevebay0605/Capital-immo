import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Grid3X3, List, MapPin, X } from 'lucide-react';
import CarteBien from '../components/CarteBien';
import { getBiens, type BienQueryParams } from '../api/biens';
import { mapBienToUi } from '../api/mappers';
import { useBiensFilters } from '../hooks/useBiensFilters';
import type { UiBien } from '../types/ui';

export default function Biens() {
  const { filters } = useBiensFilters();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState('all');
  const [selectedZone, setSelectedZone] = useState('Toutes les zones');
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [surfaceMin, setSurfaceMin] = useState('');

  const [biens, setBiens] = useState<UiBien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo<BienQueryParams>(() => {
    const next: BienQueryParams = {};

    if (searchQuery) {
      next.search = searchQuery;
    }

    if (selectedType !== 'all') {
      next.type = selectedType as BienQueryParams['type'];
    }

    if (selectedTransaction !== 'all') {
      next.transaction = selectedTransaction as BienQueryParams['transaction'];
    }

    if (selectedZone !== 'Toutes les zones') {
      next.zone = selectedZone;
    }

    if (prixMin) {
      next.prix_min = prixMin;
    }

    if (prixMax) {
      next.prix_max = prixMax;
    }

    if (surfaceMin) {
      next.surface_min = surfaceMin;
    }

    return next;
  }, [searchQuery, selectedType, selectedTransaction, selectedZone, prixMin, prixMax, surfaceMin]);

  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBiens(params);
        if (isMounted) {
          setBiens(data.map(mapBienToUi));
        }
      } catch {
        if (isMounted) {
          setError('Impossible de charger les biens pour le moment.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [paramsKey]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedTransaction('all');
    setSelectedZone('Toutes les zones');
    setPrixMin('');
    setPrixMax('');
    setSurfaceMin('');
  };

  const hasActiveFilters = searchQuery || selectedType !== 'all' || selectedTransaction !== 'all' || 
    selectedZone !== 'Toutes les zones' || prixMin || prixMax || surfaceMin;

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0D354E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Notre catalogue de biens
          </h1>
          <p className="text-white/70 max-w-2xl">
            Découvrez notre sélection de biens immobiliers à Brazzaville et environs. 
            Utilisez les filtres pour trouver le bien qui correspond à vos critères.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, quartier..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] focus:border-transparent"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] whitespace-nowrap"
              >
                {filters.types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedTransaction}
                onChange={(e) => setSelectedTransaction(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] whitespace-nowrap"
              >
                {filters.transactions.map((transaction) => (
                  <option key={transaction.value} value={transaction.value}>
                    {transaction.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F] whitespace-nowrap"
              >
                {filters.zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Toggle & View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                  showFilters
                    ? 'bg-[#7A9E9F] text-white border-[#7A9E9F]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filtres avancés</span>
              </button>

              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-[#0D354E] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-[#0D354E] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Prix minimum (millions FCFA)
                </label>
                <input
                  type="number"
                  value={prixMin}
                  onChange={(e) => setPrixMin(e.target.value)}
                  placeholder="Ex: 50"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Prix maximum (millions FCFA)
                </label>
                <input
                  type="number"
                  value={prixMax}
                  onChange={(e) => setPrixMax(e.target.value)}
                  placeholder="Ex: 500"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Surface minimum (m²)
                </label>
                <input
                  type="number"
                  value={surfaceMin}
                  onChange={(e) => setSurfaceMin(e.target.value)}
                  placeholder="Ex: 100"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]"
                />
              </div>
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-[#0D354E]">{biens.length}</span> bien
            {biens.length > 1 ? 's' : ''} trouvé
            {biens.length > 1 ? 's' : ''}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-[#7A9E9F] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-12">
            Chargement des biens...
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-red-500 py-12">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Grid/List */}
            {biens.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {biens.map((bien) => (
                  <CarteBien key={bien.id} bien={bien} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucun bien trouvé
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Aucun bien ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou de lancer une nouvelle recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-3 bg-[#7A9E9F] text-white font-semibold rounded-lg hover:bg-[#7A9E9F]/90 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
