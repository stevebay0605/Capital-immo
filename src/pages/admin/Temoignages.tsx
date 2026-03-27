import { useEffect, useState } from 'react';
import {
  createTemoignage,
  deleteTemoignage,
  getTemoignages,
  toggleTemoignageActive,
  updateTemoignage,
  type TemoignagePayload,
} from '../../api/temoignages';
import type { ApiTemoignage } from '../../api/types';

const emptyForm: TemoignagePayload = {
  nom: '',
  initiale: '',
  role: '',
  message: '',
  avatar: null,
  note: 5,
  is_active: true,
  ordre: 0,
};

export default function AdminTemoignages() {
  const [temoignages, setTemoignages] = useState<ApiTemoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TemoignagePayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const loadTemoignages = async () => {
    setLoading(true);
    try {
      const data = await getTemoignages({ per_page: 1000 });
      setTemoignages(data);
    } catch (err) {
      setError('Impossible de charger les tÃ©moignages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTemoignages();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (item: ApiTemoignage) => {
    setEditingId(item.id);
    setForm({
      nom: item.nom,
      initiale: item.initiale ?? '',
      role: item.role,
      message: item.message,
      avatar: null,
      note: item.note,
      is_active: item.is_active,
      ordre: item.ordre,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        await updateTemoignage(editingId, form);
      } else {
        await createTemoignage(form);
      }
      resetForm();
      await loadTemoignages();
    } catch (err) {
      setError("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce tÃ©moignage ?')) return;
    await deleteTemoignage(id);
    await loadTemoignages();
  };

  const handleToggleActive = async (id: number) => {
    await toggleTemoignageActive(id);
    await loadTemoignages();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0D354E]">Gestion des tÃ©moignages</h2>
        <p className="text-sm text-slate-500">Publiez et mettez en avant les avis clients.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#0D354E] mb-4">
          {editingId ? 'Modifier le tÃ©moignage' : 'Nouveau tÃ©moignage'}
        </h3>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Initiale"
            value={form.initiale ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, initiale: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="RÃ´le"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            required
          />
          <input
            type="number"
            min={1}
            max={5}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Note"
            value={form.note ?? 5}
            onChange={(e) => setForm((prev) => ({ ...prev, note: Number(e.target.value) }))}
          />
          <textarea
            className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[90px]"
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            required
          />
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="text-sm text-slate-600">Avatar</label>
            <input
              type="file"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  avatar: e.target.files?.[0] ?? null,
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
        <h3 className="font-semibold text-[#0D354E] mb-4">Liste des tÃ©moignages</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">Nom</th>
                  <th className="py-2">RÃ´le</th>
                  <th className="py-2">Note</th>
                  <th className="py-2">Actif</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {temoignages.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="py-2">{item.nom}</td>
                    <td className="py-2">{item.role}</td>
                    <td className="py-2">{item.note}</td>
                    <td className="py-2">{item.is_active ? 'Oui' : 'Non'}</td>
                    <td className="py-2 flex flex-wrap gap-2">
                      <button
                        className="text-xs px-2 py-1 rounded border border-slate-200"
                        onClick={() => handleEdit(item)}
                      >
                        Modifier
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-slate-200"
                        onClick={() => handleToggleActive(item.id)}
                      >
                        {item.is_active ? 'DÃ©sactiver' : 'Activer'}
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-red-200 text-red-500"
                        onClick={() => handleDelete(item.id)}
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
