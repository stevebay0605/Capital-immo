import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { useEntrepriseInfo } from '../hooks/useEntrepriseInfo';

export default function CTASection() {
  const { entreprise } = useEntrepriseInfo();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920"
          alt="Modern building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D354E]/95 to-[#0D354E]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Text */}
          <div className="text-center lg:text-left">
            <span className="font-script text-2xl text-[#7A9E9F]">Prêt à démarrer ?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
              Besoin d'une estimation gratuite ?
            </h2>
            <p className="text-white/80 max-w-xl">
              Contactez-nous dès maintenant pour discuter de votre projet immobilier. 
              Notre équipe d'experts est à votre écoute pour vous accompagner.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#7A9E9F] text-white font-semibold rounded-lg hover:bg-[#7A9E9F]/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Nous contacter
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${entreprise.telephone.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#0D354E] transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              {entreprise.telephone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
