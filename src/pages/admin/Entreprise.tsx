import { useEffect, useState } from 'react';
import { getEntreprise, updateEntreprise, type UpdateEntreprisePayload } from '../../api/entreprise';
import type { ApiEntrepriseInfo } from '../../api/types';

const buildFormState = (data: ApiEntrepriseInfo | null) => ({
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
  date_creation: data?.date_creation ?? 2011,
  clients_satisfaits: data?.clients_satisfaits ?? 0,
  hero_image_url: data?.hero_image_url ?? '',
  about_image_url: data?.about_image_url ?? '',
  horaires: JSON.stringify(data?.horaires ?? {}, null, 2),
  coordonnees: JSON.stringify(data?.coordonnees ?? { lat: 0, lng: 0 }, null, 2),
  valeurs: JSON.stringify(data?.valeurs ?? [], null, 2),
});

export default function AdminEntreprise() {
  const [form, setForm] = useState(buildFormState(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getEntreprise();
        if (isMounted) {
          setForm(buildFormState(data));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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
        date_creation: Number(form.date_creation),
        clients_satisfaits: Number(form.clients_satisfaits),
        hero_image_url: form.hero_image_url || undefined,
        about_image_url: form.about_image_url || undefined,
        horaires: form.horaires ? JSON.parse(form.horaires) : undefined,
        coordonnees: form.coordonnees ? JSON.parse(form.coordonnees) : undefined,
        valeurs: form.valeurs ? JSON.parse(form.valeurs) : undefined,
      };

      await updateEntreprise(payload);
      setSuccess('Informations mises Ã  jour.');
    } catch (err) {
      setError('Erreur lors de la sauvegarde. VÃ©rifiez les champs JSON.');
    }
  };

  if (loading) {
    return <div className="text-slate-500">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D354E]">Informations entreprise</h2>
        <p className="text-sm text-slate-500">Mettez Ã  jour les informations publiques.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Slogan"
            value={form.slogan}
            onChange={(e) => setForm((prev) => ({ ...prev, slogan: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Adresse"
            value={form.adresse}
            onChange={(e) => setForm((prev) => ({ ...prev, adresse: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="TÃ©lÃ©phone"
            value={form.telephone}
            onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="WhatsApp"
            value={form.whatsapp}
            onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Facebook"
            value={form.facebook}
            onChange={(e) => setForm((prev) => ({ ...prev, facebook: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Facebook URL"
            value={form.facebook_url}
            onChange={(e) => setForm((prev) => ({ ...prev, facebook_url: e.target.value }))}
          />
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="AnnÃ©e de crÃ©ation"
            value={form.date_creation}
            onChange={(e) => setForm((prev) => ({ ...prev, date_creation: Number(e.target.value) }))}
          />
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Clients satisfaits"
            value={form.clients_satisfaits}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, clients_satisfaits: Number(e.target.value) }))
            }
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Hero image URL"
            value={form.hero_image_url}
            onChange={(e) => setForm((prev) => ({ ...prev, hero_image_url: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="About image URL"
            value={form.about_image_url}
            onChange={(e) => setForm((prev) => ({ ...prev, about_image_url: e.target.value }))}
          />
        </div>

        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[100px]"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[120px]"
          placeholder="Histoire"
          value={form.histoire}
          onChange={(e) => setForm((prev) => ({ ...prev, histoire: e.target.value }))}
        />
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[100px]"
          placeholder="Mission"
          value={form.mission}
          onChange={(e) => setForm((prev) => ({ ...prev, mission: e.target.value }))}
        />
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[120px]"
          placeholder="Horaires (JSON)"
          value={form.horaires}
          onChange={(e) => setForm((prev) => ({ ...prev, horaires: e.target.value }))}
        />
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[120px]"
          placeholder="CoordonnÃ©es (JSON)"
          value={form.coordonnees}
          onChange={(e) => setForm((prev) => ({ ...prev, coordonnees: e.target.value }))}
        />
        <textarea
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[120px]"
          placeholder="Valeurs (JSON)"
          value={form.valeurs}
          onChange={(e) => setForm((prev) => ({ ...prev, valeurs: e.target.value }))}
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#0D354E] text-white text-sm font-semibold hover:bg-[#0D354E]/90"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
