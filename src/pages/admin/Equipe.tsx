import { useEffect, useState } from 'react';
import {
  createMembreEquipe,
  deleteMembreEquipe,
  getEquipe,
  toggleMembreEquipeActive,
  updateMembreEquipe,
  type MembreEquipePayload,
} from '../../api/equipe';
import type { ApiMembreEquipe } from '../../api/types';

const emptyForm: MembreEquipePayload = {
  prenom: '',
  nom: '',
  poste: '',
  email: '',
  telephone: '',
  photo: null,
  description: '',
  ordre: 0,
  is_active: true,
};

export default function AdminEquipe() {
  const [membres, setMembres] = useState<ApiMembreEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MembreEquipePayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const loadEquipe = async () => {
    setLoading(true);
    try {
      const data = await getEquipe({ per_page: 1000 });
      setMembres(data);
    } catch (err) {
      setError("Impossible de charger l'Ã©quipe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEquipe();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (item: ApiMembreEquipe) => {
    setEditingId(item.id);
    setForm({
      prenom: item.prenom,
      nom: item.nom,
      poste: item.poste,
      email: item.email ?? '',
      telephone: item.telephone ?? '',
      photo: null,
      description: item.description ?? '',
      ordre: item.ordre,
      is_active: item.is_active,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        await updateMembreEquipe(editingId, form);
      } else {
        await createMembreEquipe(form);
      }
      resetForm();
      await loadEquipe();
    } catch (err) {
      setError("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce membre ?')) return;
    await deleteMembreEquipe(id);
    await loadEquipe();
  };

  const handleToggleActive = async (id: number) => {
    await toggleMembreEquipeActive(id);
    await loadEquipe();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0D354E]">Gestion de l'Ã©quipe</h2>
        <p className="text-sm text-slate-500">GÃ©rez les membres et leurs profils.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#0D354E] mb-4">
          {editingId ? 'Modifier un membre' : 'Nouveau membre'}
        </h3>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="PrÃ©nom"
            value={form.prenom}
            onChange={(e) => setForm((prev) => ({ ...prev, prenom: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Poste"
            value={form.poste}
            onChange={(e) => setForm((prev) => ({ ...prev, poste: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Email"
            value={form.email ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="TÃ©lÃ©phone"
            value={form.telephone ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))}
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
            placeholder="Description"
            value={form.description ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="text-sm text-slate-600">Photo</label>
            <input
              type="file"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  photo: e.target.files?.[0] ?? null,
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
        <h3 className="font-semibold text-[#0D354E] mb-4">Liste des membres</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">Nom</th>
                  <th className="py-2">Poste</th>
                  <th className="py-2">Actif</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {membres.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="py-2">{item.prenom} {item.nom}</td>
                    <td className="py-2">{item.poste}</td>
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
