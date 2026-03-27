import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, ChevronRight } from 'lucide-react';
import { useEntrepriseInfo } from '../hooks/useEntrepriseInfo';
import { staticAssets } from '@/assets';

const quickLinks = [
  { path: '/', label: 'Accueil' },
  { path: '/biens', label: 'Nos biens' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
];

const servicesLinks = [
  { path: '/services', label: 'Vente de biens' },
  { path: '/services', label: 'Location' },
  { path: '/services', label: 'Gestion locative' },
  { path: '/services', label: 'Accompagnement patrimonial' },
];

export default function Footer() {
  const { entreprise } = useEntrepriseInfo();

  return (
    <footer className="bg-[#0D354E] text-white">
      {/* Wave decoration */}
      <div className="relative h-16 overflow-hidden">
        <svg
          viewBox="0 0 1440 100"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#7A9E9F"
            d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"
          />
        </svg>
      </div>

      <div className="bg-[#0D354E] pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-flex mb-6">
                <img
                  src={staticAssets.logo}
                  alt="Capital Immo Group"
                  className="h-[4.5rem] w-auto object-contain"
                />
              </Link>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {entreprise.slogan}
              </p>
              <div className="space-y-3">
                <a
                  href={`tel:${entreprise.telephone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-white/70 hover:text-[#7A9E9F] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{entreprise.telephone}</span>
                </a>
                <a
                  href={`mailto:${entreprise.email}`}
                  className="flex items-center gap-3 text-white/70 hover:text-[#7A9E9F] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{entreprise.email}</span>
                </a>
                <div className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span className="text-sm">{entreprise.adresse}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Liens rapides</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-white/70 hover:text-[#7A9E9F] transition-colors text-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Nos services</h4>
              <ul className="space-y-3">
                {servicesLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-white/70 hover:text-[#7A9E9F] transition-colors text-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Horaires d'ouverture</h4>
              <div className="space-y-2">
                {Object.entries(entreprise.horaires).map(([jour, horaire]) => (
                  <div key={jour} className="flex items-center justify-between text-sm">
                    <span className="text-white/70 capitalize">{jour}</span>
                    <span className={horaire === 'Fermé' ? 'text-red-400' : 'text-white/90'}>
                      {horaire}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a
                  href={entreprise.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#7A9E9F]/20 text-[#7A9E9F] rounded-lg hover:bg-[#7A9E9F]/30 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-sm">{entreprise.facebook}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {entreprise.nom}. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link to="/" className="hover:text-[#7A9E9F] transition-colors">
                Mentions légales
              </Link>
              <Link to="/" className="hover:text-[#7A9E9F] transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
