import { Shield, Heart, Award, Eye, Calendar, Target } from 'lucide-react';
import { useEntrepriseInfo } from '../hooks/useEntrepriseInfo';
import { useEquipe } from '../hooks/useEquipe';
import ChiffresCles from '../sections/ChiffresCles';
import Temoignages from '../sections/Temoignages';

const iconMap: { [key: string]: React.ElementType } = {
  Shield,
  Heart,
  Award,
  Eye,
};

export default function About() {
  const { entreprise } = useEntrepriseInfo();
  const { equipe } = useEquipe();
  const valeurs = entreprise.valeurs ?? [];
  const experience = new Date().getFullYear() - entreprise.dateCreation;

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative py-20 bg-[#0D354E]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <span className="font-script text-2xl text-[#7A9E9F]">Qui sommes-nous</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
              À propos de Capital Immo Group
            </h1>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              {entreprise.slogan}
            </p>
          </div>
        </div>
      </div>

      {/* History & Mission */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                  alt="Capital Immo Group"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Experience badge */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#7A9E9F] rounded-2xl flex flex-col items-center justify-center text-white shadow-lg">
                <Calendar className="w-8 h-8 mb-1" />
                <span className="text-3xl font-bold">{experience}</span>
                <span className="text-sm">ans d'expérience</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="font-script text-xl text-[#7A9E9F]">Notre histoire</span>
              <h2 className="text-3xl font-bold text-[#0D354E] mt-2 mb-4">
                Une agence de référence à Brazzaville
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {entreprise.histoire}
              </p>
              <div className="flex items-start gap-4 p-4 bg-[#7A9E9F]/10 rounded-xl">
                <Target className="w-8 h-8 text-[#7A9E9F] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#0D354E] mb-1">Notre mission</h3>
                  <p className="text-gray-600 text-sm">{entreprise.mission}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#7A9E9F]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-script text-2xl text-[#7A9E9F]">Ce qui nous guide</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D354E] mt-2">
              Nos valeurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map((valeur) => {
              const IconComponent = iconMap[valeur.icon] || Shield;
              return (
                <div
                  key={valeur.titre}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-[#7A9E9F]/10 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-[#7A9E9F]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D354E] mb-3">
                    {valeur.titre}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {valeur.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-script text-2xl text-[#7A9E9F]">Notre équipe</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D354E] mt-2">
              Les experts à votre service
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Une équipe passionnée et expérimentée, dédiée à la réussite de vos projets immobiliers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipe.map((membre) => (
              <div
                key={membre.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={membre.photo}
                    alt={`${membre.prenom} ${membre.nom}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#0D354E]">
                    {membre.prenom} {membre.nom}
                  </h3>
                  <p className="text-[#7A9E9F] text-sm font-medium mb-3">
                    {membre.poste}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {membre.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={`tel:${membre.telephone.replace(/\s/g, '')}`}
                      className="text-sm text-[#7A9E9F] hover:text-[#0D354E] transition-colors"
                    >
                      {membre.telephone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <ChiffresCles />

      {/* Testimonials */}
      <Temoignages />
    </main>
  );
}
