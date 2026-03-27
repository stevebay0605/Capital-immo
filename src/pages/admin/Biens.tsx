import { useEffect, useMemo, useState } from 'react';
import {
  createBien,
  deleteBien,
  getBiens,
  toggleBienVedette,
  updateBien,
  updateBienStatut,
  type BienPayload,
} from '../../api/biens';
import type { ApiBien, BienStatut, BienTransaction, BienType } from '../../api/types';
import { formatPrix } from '../../utils/format';

const emptyForm: BienPayload = {
  titre: '',
  description: '',
  prix: 0,
  surface: 0,
  pieces: 0,
  chambres: 0,
  salle_de_bain: 0,
  etage: null,
  type: 'maison',
  transaction: 'vente',
  zone: '',
  quartier: '',
  reference: '',
  statut: 'disponible',
  en_vedette: false,
  caracteristiques: [],
  images: [],
};

const statuts: BienStatut[] = ['disponible', 'vendu', 'reserve'];
const types: BienType[] = ['maison', 'villa', 'appartement', 'local', 'terrain'];
const transactions: BienTransaction[] = ['vente', 'location'];

export default function AdminBiens() {
  const [biens, setBiens] = useState<ApiBien[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BienPayload>(emptyForm);
  const [caracteristiquesText, setCaracteristiquesText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadBiens = async () => {
    setLoading(true);
    try {
      const [dispos, vendus, reserves] = await Promise.all([
        getBiens({ statut: 'disponible', per_page: 1000 }),
        getBiens({ statut: 'vendu', per_page: 1000 }),
        getBiens({ statut: 'reserve', per_page: 1000 }),
      ]);

      const merged = [...dispos, ...vendus, ...reserves];
      const unique = Array.from(new Map(merged.map((item) => [item.id, item])).values());
      setBiens(unique);
    } catch (err) {
      setError('Impossible de charger les biens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBiens();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setCaracteristiquesText('');
  };

  const handleEdit = (bien: ApiBien) => {
    setEditingId(bien.id);
    setForm({
      titre: bien.titre,
      description: bien.description,
      prix: bien.prix,
      surface: bien.surface,
      pieces: bien.pieces ?? 0,
      chambres: bien.chambres ?? 0,
      salle_de_bain: bien.salle_de_bain ?? 0,
      etage: bien.etage ?? null,
      type: bien.type,
      transaction: bien.transaction,
      zone: bien.zone,
      quartier: bien.quartier,
      reference: bien.reference,
      statut: bien.statut,
      en_vedette: bien.en_vedette,
      caracteristiques: bien.caracteristiques ?? [],
      images: [],
    });
    setCaracteristiquesText((bien.caracteristiques ?? []).join('\n'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: BienPayload = {
      ...form,
      reference: form.reference?.trim() ? form.reference.trim() : undefined,
      caracteristiques: caracteristiquesText
        ? caracteristiquesText.split('\n').map((item) => item.trim()).filter(Boolean)
        : [],
      images: form.images?.length ? form.images : undefined,
    };

    try {
      if (editingId) {
        await updateBien(editingId, payload);
      } else {
        await createBien(payload);
      }
      resetForm();
      await loadBiens();
    } catch (err) {
      setError("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce bien ?')) return;
    await deleteBien(id);
    await loadBiens();
  };

  const handleToggleVedette = async (id: number) => {
    await toggleBienVedette(id);
    await loadBiens();
  };

  const handleUpdateStatut = async (id: number, statut: BienStatut) => {
    await updateBienStatut(id, statut);
    await loadBiens();
  };

  const title = useMemo(() => (editingId ? 'Modifier le bien' : 'Nouveau bien'), [editingId]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0D354E]">Gestion des biens</h2>
        <p className="text-sm text-slate-500">CrÃ©ez, modifiez et mettez en avant vos biens.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#0D354E] mb-4">{title}</h3>
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
            placeholder="Zone"
            value={form.zone}
            onChange={(e) => setForm((prev) => ({ ...prev, zone: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Quartier"
            value={form.quartier}
            onChange={(e) => setForm((prev) => ({ ...prev, quartier: e.target.value }))}
            required
          />
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Prix"
            value={form.prix}
            onChange={(e) => setForm((prev) => ({ ...prev, prix: Number(e.target.value) }))}
            required
          />
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Surface"
            value={form.surface}
            onChange={(e) => setForm((prev) => ({ ...prev, surface: Number(e.target.value) }))}
            required
          />
          <div className="flex gap-3">
            <select
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as BienType }))}
            >
              {types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={form.transaction}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, transaction: e.target.value as BienTransaction }))
              }
            >
              {transactions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="PiÃ¨ces"
            value={form.pieces}
            onChange={(e) => setForm((prev) => ({ ...prev, pieces: Number(e.target.value) }))}
          />
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Chambres"
            value={form.chambres}
            onChange={(e) => setForm((prev) => ({ ...prev, chambres: Number(e.target.value) }))}
          />
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Salle de bain"
            value={form.salle_de_bain}
            onChange={(e) => setForm((prev) => ({ ...prev, salle_de_bain: Number(e.target.value) }))}
          />
          <input
            type="number"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Ã‰tage"
            value={form.etage ?? ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, etage: e.target.value ? Number(e.target.value) : null }))
            }
          />
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.statut}
            onChange={(e) => setForm((prev) => ({ ...prev, statut: e.target.value as BienStatut }))}
          >
            {statuts.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="RÃ©fÃ©rence (optionnel)"
            value={form.reference ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, reference: e.target.value }))}
          />
          <textarea
            className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[90px]"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
          <textarea
            className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[90px]"
            placeholder="CaractÃ©ristiques (une par ligne)"
            value={caracteristiquesText}
            onChange={(e) => setCaracteristiquesText(e.target.value)}
          />
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="text-sm text-slate-600">Images</label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  images: e.target.files ? Array.from(e.target.files) : [],
                }))
              }
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <label className="text-sm text-slate-600">En vedette</label>
            <input
              type="checkbox"
              checked={form.en_vedette ?? false}
              onChange={(e) => setForm((prev) => ({ ...prev, en_vedette: e.target.checked }))}
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
        <h3 className="font-semibold text-[#0D354E] mb-4">Liste des biens</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">Titre</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Transaction</th>
                  <th className="py-2">Statut</th>
                  <th className="py-2">Prix</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {biens.map((bien) => (
                  <tr key={bien.id} className="border-t border-slate-100">
                    <td className="py-2 pr-4">{bien.titre}</td>
                    <td className="py-2">{bien.type}</td>
                    <td className="py-2">{bien.transaction}</td>
                    <td className="py-2">
                      <select
                        className="border border-slate-200 rounded px-2 py-1"
                        value={bien.statut}
                        onChange={(e) => handleUpdateStatut(bien.id, e.target.value as BienStatut)}
                      >
                        {statuts.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2">{formatPrix(bien.prix, bien.transaction)}</td>
                    <td className="py-2 flex flex-wrap gap-2">
                      <button
                        className="text-xs px-2 py-1 rounded border border-slate-200"
                        onClick={() => handleEdit(bien)}
                      >
                        Modifier
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-slate-200"
                        onClick={() => handleToggleVedette(bien.id)}
                      >
                        {bien.en_vedette ? 'Retirer vedette' : 'Mettre vedette'}
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-red-200 text-red-500"
                        onClick={() => handleDelete(bien.id)}
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
