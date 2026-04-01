import { useEffect, useMemo, useState } from 'react';
import { Edit3, MessageSquareQuote, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminDrawer from '@/components/admin/AdminDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTemoignage, setEditingTemoignage] = useState<ApiTemoignage | null>(null);
  const [form, setForm] = useState<TemoignagePayload>(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const loadTemoignages = async () => {
    setLoading(true);
    try {
      const data = await getTemoignages({ per_page: 1000 });
      setTemoignages(data);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTemoignages();
  }, []);

  const openCreateDrawer = () => {
    setEditingTemoignage(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (temoignage: ApiTemoignage) => {
    setEditingTemoignage(temoignage);
    setForm({
      nom: temoignage.nom,
      initiale: temoignage.initiale ?? '',
      role: temoignage.role,
      message: temoignage.message,
      avatar: null,
      note: temoignage.note,
      is_active: temoignage.is_active,
      ordre: temoignage.ordre,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTemoignage) {
        await updateTemoignage(editingTemoignage.id, form);
        toast.success('Temoignage mis a jour');
      } else {
        await createTemoignage(form);
        toast.success('Temoignage cree avec succes');
      }
      setDrawerOpen(false);
      await loadTemoignages();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteTemoignage(confirmDeleteId);
      toast.success('Temoignage supprime avec succes');
      setConfirmDeleteId(null);
      await loadTemoignages();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleTemoignageActive(id);
      toast.success('Temoignage mis a jour');
      await loadTemoignages();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const columns = useMemo<DataTableColumn<ApiTemoignage>[]>(
    () => [
      {
        key: 'nom',
        header: 'Nom',
        render: (temoignage) => (
          <div>
            <p className="font-semibold text-slate-800">{temoignage.nom}</p>
            <p className="text-xs text-slate-500">{temoignage.role}</p>
          </div>
        ),
      },
      {
        key: 'note',
        header: 'Note',
        render: (temoignage) => <span className="text-sm text-slate-600">{temoignage.note}/5</span>,
      },
      {
        key: 'statut',
        header: 'Statut',
        render: (temoignage) => <StatusBadge status={temoignage.is_active ? 'actif' : 'inactif'} />,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (temoignage) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditDrawer(temoignage)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleToggleActive(temoignage.id)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {temoignage.is_active ? 'Desactiver' : 'Activer'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeleteId(temoignage.id)}
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
        title="Temoignages"
        subtitle={`${temoignages.length} temoignage(s) enregistres`}
        action={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90"
          >
            <Plus className="h-4 w-4" />
            Nouveau temoignage
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={temoignages}
        loading={loading}
        rowKey={(temoignage) => temoignage.id}
        emptyState={
          <EmptyState
            icon={MessageSquareQuote}
            title="Aucun temoignage"
            description="Ajoute un premier temoignage client."
            action={
              <button
                type="button"
                onClick={openCreateDrawer}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90"
              >
                Ajouter un temoignage
              </button>
            }
          />
        }
      />

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingTemoignage ? 'Modifier le temoignage' : 'Nouveau temoignage'}
        description="Renseigner un avis client et son affichage."
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
              form="temoignage-form"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90 disabled:opacity-70"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        }
      >
        <form id="temoignage-form" onSubmit={handleSubmit} className="space-y-5">
          <input
            value={form.nom}
            onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
            placeholder="Nom"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.initiale ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, initiale: e.target.value }))}
              placeholder="Initiale"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
            <input
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              placeholder="Role"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
          </div>
          <textarea
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Message"
            rows={5}
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              value={form.note ?? 5}
              onChange={(e) => setForm((prev) => ({ ...prev, note: Number(e.target.value) }))}
              placeholder="Note"
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
        title="Supprimer ce temoignage ?"
        message="Cette action supprimera definitivement le temoignage selectionne."
      />
    </div>
  );
}
