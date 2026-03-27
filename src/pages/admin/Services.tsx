import { useEffect, useState } from 'react';
import {
  createService,
  deleteService,
  getServices,
  toggleServiceActive,
  updateService,
  type ServicePayload,
} from '../../api/services';
import type { ApiService } from '../../api/types';

const emptyForm: ServicePayload = {
  titre: '',
  description: '',
  description_longue: '',
  icon: 'Home',
  image: null,
  avantages: [],
  cta: 'En savoir plus',
  ordre: 0,
  is_active: true,
};

export default function AdminServices() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ServicePayload>(emptyForm);
  const [avantagesText, setAvantagesText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await getServices({ per_page: 1000 });
      setServices(data);
    } catch (err) {
      setError('Impossible de charger les services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setAvantagesText('');
  };

  const handleEdit = (service: ApiService) => {
    setEditingId(service.id);
    setForm({
      titre: service.titre,
      description: service.description,
      description_longue: service.description_longue,
      icon: service.icon,
      image: null,
      avantages: service.avantages ?? [],
      cta: service.cta,
      ordre: service.ordre,
      is_active: service.is_active,
    });
    setAvantagesText((service.avantages ?? []).join('\n'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: ServicePayload = {
      ...form,
      avantages: avantagesText
        ? avantagesText.split('\n').map((item) => item.trim()).filter(Boolean)
        : [],
      image: form.image ?? undefined,
    };

    try {
      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }
      resetForm();
      await loadServices();
    } catch (err) {
      setError("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    await deleteService(id);
    await loadServices();
  };

  const handleToggleActive = async (id: number) => {
    await toggleServiceActive(id);
    await loadServices();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0D354E]">Gestion des services</h2>
        <p className="text-sm text-slate-500">Pilotez vos services et leur ordre d'affichage.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#0D354E] mb-4">
          {editingId ? 'Modifier le service' : 'Nouveau service'}
        </h3>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Titre"
            value={form.titre}
            onChange={(e) => setForm((prev) => ({ ...prev, titre: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="IcÃ´ne (ex: Home)"
            value={form.icon ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="CTA"
            value={form.cta ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, cta: e.target.value }))}
          />
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Ordre"
            value={form.ordre ?? 0}
            onChange={(e) => setForm((prev) => ({ ...prev, ordre: Number(e.target.value) }))}
          />
          <textarea
            className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[90px]"
            placeholder="Description courte"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
          <textarea
            className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[120px]"
            placeholder="Description longue"
            value={form.description_longue}
            onChange={(e) => setForm((prev) => ({ ...prev, description_longue: e.target.value }))}
            required
          />
          <textarea
            className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[90px]"
            placeholder="Avantages (un par ligne)"
            value={avantagesText}
            onChange={(e) => setAvantagesText(e.target.value)}
          />
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="text-sm text-slate-600">Image</label>
            <input
              type="file"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] ?? null,
                }))
              }
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="text-sm text-slate-600">Actif</label>
            <input
              type="checkbox"
              checked={form.is_active ?? false}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0D354E] text-white text-sm font-semibold hover:bg-[#0D354E]/90"
            >
              {editingId ? 'Mettre Ã  jour' : 'CrÃ©er'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#0D354E] mb-4">Liste des services</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">Titre</th>
                  <th className="py-2">CTA</th>
                  <th className="py-2">Actif</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-t border-slate-100">
                    <td className="py-2">{service.titre}</td>
                    <td className="py-2">{service.cta}</td>
                    <td className="py-2">{service.is_active ? 'Oui' : 'Non'}</td>
                    <td className="py-2 flex flex-wrap gap-2">
                      <button
                        className="text-xs px-2 py-1 rounded border border-slate-200"
                        onClick={() => handleEdit(service)}
                      >
                        Modifier
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-slate-200"
                        onClick={() => handleToggleActive(service.id)}
                      >
                        {service.is_active ? 'DÃ©sactiver' : 'Activer'}
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-red-200 text-red-500"
                        onClick={() => handleDelete(service.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
