import type {
  ApiBien,
  ApiBiensFilters,
  ApiEntrepriseInfo,
  ApiMembreEquipe,
  ApiService,
  ApiTemoignage,
} from './types';
import type {
  UiBien,
  UiBienFilters,
  UiEntrepriseInfo,
  UiMembreEquipe,
  UiService,
  UiTemoignage,
} from '../types/ui';
import { DEFAULT_AVATAR, DEFAULT_BIEN_IMAGE, defaultBiensFilters, defaultEntrepriseInfo } from './defaults';

const uniq = <T,>(items: T[]) => Array.from(new Set(items));

export const mapBienToUi = (bien: ApiBien): UiBien => {
  const images = (bien.images ?? [])
    .map((image) => image.url)
    .filter(Boolean);

  return {
    id: String(bien.id),
    titre: bien.titre,
    description: bien.description,
    prix: bien.prix,
    surface: bien.surface,
    pieces: bien.pieces ?? 0,
    chambres: bien.chambres ?? 0,
    salleDeBain: bien.salle_de_bain ?? 0,
    etage: bien.etage ?? null,
    type: bien.type,
    transaction: bien.transaction,
    zone: bien.zone,
    quartier: bien.quartier,
    images: images.length > 0 ? images : [DEFAULT_BIEN_IMAGE],
    reference: bien.reference,
    statut: bien.statut,
    enVedette: bien.en_vedette,
    caracteristiques: bien.caracteristiques ?? [],
  };
};

export const mapServiceToUi = (service: ApiService): UiService => ({
  id: String(service.id),
  titre: service.titre,
  description: service.description,
  descriptionLongue: service.description_longue,
  icon: service.icon,
  image: service.image ?? DEFAULT_BIEN_IMAGE,
  avantages: service.avantages ?? [],
  cta: service.cta,
  isActive: service.is_active,
});

export const mapTemoignageToUi = (temoignage: ApiTemoignage): UiTemoignage => ({
  id: String(temoignage.id),
  nom: temoignage.nom,
  initiale: temoignage.initiale ?? '',
  role: temoignage.role,
  message: temoignage.message,
  avatar: temoignage.avatar ?? DEFAULT_AVATAR,
  note: temoignage.note,
  isActive: temoignage.is_active,
});

export const mapMembreEquipeToUi = (membre: ApiMembreEquipe): UiMembreEquipe => ({
  id: String(membre.id),
  prenom: membre.prenom,
  nom: membre.nom,
  poste: membre.poste,
  email: membre.email ?? '',
  telephone: membre.telephone ?? '',
  photo: membre.photo ?? DEFAULT_AVATAR,
  description: membre.description ?? '',
  isActive: membre.is_active,
});

export const mapEntrepriseToUi = (entreprise: ApiEntrepriseInfo): UiEntrepriseInfo => ({
  nom: entreprise.nom ?? defaultEntrepriseInfo.nom,
  slogan: entreprise.slogan ?? defaultEntrepriseInfo.slogan,
  adresse: entreprise.adresse ?? defaultEntrepriseInfo.adresse,
  telephone: entreprise.telephone ?? defaultEntrepriseInfo.telephone,
  whatsapp: entreprise.whatsapp ?? defaultEntrepriseInfo.whatsapp,
  email: entreprise.email ?? defaultEntrepriseInfo.email,
  facebook: entreprise.facebook ?? defaultEntrepriseInfo.facebook,
  facebookUrl: entreprise.facebook_url ?? defaultEntrepriseInfo.facebookUrl,
  description: entreprise.description ?? defaultEntrepriseInfo.description,
  histoire: entreprise.histoire ?? defaultEntrepriseInfo.histoire,
  mission: entreprise.mission ?? defaultEntrepriseInfo.mission,
  dateCreation: entreprise.date_creation ?? defaultEntrepriseInfo.dateCreation,
  clientsSatisfaits: entreprise.clients_satisfaits ?? defaultEntrepriseInfo.clientsSatisfaits,
  heroImageUrl: entreprise.hero_image_url ?? defaultEntrepriseInfo.heroImageUrl,
  aboutImageUrl: entreprise.about_image_url ?? defaultEntrepriseInfo.aboutImageUrl,
  valeurs: entreprise.valeurs ?? defaultEntrepriseInfo.valeurs,
  horaires: entreprise.horaires ?? defaultEntrepriseInfo.horaires,
  coordonnees: entreprise.coordonnees ?? defaultEntrepriseInfo.coordonnees,
});

export const mapBiensFiltersToUi = (filters: ApiBiensFilters): UiBienFilters => {
  const zones = uniq([...(filters.zones ?? []), ...(filters.quartiers ?? [])]);
  return {
    zones: ['Toutes les zones', ...zones],
    types: [{ value: 'all', label: 'Tous les types' }, ...(filters.types ?? [])],
    transactions: [
      { value: 'all', label: 'Toutes transactions' },
      ...(filters.transactions ?? []),
    ],
  };
};

export const fallbackBiensFilters = defaultBiensFilters;
