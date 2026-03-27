export type BienType = 'maison' | 'villa' | 'appartement' | 'local' | 'terrain';
export type BienTransaction = 'vente' | 'location';
export type BienStatut = 'disponible' | 'vendu' | 'reserve';

export interface ApiBienImage {
  id: number;
  bien_id: number;
  url: string;
  ordre: number;
  legende?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiBien {
  id: number;
  titre: string;
  slug: string;
  description: string;
  prix: number;
  surface: number;
  pieces: number;
  chambres: number;
  salle_de_bain: number;
  etage?: number | null;
  type: BienType;
  transaction: BienTransaction;
  zone: string;
  quartier: string;
  reference: string;
  statut: BienStatut;
  en_vedette: boolean;
  caracteristiques?: string[] | null;
  user_id?: number | null;
  vue_count?: number;
  images?: ApiBienImage[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiService {
  id: number;
  titre: string;
  slug: string;
  description: string;
  description_longue: string;
  icon: string;
  image?: string | null;
  avantages: string[];
  cta: string;
  ordre: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiTemoignage {
  id: number;
  nom: string;
  initiale?: string | null;
  role: string;
  message: string;
  avatar?: string | null;
  note: number;
  is_active: boolean;
  ordre: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiMembreEquipe {
  id: number;
  prenom: string;
  nom: string;
  poste: string;
  email?: string | null;
  telephone?: string | null;
  photo?: string | null;
  description?: string | null;
  ordre: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiContact {
  id: number;
  nom: string;
  telephone: string;
  email?: string | null;
  objet: string;
  message: string;
  bien_id?: number | null;
  reference_bien?: string | null;
  is_read: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  bien?: ApiBien | null;
}

export interface ApiConfiguration {
  id: number;
  key: string;
  value: string | null;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array';
  group: string;
  label: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiEntrepriseValeur {
  titre: string;
  description: string;
  icon: string;
}

export interface ApiEntrepriseInfo {
  nom: string;
  slogan: string;
  adresse: string;
  telephone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  facebook_url: string;
  description: string;
  histoire: string;
  mission: string;
  date_creation: number;
  clients_satisfaits: number;
  hero_image_url: string;
  about_image_url: string;
  valeurs: ApiEntrepriseValeur[];
  horaires: Record<string, string>;
  coordonnees: {
    lat: number;
    lng: number;
  };
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiLoginResponse {
  user: ApiUser;
  token: string;
}

export interface ApiPaginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiBiensFilters {
  zones: string[];
  quartiers: string[];
  types: Array<{ value: BienType; label: string }>;
  transactions: Array<{ value: BienTransaction; label: string }>;
}

export interface ApiBiensStats {
  total: number;
  disponibles: number;
  vendus: number;
  reserves: number;
  en_vedette: number;
  par_type: Record<BienType, number>;
  par_transaction: Record<BienTransaction, number>;
  vues_total: number;
}

export interface ApiContactsStats {
  total: number;
  non_lus: number;
  lus?: number;
  par_objet?: Record<string, number>;
  ce_mois: number;
}

export interface ApiDashboardStats {
  biens: {
    total: number;
    disponibles: number;
    vendus: number;
    reserves: number;
    en_vedette: number;
    vues_total: number;
  };
  contacts: {
    total: number;
    non_lus: number;
    ce_mois: number;
  };
  temoignages: {
    total: number;
    actifs: number;
  };
  equipe: {
    total: number;
    actifs: number;
  };
  services: {
    total: number;
    actifs: number;
  };
}

export interface ApiDashboardActivity {
  derniers_biens: ApiBien[];
  derniers_contacts: ApiContact[];
  biens_populaires: ApiBien[];
}

export interface ApiDashboardCharts {
  biens_par_mois: Array<{ mois: string; total: number }>;
  contacts_par_mois: Array<{ mois: string; total: number }>;
  biens_par_type: Record<BienType, number>;
  biens_par_transaction: Record<BienTransaction, number>;
}
