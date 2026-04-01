import { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminDrawer from '@/components/admin/AdminDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<ApiService | null>(null);
  const [form, setForm] = useState<ServicePayload>(emptyForm);
  const [avantagesText, setAvantagesText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await getServices({ per_page: 1000 });
      setServices(data);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const openCreateDrawer = () => {
    setEditingService(null);
    setForm(emptyForm);
    setAvantagesText('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (service: ApiService) => {
    setEditingService(service);
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
    setDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: ServicePayload = {
      ...form,
      avantages: avantagesText.split('\n').map((item) => item.trim()).filter(Boolean),
      image: form.image ?? undefined,
    };

    try {
      if (editingService) {
        await updateService(editingService.id, payload);
        toast.success('Service mis a jour');
      } else {
        await createService(payload);
        toast.success('Service cree avec succes');
      }
      setDrawerOpen(false);
      await loadServices();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteService(confirmDeleteId);
      toast.success('Service supprime avec succes');
      setConfirmDeleteId(null);
      await loadServices();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleServiceActive(id);
      toast.success('Service mis a jour');
      await loadServices();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const columns = useMemo<DataTableColumn<ApiService>[]>(
    () => [
      {
        key: 'titre',
        header: 'Service',
        render: (service) => (
          <div>
            <p className="font-semibold text-slate-800">{service.titre}</p>
            <p className="text-xs text-slate-500">{service.cta}</p>
          </div>
        ),
      },
      {
        key: 'ordre',
        header: 'Ordre',
        render: (service) => <span className="text-sm text-slate-600">{service.ordre}</span>,
      },
      {
        key: 'actif',
        header: 'Statut',
        render: (service) => <StatusBadge status={service.is_active ? 'actif' : 'inactif'} />,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (service) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditDrawer(service)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleToggleActive(service.id)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {service.is_active ? 'Desactiver' : 'Activer'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeleteId(service.id)}
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
        title="Services"
        subtitle={`${services.length} service(s) disponibles`}
        action={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90"
          >
            <Plus className="h-4 w-4" />
            Nouveau service
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        rowKey={(service) => service.id}
        emptyState={
          <EmptyState
            icon={Plus}
            title="Aucun service"
            description="Ajoute un premier service pour commencer."
            action={
              <button
                type="button"
                onClick={openCreateDrawer}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90"
              >
                Ajouter un service
              </button>
            }
          />
        }
      />

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingService ? 'Modifier le service' : 'Nouveau service'}
        description="Gerer les contenus et l'etat d'activation du service."
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
              form="service-form"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90 disabled:opacity-70"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        }
      >
        <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
          <input
            value={form.titre}
            onChange={(e) => setForm((prev) => ({ ...prev, titre: e.target.value }))}
            placeholder="Titre"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            required
          />
          <input
            value={form.icon ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
            placeholder="Icone Lucide"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
          <input
            value={form.cta ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, cta: e.target.value }))}
            placeholder="CTA"
            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description courte"
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
          <textarea
            value={form.description_longue}
            onChange={(e) => setForm((prev) => ({ ...prev, description_longue: e.target.value }))}
            placeholder="Description longue"
            rows={5}
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
          <textarea
            value={avantagesText}
            onChange={(e) => setAvantagesText(e.target.value)}
            placeholder="Un avantage par ligne"
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
        title="Supprimer ce service ?"
        message="Cette action supprimera definitivement le service selectionne."
      />
    </div>
  );
}
