import { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminDrawer from '@/components/admin/AdminDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMembre, setEditingMembre] = useState<ApiMembreEquipe | null>(null);
  const [form, setForm] = useState<MembreEquipePayload>(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const loadEquipe = async () => {
    setLoading(true);
    try {
      const data = await getEquipe({ per_page: 1000 });
      setMembres(data);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEquipe();
  }, []);

  const openCreateDrawer = () => {
    setEditingMembre(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (membre: ApiMembreEquipe) => {
    setEditingMembre(membre);
    setForm({
      prenom: membre.prenom,
      nom: membre.nom,
      poste: membre.poste,
      email: membre.email ?? '',
      telephone: membre.telephone ?? '',
      photo: null,
      description: membre.description ?? '',
      ordre: membre.ordre,
      is_active: membre.is_active,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMembre) {
        await updateMembreEquipe(editingMembre.id, form);
        toast.success('Membre mis a jour');
      } else {
        await createMembreEquipe(form);
        toast.success('Membre cree avec succes');
      }
      setDrawerOpen(false);
      await loadEquipe();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteMembreEquipe(confirmDeleteId);
      toast.success('Membre supprime avec succes');
      setConfirmDeleteId(null);
      await loadEquipe();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleMembreEquipeActive(id);
      toast.success('Membre mis a jour');
      await loadEquipe();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const columns = useMemo<DataTableColumn<ApiMembreEquipe>[]>(
    () => [
      {
        key: 'nom',
        header: 'Membre',
        render: (membre) => (
          <div>
            <p className="font-semibold text-slate-800">
              {membre.prenom} {membre.nom}
            </p>
            <p className="text-xs text-slate-500">{membre.poste}</p>
          </div>
        ),
      },
      {
        key: 'contact',
        header: 'Contact',
        render: (membre) => (
          <div className="text-sm text-slate-600">
            <p>{membre.email ?? 'Sans email'}</p>
            <p>{membre.telephone ?? 'Sans telephone'}</p>
          </div>
        ),
      },
      {
        key: 'statut',
        header: 'Statut',
        render: (membre) => <StatusBadge status={membre.is_active ? 'actif' : 'inactif'} />,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (membre) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditDrawer(membre)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleToggleActive(membre.id)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {membre.is_active ? 'Desactiver' : 'Activer'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeleteId(membre.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipe"
        subtitle={`${membres.length} membre(s) de l equipe`}
        action={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90"
          >
            <Plus className="h-4 w-4" />
            Nouveau membre
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={membres}
        loading={loading}
        rowKey={(membre) => membre.id}
        emptyState={
          <EmptyState
            icon={Users}
            title="Aucun membre"
            description="Ajoute un premier membre a l equipe."
            action={
              <button
                type="button"
                onClick={openCreateDrawer}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90"
              >
                Ajouter un membre
              </button>
            }
          />
        }
      />

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingMembre ? 'Modifier le membre' : 'Nouveau membre'}
        description="Gerer les informations de l equipe."
        footer={
          <div className="flex w-full justify-end gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="equipe-form"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90 disabled:opacity-70"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        }
      >
        <form id="equipe-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.prenom}
              onChange={(e) => setForm((prev) => ({ ...prev, prenom: e.target.value }))}
              placeholder="Prenom"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
            <input
              value={form.nom}
              onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
              placeholder="Nom"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
          </div>
          <input
            value={form.poste}
            onChange={(e) => setForm((prev) => ({ ...prev, poste: e.target.value }))}
            placeholder="Poste"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.email ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
            <input
              value={form.telephone ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))}
              placeholder="Telephone"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
          </div>
          <textarea
            value={form.description ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              value={form.ordre ?? 0}
              onChange={(e) => setForm((prev) => ({ ...prev, ordre: Number(e.target.value) }))}
              placeholder="Ordre"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">Actif</span>
              <input
                type="checkbox"
                checked={form.is_active ?? false}
                onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer ce membre ?"
        message="Cette action supprimera definitivement le membre selectionne."
      />
    </div>
  );
}
