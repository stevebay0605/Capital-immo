import { Link } from 'react-router-dom';
import { Home, Key, Building2, TrendingUp, ArrowRight } from 'lucide-react';
import { useServices } from '../hooks/useServices';

const iconMap: { [key: string]: React.ElementType } = {
  Home,
  Key,
  Building2,
  TrendingUp,
};

export default function ServicesSection() {
  const { services } = useServices();

  return (
    <section className="bg-[#0D354E] section-padding relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-2xl text-[#7A9E9F]">Nos expertises</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Nos services
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Une gamme complète de services immobiliers pour répondre à tous vos besoins, de l'achat à la gestion de votre patrimoine.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Home;
            return (
              <div
                key={service.id}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-[#7A9E9F] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.titre}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-[#7A9E9F] font-medium hover:text-white transition-colors"
                >
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#7A9E9F] text-white font-semibold rounded-lg hover:bg-[#7A9E9F]/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Découvrir tous nos services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
