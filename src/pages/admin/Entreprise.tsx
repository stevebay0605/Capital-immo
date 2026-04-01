import { useEffect, useState } from 'react';
import { Building2, Clock3, MapPin, Plus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PageHeader from '@/components/admin/PageHeader';
import { getEntreprise, updateEntreprise, type UpdateEntreprisePayload } from '../../api/entreprise';
import type { ApiEntrepriseInfo } from '../../api/types';

type EntrepriseHoraire = {
  jour: string;
  horaires: string;
};

type EntrepriseValeurForm = {
  titre: string;
  description: string;
  icon: string;
};

type EntrepriseFormState = {
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
  date_creation: number | '';
  clients_satisfaits: number | '';
  hero_image_url: string;
  about_image_url: string;
  horaires: EntrepriseHoraire[];
  coordonnees: {
    lat: string;
    lng: string;
  };
  valeurs: EntrepriseValeurForm[];
};

const defaultHoraires = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const buildFormState = (data: ApiEntrepriseInfo | null): EntrepriseFormState => ({
  nom: data?.nom ?? '',
  slogan: data?.slogan ?? '',
  adresse: data?.adresse ?? '',
  telephone: data?.telephone ?? '',
  whatsapp: data?.whatsapp ?? '',
  email: data?.email ?? '',
  facebook: data?.facebook ?? '',
  facebook_url: data?.facebook_url ?? '',
  description: data?.description ?? '',
  histoire: data?.histoire ?? '',
  mission: data?.mission ?? '',
  date_creation: data?.date_creation ?? '',
  clients_satisfaits: data?.clients_satisfaits ?? '',
  hero_image_url: data?.hero_image_url ?? '',
  about_image_url: data?.about_image_url ?? '',
  horaires:
    data && Object.keys(data.horaires ?? {}).length > 0
      ? Object.entries(data.horaires).map(([jour, horaires]) => ({ jour, horaires }))
      : defaultHoraires.map((jour) => ({ jour, horaires: '' })),
  coordonnees: {
    lat: data?.coordonnees?.lat !== undefined ? String(data.coordonnees.lat) : '',
    lng: data?.coordonnees?.lng !== undefined ? String(data.coordonnees.lng) : '',
  },
  valeurs:
    data?.valeurs?.length
      ? data.valeurs.map((valeur) => ({
          titre: valeur.titre,
          description: valeur.description,
          icon: valeur.icon,
        }))
      : [{ titre: '', description: '', icon: 'Star' }],
});

export default function AdminEntreprise() {
  const [form, setForm] = useState<EntrepriseFormState>(buildFormState(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getEntreprise();
        if (isMounted) {
          setForm(buildFormState(data));
        }
      } catch {
        if (isMounted) {
          toast.error('Une erreur est survenue');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = <K extends keyof EntrepriseFormState>(key: K, value: EntrepriseFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateHoraire = (index: number, patch: Partial<EntrepriseHoraire>) => {
    setForm((prev) => ({
      ...prev,
      horaires: prev.horaires.map((horaire, currentIndex) =>
        currentIndex === index ? { ...horaire, ...patch } : horaire
      ),
    }));
  };

  const updateValeur = (index: number, patch: Partial<EntrepriseValeurForm>) => {
    setForm((prev) => ({
      ...prev,
      valeurs: prev.valeurs.map((valeur, currentIndex) =>
        currentIndex === index ? { ...valeur, ...patch } : valeur
      ),
    }));
  };

  const addValeur = () => {
    setForm((prev) => ({
      ...prev,
      valeurs: [...prev.valeurs, { titre: '', description: '', icon: 'Star' }],
    }));
  };

  const removeValeur = (index: number) => {
    setForm((prev) => ({
      ...prev,
      valeurs: prev.valeurs.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload: UpdateEntreprisePayload = {
        nom: form.nom || undefined,
        slogan: form.slogan || undefined,
        adresse: form.adresse || undefined,
        telephone: form.telephone || undefined,
        whatsapp: form.whatsapp || undefined,
        email: form.email || undefined,
        facebook: form.facebook || undefined,
        facebook_url: form.facebook_url || undefined,
        description: form.description || undefined,
        histoire: form.histoire || undefined,
        mission: form.mission || undefined,
        date_creation: form.date_creation === '' ? undefined : Number(form.date_creation),
        clients_satisfaits:
          form.clients_satisfaits === '' ? undefined : Number(form.clients_satisfaits),
        hero_image_url: form.hero_image_url || undefined,
        about_image_url: form.about_image_url || undefined,
        horaires: Object.fromEntries(
          form.horaires
            .filter((horaire) => horaire.jour.trim() && horaire.horaires.trim())
            .map((horaire) => [horaire.jour.trim(), horaire.horaires.trim()])
        ),
        coordonnees:
          form.coordonnees.lat.trim() || form.coordonnees.lng.trim()
            ? {
                lat: Number(form.coordonnees.lat || 0),
                lng: Number(form.coordonnees.lng || 0),
              }
            : undefined,
        valeurs: form.valeurs
          .filter((valeur) => valeur.titre.trim() || valeur.description.trim() || valeur.icon.trim())
          .map((valeur) => ({
            titre: valeur.titre.trim(),
            description: valeur.description.trim(),
            icon: valeur.icon.trim() || 'Star',
          })),
      };

      const response = await updateEntreprise(payload);
      setForm(buildFormState(response.data));
      toast.success('Entreprise mise a jour');
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        title="Entreprise"
        subtitle="Pilote les contenus de marque et les informations utilisees sur la partie publique."
        action={
          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90 disabled:opacity-70"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={['generalites', 'coordonnees']}
          className="space-y-4"
        >
          <AccordionItem
            value="generalites"
            className="overflow-hidden rounded-xl border border-slate-100 bg-white px-6 shadow-sm"
          >
            <AccordionTrigger className="py-5 no-underline hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <Building2 className="h-5 w-5 text-[#0D354E]" />
                <div>
                  <p className="text-base font-semibold text-slate-800">Generalites</p>
                  <p className="text-xs text-slate-500">Nom, slogan et contenus de presentation</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={form.nom}
                  onChange={(event) => updateField('nom', event.target.value)}
                  placeholder="Nom de l entreprise"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  value={form.slogan}
                  onChange={(event) => updateField('slogan', event.target.value)}
                  placeholder="Slogan"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <textarea
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  rows={5}
                  placeholder="Description courte"
                  className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <textarea
                  value={form.mission}
                  onChange={(event) => updateField('mission', event.target.value)}
                  rows={5}
                  placeholder="Mission"
                  className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <textarea
                  value={form.histoire}
                  onChange={(event) => updateField('histoire', event.target.value)}
                  rows={5}
                  placeholder="Histoire"
                  className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="coordonnees"
            className="overflow-hidden rounded-xl border border-slate-100 bg-white px-6 shadow-sm"
          >
            <AccordionTrigger className="py-5 no-underline hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <MapPin className="h-5 w-5 text-[#0D354E]" />
                <div>
                  <p className="text-base font-semibold text-slate-800">Coordonnees</p>
                  <p className="text-xs text-slate-500">Adresse, telephone et points de contact</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={form.adresse}
                  onChange={(event) => updateField('adresse', event.target.value)}
                  placeholder="Adresse"
                  className="md:col-span-2 h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  value={form.telephone}
                  onChange={(event) => updateField('telephone', event.target.value)}
                  placeholder="Telephone"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  value={form.whatsapp}
                  onChange={(event) => updateField('whatsapp', event.target.value)}
                  placeholder="WhatsApp"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="Email"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  value={form.facebook}
                  onChange={(event) => updateField('facebook', event.target.value)}
                  placeholder="Facebook"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  value={form.facebook_url}
                  onChange={(event) => updateField('facebook_url', event.target.value)}
                  placeholder="URL Facebook"
                  className="md:col-span-2 h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="medias"
            className="overflow-hidden rounded-xl border border-slate-100 bg-white px-6 shadow-sm"
          >
            <AccordionTrigger className="py-5 no-underline hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <Sparkles className="h-5 w-5 text-[#0D354E]" />
                <div>
                  <p className="text-base font-semibold text-slate-800">Medias et chiffres</p>
                  <p className="text-xs text-slate-500">Images, annee de creation et preuve sociale</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="number"
                  value={form.date_creation}
                  onChange={(event) =>
                    updateField('date_creation', event.target.value ? Number(event.target.value) : '')
                  }
                  placeholder="Annee de creation"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  type="number"
                  value={form.clients_satisfaits}
                  onChange={(event) =>
                    updateField(
                      'clients_satisfaits',
                      event.target.value ? Number(event.target.value) : ''
                    )
                  }
                  placeholder="Clients satisfaits"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  value={form.hero_image_url}
                  onChange={(event) => updateField('hero_image_url', event.target.value)}
                  placeholder="Image hero URL"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
                <input
                  value={form.about_image_url}
                  onChange={(event) => updateField('about_image_url', event.target.value)}
                  placeholder="Image about URL"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="horaires"
            className="overflow-hidden rounded-xl border border-slate-100 bg-white px-6 shadow-sm"
          >
            <AccordionTrigger className="py-5 no-underline hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <Clock3 className="h-5 w-5 text-[#0D354E]" />
                <div>
                  <p className="text-base font-semibold text-slate-800">Horaires et localisation</p>
                  <p className="text-xs text-slate-500">Plages d ouverture et coordonnees geographiques</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {form.horaires.map((horaire, index) => (
                    <div key={`${horaire.jour}-${index}`} className="grid gap-3 md:grid-cols-[160px_1fr]">
                      <input
                        value={horaire.jour}
                        onChange={(event) => updateHoraire(index, { jour: event.target.value })}
                        placeholder="Jour"
                        className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                      />
                      <input
                        value={horaire.horaires}
                        onChange={(event) => updateHoraire(index, { horaires: event.target.value })}
                        placeholder="09:00 - 18:00"
                        className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={form.coordonnees.lat}
                    onChange={(event) =>
                      updateField('coordonnees', {
                        ...form.coordonnees,
                        lat: event.target.value,
                      })
                    }
                    placeholder="Latitude"
                    className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                  />
                  <input
                    value={form.coordonnees.lng}
                    onChange={(event) =>
                      updateField('coordonnees', {
                        ...form.coordonnees,
                        lng: event.target.value,
                      })
                    }
                    placeholder="Longitude"
                    className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="valeurs"
            className="overflow-hidden rounded-xl border border-slate-100 bg-white px-6 shadow-sm"
          >
            <AccordionTrigger className="py-5 no-underline hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <Sparkles className="h-5 w-5 text-[#0D354E]" />
                <div>
                  <p className="text-base font-semibold text-slate-800">Valeurs de marque</p>
                  <p className="text-xs text-slate-500">Elements mis en avant sur la partie publique</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="space-y-4">
                {form.valeurs.map((valeur, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">Valeur {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeValeur(index)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={valeur.titre}
                        onChange={(event) => updateValeur(index, { titre: event.target.value })}
                        placeholder="Titre"
                        className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                      />
                      <input
                        value={valeur.icon}
                        onChange={(event) => updateValeur(index, { icon: event.target.value })}
                        placeholder="Icone Lucide"
                        className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                      />
                      <textarea
                        value={valeur.description}
                        onChange={(event) => updateValeur(index, { description: event.target.value })}
                        rows={4}
                        placeholder="Description"
                        className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={addValeur}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une valeur
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </form>
  );
}
