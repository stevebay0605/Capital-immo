import { Link } from 'react-router-dom';
import { MapPin, Maximize, BedDouble, Bath, ArrowRight } from 'lucide-react';
import type { UiBien } from '../types/ui';
import { formatPrix } from '../utils/format';

interface CarteBienProps {
  bien: UiBien;
}

export default function CarteBien({ bien }: CarteBienProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md card-hover group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={bien.images[0]}
          alt={bien.titre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              bien.transaction === 'vente'
                ? 'bg-[#0D354E] text-white'
                : 'bg-[#7A9E9F] text-white'
            }`}
          >
            {bien.transaction === 'vente' ? 'VENTE' : 'LOCATION'}
          </span>
          {bien.statut === 'vendu' && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
              VENDU
            </span>
          )}
        </div>
        {/* Price overlay */}
        <div className="absolute bottom-4 right-4">
          <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg text-[#0D354E] font-bold shadow-lg">
            {formatPrix(bien.prix, bien.transaction)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0D354E] mb-2 line-clamp-1 group-hover:text-[#7A9E9F] transition-colors">
          {bien.titre}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{bien.quartier}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4 text-[#7A9E9F]" />
            <span>{bien.surface} m²</span>
          </div>
          {bien.chambres > 0 && (
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-[#7A9E9F]" />
              <span>{bien.chambres}</span>
            </div>
          )}
          {bien.salleDeBain > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-[#7A9E9F]" />
              <span>{bien.salleDeBain}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/biens/${bien.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#0D354E] text-[#0D354E] font-semibold rounded-lg hover:bg-[#0D354E] hover:text-white transition-all duration-300"
        >
          Voir le détail
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
