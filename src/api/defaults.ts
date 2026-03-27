import type { UiBienFilters, UiEntrepriseInfo } from '../types/ui';

export const DEFAULT_BIEN_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200';

export const defaultEntrepriseInfo: UiEntrepriseInfo = {
  nom: 'Capital Immo Group',
  slogan: "Plus qu'un bien immobilier, nous trouvons le lieu où commence votre histoire.",
  adresse: 'Rue Monseigneur Biéchy 2015, Brazzaville, République du Congo',
  telephone: '+242 04 411 3436',
  whatsapp: '+242 04 411 3436',
  email: 'contact@capitalimogroup.com',
  facebook: '@capitalimogroup01',
  facebookUrl: 'https://facebook.com/capitalimogroup01',
  description:
    "Capital Immo Group est une agence immobilière de référence à Brazzaville, spécialisée dans la vente, la location et la gestion de biens immobiliers.",
  histoire:
    "Fondée en 2011 par Julio KIBONGUI, Capital Immo Group est née d'une vision : professionnaliser le secteur immobilier en République du Congo et offrir aux clients un service à la hauteur de leurs attentes.",
  mission:
    "Accompagner nos clients avec professionnalisme et intégrité dans la réalisation de leurs projets immobiliers, en leur offrant un service personnalisé et des solutions adaptées à leurs besoins.",
  dateCreation: 2011,
  clientsSatisfaits: 500,
  heroImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
  aboutImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  valeurs: [
    {
      titre: 'Confiance',
      description:
        "La transparence et l'honnêteté sont au cœur de chaque relation que nous établissons avec nos clients.",
      icon: 'Shield',
    },
    {
      titre: 'Proximité',
      description:
        "Nous connaissons intimement le marché immobilier congolais et maintenons une relation personnalisée avec chaque client.",
      icon: 'Heart',
    },
    {
      titre: 'Excellence',
      description:
        "Nous visons l'excellence dans chaque service rendu, de la première prise de contact à la finalisation de la transaction.",
      icon: 'Award',
    },
    {
      titre: 'Transparence',
      description:
        "Nos honoraires sont clairs, nos processus sont expliqués, et nous communiquons régulièrement sur l'avancement de votre dossier.",
      icon: 'Eye',
    },
  ],
  horaires: {
    lundi: '08:00 - 17:00',
    mardi: '08:00 - 17:00',
    mercredi: '08:00 - 17:00',
    jeudi: '08:00 - 17:00',
    vendredi: '08:00 - 17:00',
    samedi: '09:00 - 13:00',
    dimanche: 'Fermé',
  },
  coordonnees: {
    lat: -4.2634,
    lng: 15.2429,
  },
};

export const defaultBiensFilters: UiBienFilters = {
  zones: [
    'Toutes les zones',
    'Centre-ville',
    'Périphérie',
    'Ouenzé',
    'Poto-Poto',
    'Bacongo',
    'Mfilou',
    'Talisman',
    'Montagne Sainte',
  ],
  types: [
    { value: 'all', label: 'Tous les types' },
    { value: 'maison', label: 'Maison' },
    { value: 'villa', label: 'Villa' },
    { value: 'appartement', label: 'Appartement' },
    { value: 'local', label: 'Local commercial' },
    { value: 'terrain', label: 'Terrain' },
  ],
  transactions: [
    { value: 'all', label: 'Toutes transactions' },
    { value: 'vente', label: 'Vente' },
    { value: 'location', label: 'Location' },
  ],
};
