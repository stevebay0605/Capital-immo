import { Link } from 'react-router-dom';
import { Home, Key, Building2, TrendingUp, ArrowRight, Check, Phone } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { useEntrepriseInfo } from '../hooks/useEntrepriseInfo';

const iconMap: { [key: string]: React.ElementType } = {
  Home,
  Key,
  Building2,
  TrendingUp,
};

export default function Services() {
  const { services } = useServices();
  const { entreprise } = useEntrepriseInfo();

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative py-20 bg-[#0D354E]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-60 h-60 border border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <span className="font-script text-2xl text-[#7A9E9F]">Nos prestations</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
              Nos services immobiliers
            </h1>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              Une gamme complète de services pour répondre à tous vos besoins immobiliers, 
              de l'achat à la gestion de votre patrimoine.
            </p>
          </div>
        </div>
      </div>

      {/* Services Detail */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Home;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Image */}
                  <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={service.image}
                        alt={service.titre}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D354E]/50 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <div className="w-16 h-16 bg-[#7A9E9F] rounded-xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <span className="text-[#7A9E9F] font-medium text-sm uppercase tracking-wider">
                      Service {index + 1}
                    </span>
                    <h2 className="text-3xl font-bold text-[#0D354E] mt-2 mb-4">
                      {service.titre}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.descriptionLongue}
                    </p>

                    {/* Avantages */}
                    <div className="space-y-3 mb-8">
                      {service.avantages.map((avantage, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#7A9E9F]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-[#7A9E9F]" />
                          </div>
                          <span className="text-gray-600">{avantage}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D354E] text-white font-semibold rounded-lg hover:bg-[#0D354E]/90 transition-all duration-300 hover:shadow-lg"
                    >
                      {service.cta}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#7A9E9F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-4">
                Besoin d'une estimation gratuite ?
              </h2>
              <p className="text-white/80 max-w-xl">
                Contactez-nous dès maintenant pour discuter de votre projet. 
                Notre équipe d'experts est à votre écoute.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0D354E] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Nous contacter
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`tel:${entreprise.telephone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#7A9E9F] transition-colors"
              >
                <Phone className="w-5 h-5" />
                {entreprise.telephone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-script text-2xl text-[#7A9E9F]">Comment ça marche</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D354E] mt-2">
              Notre processus
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Un accompagnement personnalisé à chaque étape de votre projet immobilier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Premier contact',
                description: 'Nous prenons le temps de comprendre vos besoins et vos objectifs.',
              },
              {
                step: '02',
                title: 'Recherche personnalisée',
                description: 'Nous sélectionnons les biens qui correspondent à vos critères.',
              },
              {
                step: '03',
                title: 'Visites accompagnées',
                description: 'Nous organisons et accompagnons vos visites de biens.',
              },
              {
                step: '04',
                title: 'Finalisation',
                description: 'Nous vous accompagnons jusqu\'à la signature et au-delà.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-20 h-20 bg-[#7A9E9F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#7A9E9F]">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0D354E] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
