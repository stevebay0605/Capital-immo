import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useTemoignages } from '../hooks/useTemoignages';

export default function Temoignages() {
  const { temoignages } = useTemoignages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || temoignages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % temoignages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, temoignages.length]);

  const goToPrevious = () => {
    if (temoignages.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + temoignages.length) % temoignages.length);
  };

  const goToNext = () => {
    if (temoignages.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % temoignages.length);
  };

  const visibleTemoignages =
    temoignages.length > 0
      ? [
          temoignages[currentIndex],
          temoignages[(currentIndex + 1) % temoignages.length],
          temoignages[(currentIndex + 2) % temoignages.length],
        ]
      : [];

  return (
    <section className="bg-[#7A9E9F]/10 section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-script text-2xl text-[#7A9E9F]">Ils nous font confiance</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D354E] mt-2">
            Témoignages clients
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Découvrez ce que nos clients disent de leur expérience avec Capital Immo Group.
          </p>
        </div>

        {/* Carousel */}
        {temoignages.length === 0 ? (
          <div className="text-center text-gray-500">
            Aucun témoignage disponible pour le moment.
          </div>
        ) : (
          <div className="relative">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTemoignages.map((temoignage, index) => (
              <div
                key={`${temoignage.id}-${index}`}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-[#7A9E9F]/20 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < temoignage.note
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Message */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  "{temoignage.message}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={temoignage.avatar}
                    alt={temoignage.nom}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-[#0D354E]">{temoignage.nom}</h4>
                    <p className="text-sm text-gray-500">{temoignage.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-[#0D354E] hover:bg-[#0D354E] hover:text-white transition-colors"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {temoignages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#7A9E9F] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-[#0D354E] hover:bg-[#0D354E] hover:text-white transition-colors"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
