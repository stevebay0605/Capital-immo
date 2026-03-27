import type { BienStatut, BienTransaction, BienType } from '../api/types';

export interface UiBien {
  id: string;
  titre: string;
  description: string;
  prix: number;
  surface: number;
  pieces: number;
  chambres: number;
  salleDeBain: number;
  etage?: number | null;
  type: BienType;
  transaction: BienTransaction;
  zone: string;
  quartier: string;
  images: string[];
  reference: string;
  statut: BienStatut;
  enVedette: boolean;
  caracteristiques: string[];
}

export interface UiService {
  id: string;
  titre: string;
  description: string;
  descriptionLongue: string;
  icon: string;
  image: string;
  avantages: string[];
  cta: string;
  isActive: boolean;
}

export interface UiTemoignage {
  id: string;
  nom: string;
  initiale: string;
  role: string;
  message: string;
  avatar: string;
  note: number;
  isActive: boolean;
}

export interface UiMembreEquipe {
  id: string;
  prenom: string;
  nom: string;
  poste: string;
  email: string;
  telephone: string;
  photo: string;
  description: string;
  isActive: boolean;
}

export interface UiEntrepriseValeur {
  titre: string;
  description: string;
  icon: string;
}

export interface UiEntrepriseInfo {
  nom: string;
  slogan: string;
  adresse: string;
  telephone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  facebookUrl: string;
  description: string;
  histoire: string;
  mission: string;
  dateCreation: number;
  clientsSatisfaits: number;
  heroImageUrl: string;
  aboutImageUrl: string;
  valeurs: UiEntrepriseValeur[];
  horaires: Record<string, string>;
  coordonnees: {
    lat: number;
    lng: number;
  };
}

export interface UiBienFilters {
  zones: string[];
  types: Array<{ value: string; label: string }>;
  transactions: Array<{ value: string; label: string }>;
}
