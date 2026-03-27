import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Maximize, BedDouble, Bath, Home, ArrowLeft, 
  Check, Phone, Mail, Share2, Heart, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getBien, getBiensSimilaires } from '../api/biens';
import { mapBienToUi } from '../api/mappers';
import type { UiBien } from '../types/ui';
import { useEntrepriseInfo } from '../hooks/useEntrepriseInfo';
import { formatPrix } from '../utils/format';
import CarteBien from '../components/CarteBien';
import WhatsAppButton from '../components/WhatsAppButton';

export default function BienDetail() {
  const { entreprise } = useEntrepriseInfo();
  const { id } = useParams<{ id: string }>();
  const [bien, setBien] = useState<UiBien | null>(null);
  const [biensSimilaires, setBiensSimilaires] = useState<UiBien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [bien?.id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBien(id);
        const mapped = mapBienToUi(data);
        if (isMounted) {
          setBien(mapped);
        }

        const similaires = await getBiensSimilaires(data.id);
        if (isMounted) {
          setBiensSimilaires(similaires.map(mapBienToUi));
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setBien(null);
          setBiensSimilaires([]);
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
  }, [id]);

  if (loading) {
    return (
      <main className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">Chargement du bien...</div>
      </main>
    );
  }

  if (!bien || error) {
    return (
      <main className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0D354E] mb-4">Bien non trouvé</h1>
          <p className="text-gray-600 mb-6">Le bien que vous recherchez n'existe pas ou a été retiré.</p>
          <Link to="/biens" className="btn-primary">
            Voir tous nos biens
          </Link>
        </div>
      </main>
    );
  }
  const whatsappMessage = `Bonjour, je suis intéressé par le bien "${bien.titre}" (Réf: ${bien.reference}). Pourriez-vous me donner plus d'informations ?`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % bien.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + bien.images.length) % bien.images.length);
  };

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      {/* WhatsApp Button */}
      <WhatsAppButton message={whatsappMessage} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-[#7A9E9F]">Accueil</Link>
            <span className="text-gray-400">/</span>
            <Link to="/biens" className="text-gray-500 hover:text-[#7A9E9F]">Nos biens</Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#0D354E] font-medium truncate">{bien.titre}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-2 relative h-80 lg:h-[500px] rounded-xl overflow-hidden group">
              <img
                src={bien.images[currentImageIndex]}
                alt={bien.titre}
                className="w-full h-full object-cover"
              />
              {/* Navigation arrows */}
              {bien.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#0D354E]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6 text-[#0D354E]" />
                  </button>
                </>
              )}
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                {currentImageIndex + 1} / {bien.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {bien.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-24 lg:w-full h-20 lg:h-[120px] rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-[#7A9E9F]'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${bien.titre} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      bien.transaction === 'vente'
                        ? 'bg-[#0D354E] text-white'
                        : 'bg-[#7A9E9F] text-white'
                    }`}>
                      {bien.transaction === 'vente' ? 'VENTE' : 'LOCATION'}
                    </span>
                    <span className="text-sm text-gray-500">Réf: {bien.reference}</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#0D354E]">
                    {bien.titre}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-lg border transition-colors ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-lg border border-gray-200 text-gray-400 hover:text-[#7A9E9F] transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5 text-[#7A9E9F]" />
                <span>{bien.quartier}, {bien.zone}</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-[#7A9E9F]">
                {formatPrix(bien.prix, bien.transaction)}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-[#0D354E] mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Maximize className="w-6 h-6 text-[#7A9E9F]" />
                  <div>
                    <p className="text-sm text-gray-500">Surface</p>
                    <p className="font-semibold text-[#0D354E]">{bien.surface} m²</p>
                  </div>
                </div>
                {bien.pieces > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Home className="w-6 h-6 text-[#7A9E9F]" />
                    <div>
                      <p className="text-sm text-gray-500">Pièces</p>
                      <p className="font-semibold text-[#0D354E]">{bien.pieces}</p>
                    </div>
                  </div>
                )}
                {bien.chambres > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <BedDouble className="w-6 h-6 text-[#7A9E9F]" />
                    <div>
                      <p className="text-sm text-gray-500">Chambres</p>
                      <p className="font-semibold text-[#0D354E]">{bien.chambres}</p>
                    </div>
                  </div>
                )}
                {bien.salleDeBain > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-6 h-6 text-[#7A9E9F]" />
                    <div>
                      <p className="text-sm text-gray-500">SDB</p>
                      <p className="font-semibold text-[#0D354E]">{bien.salleDeBain}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-[#0D354E] mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {bien.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0D354E] mb-4">Équipements et services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bien.caracteristiques.map((carac, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#7A9E9F]" />
                    <span className="text-gray-600">{carac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-[#0D354E] mb-4">
                Intéressé par ce bien ?
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Contactez-nous pour plus d'informations ou pour organiser une visite.
              </p>

              {/* Contact Buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${entreprise.telephone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#0D354E] text-white font-semibold rounded-lg hover:bg-[#0D354E]/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${entreprise.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#25D366]/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${entreprise.email}?subject=Intérêt pour le bien ${bien.reference}&body=${encodeURIComponent(whatsappMessage)}`}
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#0D354E] text-[#0D354E] font-semibold rounded-lg hover:bg-[#0D354E] hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Envoyer un email
                </a>
              </div>

              {/* Agent Info */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Votre contact</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#7A9E9F] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D354E]">Julio KIBONGUI</p>
                    <p className="text-sm text-gray-500">PDG - Capital Immo Group</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {biensSimilaires.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#0D354E] mb-6">Biens similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biensSimilaires.map((similarBien) => (
                <CarteBien key={similarBien.id} bien={similarBien} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <Link
          to="/biens"
          className="flex items-center gap-2 px-4 py-3 bg-white text-[#0D354E] font-medium rounded-lg shadow-lg hover:bg-[#0D354E] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux biens
        </Link>
      </div>
    </main>
  );
}

