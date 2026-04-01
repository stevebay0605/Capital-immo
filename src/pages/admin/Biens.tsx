import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Edit3, Home, Plus, Search, Star, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import TypeBadge from '@/components/admin/TypeBadge';
import AdminDrawer from '@/components/admin/AdminDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import {
  createBien,
  deleteBien,
  deleteBienImage,
  getBiens,
  reorderBienImages,
  toggleBienVedette,
  updateBien,
  type BienPayload,
} from '../../api/biens';
import type { ApiBien, BienStatut, BienTransaction, BienType } from '../../api/types';
import { resolveAssetUrl } from '../../api/utils';
 

type ImagePreview = {
  id: string;
  file: File;
  url: string;
};

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

const types: BienType[] = ['maison', 'villa', 'appartement', 'local', 'terrain'];
const transactions: BienTransaction[] = ['vente', 'location'];
const statuts: BienStatut[] = ['disponible', 'vendu', 'reserve'];
const LOCATION_MENSUELLE = 'Location mensuelle';
const LOCATION_JOURNALIERE = 'Location journalière';

const FieldLabel = ({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) => (
  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
    {label} {required ? <span className="text-red-500">*</span> : null}
  </span>
);

export default function AdminBiens() {
  const [biens, setBiens] = useState<ApiBien[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [statutFilter, setStatutFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBien, setEditingBien] = useState<ApiBien | null>(null);
  const [form, setForm] = useState<BienPayload>(emptyForm);
  const [equipementsText, setEquipementsText] = useState('');
  const [locationPeriod, setLocationPeriod] = useState<'mensuel' | 'journalier' | ''>('');
  const [newImagePreviews, setNewImagePreviews] = useState<ImagePreview[]>([]);
  const [deletingImageIds, setDeletingImageIds] = useState<number[]>([]);
  const [replaceExistingImages, setReplaceExistingImages] = useState(false);
  const [draggingExistingId, setDraggingExistingId] = useState<number | null>(null);
  const [draggingPreviewId, setDraggingPreviewId] = useState<string | null>(null);
  const [reorderingImages, setReorderingImages] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const resetUploadedImages = (previews: ImagePreview[]) => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  };

  useEffect(() => {
    return () => {
      resetUploadedImages(newImagePreviews);
    };
  }, [newImagePreviews]);

  useEffect(() => {
    if (form.transaction !== 'location') {
      setLocationPeriod('');
    }
  }, [form.transaction]);

  const loadBiens = async () => {
    setLoading(true);
    try {
      const [disponibles, vendus, reserves] = await Promise.all([
        getBiens({ statut: 'disponible', per_page: 1000 }),
        getBiens({ statut: 'vendu', per_page: 1000 }),
        getBiens({ statut: 'reserve', per_page: 1000 }),
      ]);

      const merged = [...disponibles, ...vendus, ...reserves];
      const unique = Array.from(new Map(merged.map((bien) => [bien.id, bien])).values());
      setBiens(unique);
    } catch {
      toast.error('Impossible de charger les biens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBiens();
  }, []);

  const filteredBiens = useMemo(() => {
    return biens.filter((bien) => {
      const matchesSearch =
        !search.trim() ||
        [bien.titre, bien.reference, bien.zone, bien.quartier]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType = typeFilter === 'all' || bien.type === typeFilter;
      const matchesTransaction = transactionFilter === 'all' || bien.transaction === transactionFilter;
      const matchesStatut = statutFilter === 'all' || bien.statut === statutFilter;

      return matchesSearch && matchesType && matchesTransaction && matchesStatut;
    });
  }, [biens, search, typeFilter, transactionFilter, statutFilter]);

  const hasActiveFilters =
    search.length > 0 || typeFilter !== 'all' || transactionFilter !== 'all' || statutFilter !== 'all';

  const referencePlaceholder = useMemo(() => {
    if (!form.titre.trim()) return 'CIG-001';

    const slug = form.titre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 18);

    return `CIG-${slug || '001'}`;
  }, [form.titre]);

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setTransactionFilter('all');
    setStatutFilter('all');
  };

  const resetFormState = () => {
    resetUploadedImages(newImagePreviews);
    setNewImagePreviews([]);
    setEditingBien(null);
    setForm(emptyForm);
    setEquipementsText('');
    setLocationPeriod('');
    setReplaceExistingImages(false);
    setDeletingImageIds([]);
    setDraggingExistingId(null);
    setDraggingPreviewId(null);
    setReorderingImages(false);
  };

  const openCreateDrawer = () => {
    resetFormState();
    setDrawerOpen(true);
  };

  const openEditDrawer = (bien: ApiBien) => {
    const existingCaracs = bien.caracteristiques ?? [];
    const period =
      bien.location_period ??
      (existingCaracs.includes(LOCATION_JOURNALIERE)
        ? 'journalier'
        : existingCaracs.includes(LOCATION_MENSUELLE)
          ? 'mensuel'
          : '');

    resetUploadedImages(newImagePreviews);
    setNewImagePreviews([]);
    setEditingBien(bien);
    setReplaceExistingImages(false);
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
      location_period: bien.location_period ?? null,
      zone: bien.zone,
      quartier: bien.quartier,
      reference: bien.reference,
      statut: bien.statut,
      en_vedette: bien.en_vedette,
      caracteristiques: existingCaracs,
      images: [],
    });
    setEquipementsText(
      existingCaracs
        .filter((item) => item !== LOCATION_MENSUELLE && item !== LOCATION_JOURNALIERE)
        .join('\n')
    );
    setLocationPeriod(period);
    setDrawerOpen(true);
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files?.length) return;

    const nextFiles = Array.from(files);
    const nextPreviews = nextFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setNewImagePreviews((prev) => [...prev, ...nextPreviews]);
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images ?? []), ...nextFiles],
    }));
  };

  const moveItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  const handleReorderExistingImages = async (sourceId: number, targetId: number) => {
    if (!editingBien || sourceId === targetId) return;
    const images = editingBien.images ?? [];
    const fromIndex = images.findIndex((image) => image.id === sourceId);
    const toIndex = images.findIndex((image) => image.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const reordered = moveItem(images, fromIndex, toIndex).map((image, index) => ({
      ...image,
      ordre: index,
    }));

    setEditingBien((prev) => (prev ? { ...prev, images: reordered } : prev));
    setBiens((prev) =>
      prev.map((bien) =>
        bien.id === editingBien.id ? { ...bien, images: reordered } : bien
      )
    );

    setReorderingImages(true);
    try {
      await reorderBienImages(
        editingBien.id,
        reordered.map((image, index) => ({ id: image.id, ordre: index }))
      );
      toast.success('Ordre des images mis a jour');
    } catch {
      toast.error("Impossible d'enregistrer l'ordre des images");
      await loadBiens();
    } finally {
      setReorderingImages(false);
    }
  };

  const handleReorderNewPreviews = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setNewImagePreviews((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === sourceId);
      const toIndex = prev.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = moveItem(prev, fromIndex, toIndex);
      setForm((current) => ({
        ...current,
        images: next.map((item) => item.file),
      }));
      return next;
    });
  };

  const moveExistingImage = (imageId: number, direction: -1 | 1) => {
    if (!editingBien || reorderingImages) return;
    const images = editingBien.images ?? [];
    const fromIndex = images.findIndex((image) => image.id === imageId);
    const toIndex = fromIndex + direction;
    if (fromIndex < 0 || toIndex < 0 || toIndex >= images.length) return;
    const targetId = images[toIndex].id;
    void handleReorderExistingImages(imageId, targetId);
  };

  const moveNewPreview = (previewId: string, direction: -1 | 1) => {
    setNewImagePreviews((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === previewId);
      const toIndex = fromIndex + direction;
      if (fromIndex < 0 || toIndex < 0 || toIndex >= prev.length) return prev;
      const next = moveItem(prev, fromIndex, toIndex);
      setForm((current) => ({
        ...current,
        images: next.map((item) => item.file),
      }));
      return next;
    });
  };

  const removeNewPreview = (previewId: string) => {
    setNewImagePreviews((prev) => {
      const preview = prev.find((item) => item.id === previewId);
      if (preview) {
        URL.revokeObjectURL(preview.url);
      }

      const next = prev.filter((item) => item.id !== previewId);
      if (next.length === 0) {
        setReplaceExistingImages(false);
      }
      setForm((current) => ({
        ...current,
        images: next.map((item) => item.file),
      }));

      return next;
    });
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!editingBien) return;

    setDeletingImageIds((prev) => [...prev, imageId]);
    try {
      await deleteBienImage(editingBien.id, imageId);
      toast.success('Image supprimee');
      setEditingBien((prev) =>
        prev
          ? {
              ...prev,
              images: (prev.images ?? []).filter((image) => image.id !== imageId),
            }
          : prev
      );
      setBiens((prev) =>
        prev.map((bien) =>
          bien.id === editingBien.id
            ? { ...bien, images: (bien.images ?? []).filter((image) => image.id !== imageId) }
            : bien
        )
      );
    } catch {
      toast.error("Impossible de supprimer l'image");
    } finally {
      setDeletingImageIds((prev) => prev.filter((id) => id !== imageId));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    if (replaceExistingImages && newImagePreviews.length === 0) {
      toast.error('Ajoutez de nouvelles images pour remplacer les existantes.');
      setSaving(false);
      return;
    }

    if (form.transaction === 'location' && !locationPeriod) {
      toast.error('Veuillez prÃ©ciser le type de location.');
      setSaving(false);
      return;
    }

    const baseEquipements = equipementsText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => item !== LOCATION_MENSUELLE && item !== LOCATION_JOURNALIERE);

    const payload: BienPayload = {
      ...form,
      reference: form.reference?.trim() ? form.reference.trim() : undefined,
      caracteristiques: baseEquipements,
      location_period: form.transaction === 'location' ? (locationPeriod || undefined) : null,
      images: newImagePreviews.length > 0 ? newImagePreviews.map((preview) => preview.file) : undefined,
      replace_images: editingBien ? replaceExistingImages && newImagePreviews.length > 0 : undefined,
    };

    try {
      if (editingBien) {
        await updateBien(editingBien.id, payload);
        toast.success('Bien mis a jour');
      } else {
        await createBien(payload);
        toast.success('Bien cree avec succes');
      }

      setDrawerOpen(false);
      resetFormState();
      await loadBiens();
    } catch {
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteBien(confirmDeleteId);
      toast.success('Bien supprime');
      setConfirmDeleteId(null);
      await loadBiens();
    } catch {
      toast.error('Impossible de supprimer ce bien');
    }
  };

  const handleToggleVedette = async (bienId: number) => {
    try {
      await toggleBienVedette(bienId);
      toast.success('Statut mis a jour');
      await loadBiens();
    } catch {
      toast.error('Une erreur est survenue');
    }
  };

  const columns = useMemo<DataTableColumn<ApiBien>[]>(
    () => [
      {
        key: 'select',
        header: '',
        headerClassName: 'w-10',
        cellClassName: 'w-10',
        render: (bien) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(bien.id)}
            onChange={(event) =>
              setSelectedIds((prev) =>
                event.target.checked ? [...prev, bien.id] : prev.filter((id) => id !== bien.id)
              )
            }
            className="h-4 w-4 rounded border-slate-300"
          />
        ),
      },
      {
        key: 'bien',
        header: 'Bien',
        render: (bien) => (
          <div className="flex items-center gap-3">
            <img
              src={
                resolveAssetUrl(bien.images?.[0]?.url) ||
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120'
              }
              alt={bien.titre}
              className="h-11 w-11 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">{bien.titre}</p>
              <p className="truncate text-xs text-slate-400">{bien.reference || 'Sans reference'}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'type',
        header: 'Type',
        render: (bien) => <TypeBadge type={bien.type} />,
      },
      {
        key: 'transaction',
        header: 'Transaction',
        render: (bien) => (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-700">
            {bien.transaction}
          </span>
        ),
      },
      {
        key: 'statut',
        header: 'Statut',
        render: (bien) => <StatusBadge status={bien.statut} />,
      },
      {
        key: 'prix',
        header: 'Prix',
        render: (bien) => (
          <span className="text-sm font-semibold text-slate-800">{bien.prix} FCFA</span>
        ),
      },
      {
        key: 'vedette',
        header: '★',
        render: (bien) => (
          <button
            type="button"
            onClick={() => void handleToggleVedette(bien.id)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${
              bien.en_vedette
                ? 'border-amber-200 bg-amber-50 text-amber-500'
                : 'border-slate-200 bg-white text-slate-400'
            }`}
          >
            <Star className={`h-4 w-4 ${bien.en_vedette ? 'fill-current' : ''}`} />
          </button>
        ),
      },
      {
        key: 'actions',
        header: '...',
        render: (bien) => (
          <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => openEditDrawer(bien)}
              className="text-slate-400 transition-colors hover:text-[#0D354E]"
              title="Editer"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeleteId(bien.id)}
              className="text-slate-400 transition-colors hover:text-red-500"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [selectedIds]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biens immobiliers"
        subtitle={`${filteredBiens.length} bien(s) dans le catalogue`}
        action={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90"
          >
            <Plus className="h-4 w-4" />
            Nouveau bien
          </button>
        }
      />

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <label className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un bien..."
            className="h-9 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
        </label>

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
        >
          <option value="all">Tous les types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={transactionFilter}
          onChange={(event) => setTransactionFilter(event.target.value)}
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
        >
          <option value="all">Toutes transactions</option>
          {transactions.map((transaction) => (
            <option key={transaction} value={transaction}>
              {transaction}
            </option>
          ))}
        </select>

        <select
          value={statutFilter}
          onChange={(event) => setStatutFilter(event.target.value)}
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
        >
          <option value="all">Tous les statuts</option>
          {statuts.map((statut) => (
            <option key={statut} value={statut}>
              {statut}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-500 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredBiens}
        loading={loading}
        rowKey={(bien) => bien.id}
        rowClassName={(bien) =>
          `group ${bien.statut !== 'disponible' ? 'opacity-60' : ''}`
        }
        emptyState={
          <EmptyState
            icon={Home}
            title="Aucun bien trouve"
            description="Ajoutez votre premier bien au catalogue."
            action={
              <button
                type="button"
                onClick={openCreateDrawer}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90"
              >
                <Plus className="h-4 w-4" />
                Ajouter un bien
              </button>
            }
          />
        }
      />

      <AdminDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          resetFormState();
        }}
        title={editingBien ? `Modifier : ${editingBien.titre}` : 'Nouveau bien'}
        description="Renseigner la fiche immobiliere et ses options de diffusion."
        footer={
          <div className="flex w-full justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                resetFormState();
              }}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="bien-form"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90 disabled:opacity-70"
            >
              {saving && <Spinner className="h-4 w-4" />}
              Enregistrer
            </button>
          </div>
        }
      >
        <form id="bien-form" onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Informations generales
            </h3>
            <div className="space-y-4">
              <label className="grid gap-2">
                <FieldLabel label="Titre" required />
                <input
                  value={form.titre}
                  onChange={(event) => setForm((prev) => ({ ...prev, titre: event.target.value }))}
                  placeholder="Ex: Villa contemporaine"
                  required
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel label="Description" required />
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="DÃ©crire le bien en dÃ©tails..."
                  rows={4}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel label="RÃ©fÃ©rence (optionnel)" />
                <input
                  value={form.reference ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, reference: event.target.value }))}
                  placeholder={referencePlaceholder}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Localisation
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel label="Zone" required />
                <input
                  value={form.zone}
                  onChange={(event) => setForm((prev) => ({ ...prev, zone: event.target.value }))}
                  placeholder="Ex: Centre-ville"
                  required
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel label="Quartier" required />
                <input
                  value={form.quartier}
                  onChange={(event) => setForm((prev) => ({ ...prev, quartier: event.target.value }))}
                  placeholder="Ex: Poto-Poto"
                  required
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Caracteristiques
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel label="Type" required />
                <select
                  value={form.type}
                  onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as BienType }))}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <FieldLabel label="Transaction" required />
                <select
                  value={form.transaction}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, transaction: event.target.value as BienTransaction }))
                  }
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                >
                  {transactions.map((transaction) => (
                    <option key={transaction} value={transaction}>
                      {transaction}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {form.transaction === 'location' && (
              <label className="grid gap-2 md:max-w-xs">
                <FieldLabel label="Type de location" required />
                <select
                  value={locationPeriod}
                  onChange={(event) =>
                    setLocationPeriod(event.target.value as 'mensuel' | 'journalier' | '')
                  }
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                  required
                >
                  <option value="">SÃ©lectionner</option>
                  <option value="mensuel">Location mensuelle</option>
                  <option value="journalier">Location journaliÃ¨re</option>
                </select>
              </label>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel label="Surface (mÂ²)" required />
                <input
                  type="number"
                  value={form.surface}
                  onChange={(event) => setForm((prev) => ({ ...prev, surface: Number(event.target.value) }))}
                  placeholder="Ex: 150"
                  required
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel label="Prix (FCFA)" required />
                <input
                  type="number"
                  value={form.prix}
                  onChange={(event) => setForm((prev) => ({ ...prev, prix: Number(event.target.value) }))}
                  placeholder="Ex: 120000000"
                  required
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2">
                <FieldLabel label="PiÃ¨ces" />
                <input
                  type="number"
                  value={form.pieces ?? 0}
                  onChange={(event) => setForm((prev) => ({ ...prev, pieces: Number(event.target.value) }))}
                  placeholder="Ex: 5"
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel label="Chambres" />
                <input
                  type="number"
                  value={form.chambres ?? 0}
                  onChange={(event) => setForm((prev) => ({ ...prev, chambres: Number(event.target.value) }))}
                  placeholder="Ex: 3"
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel label="Salle de bain" />
                <input
                  type="number"
                  value={form.salle_de_bain ?? 0}
                  onChange={(event) => setForm((prev) => ({ ...prev, salle_de_bain: Number(event.target.value) }))}
                  placeholder="Ex: 2"
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
              <label className="grid gap-2">
                <FieldLabel label="Etage" />
                <input
                  type="number"
                  value={form.etage ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      etage: event.target.value ? Number(event.target.value) : null,
                    }))
                  }
                  placeholder="Ex: 1"
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <FieldLabel label="Statut" required />
                <select
                  value={form.statut}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, statut: event.target.value as BienStatut }))
                  }
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                >
                  {statuts.map((statut) => (
                    <option key={statut} value={statut}>
                      {statut}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5">
                <span className="text-sm font-medium text-slate-700">En vedette</span>
                <Switch
                  checked={form.en_vedette ?? false}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, en_vedette: checked }))}
                  className="data-[state=checked]:bg-[#0D354E]"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Equipements
            </h3>
            <label className="grid gap-2">
              <FieldLabel label="Ã‰quipements (une ligne par item)" />
              <textarea
                value={equipementsText}
                onChange={(event) => setEquipementsText(event.target.value)}
                rows={5}
                placeholder="Ex: Piscine"
                className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
              />
            </label>
          </section>

          <section className="space-y-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Images
            </h3>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <Upload className="h-6 w-6 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-700">Glisser-deposer ou cliquer</p>
              <p className="mt-1 text-xs text-slate-400">PNG, JPG ou WEBP</p>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(event) => handleFilesSelected(event.target.files)}
              />
            </label>

            {(editingBien?.images?.length || newImagePreviews.length) > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {editingBien?.images?.map((image, index) => {
                  const isFirst = index === 0;
                  const isLast = index === (editingBien.images?.length ?? 0) - 1;

                  return (
                  <div
                    key={`existing-${image.id}`}
                    draggable
                    onDragStart={(event) => {
                      setDraggingExistingId(image.id);
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(image.id));
                    }}
                    onDragEnd={() => setDraggingExistingId(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const sourceId = draggingExistingId ?? Number(event.dataTransfer.getData('text/plain'));
                      if (!Number.isNaN(sourceId)) {
                        void handleReorderExistingImages(sourceId, image.id);
                      }
                    }}
                    className={`relative overflow-hidden rounded-xl border border-slate-200 ${
                      draggingExistingId === image.id ? 'ring-2 ring-[#7A9E9F]/60' : ''
                    }`}
                    title="Glisser pour reordonner"
                  >
                    <img
                      src={resolveAssetUrl(image.url)}
                      alt={editingBien.titre}
                      className="h-24 w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      Existant
                    </span>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveExistingImage(image.id, -1)}
                        disabled={isFirst || reorderingImages}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        title="Monter"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExistingImage(image.id, 1)}
                        disabled={isLast || reorderingImages}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        title="Descendre"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={deletingImageIds.includes(image.id)}
                      onClick={() => void handleDeleteExistingImage(image.id)}
                      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      title="Supprimer"
                    >
                      {deletingImageIds.includes(image.id) ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
                })}

                {newImagePreviews.map((preview, index) => {
                  const isFirst = index === 0;
                  const isLast = index === newImagePreviews.length - 1;

                  return (
                  <div
                    key={preview.id}
                    draggable
                    onDragStart={(event) => {
                      setDraggingPreviewId(preview.id);
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', preview.id);
                    }}
                    onDragEnd={() => setDraggingPreviewId(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const sourceId = draggingPreviewId ?? event.dataTransfer.getData('text/plain');
                      if (sourceId) {
                        handleReorderNewPreviews(sourceId, preview.id);
                      }
                    }}
                    className={`relative overflow-hidden rounded-xl border border-slate-200 ${
                      draggingPreviewId === preview.id ? 'ring-2 ring-[#7A9E9F]/60' : ''
                    }`}
                    title="Glisser pour reordonner"
                  >
                    <img src={preview.url} alt={preview.file.name} className="h-24 w-full object-cover" />
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveNewPreview(preview.id, -1)}
                        disabled={isFirst}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        title="Monter"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveNewPreview(preview.id, 1)}
                        disabled={isLast}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        title="Descendre"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewPreview(preview.id)}
                      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
                })}
              </div>
            )}

            {editingBien?.images?.length && newImagePreviews.length > 0 && (
              <label className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-700">Remplacer les images existantes</p>
                  <p className="text-xs text-slate-400">
                    Les anciennes images seront supprimees a l&apos;enregistrement.
                  </p>
                </div>
                <Switch
                  checked={replaceExistingImages}
                  onCheckedChange={(checked) => setReplaceExistingImages(checked)}
                  className="data-[state=checked]:bg-[#0D354E]"
                />
              </label>
            )}

            {(editingBien?.images?.length || newImagePreviews.length) > 1 && (
              <p className="text-xs text-slate-400">
                Astuce: glissez les cartes pour reordonner. L&apos;image en premiere position sera utilisee
                comme image principale.
              </p>
            )}

            {reorderingImages && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Spinner className="h-3 w-3" />
                Enregistrement de l&apos;ordre...
              </div>
            )}
          </section>
        </form>
      </AdminDrawer>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => void handleDelete()}
        title="Supprimer ce bien ?"
        description="Cette action est irreversible. Le bien sera definitivement supprime."
        confirmLabel="Supprimer"
        danger
      />
    </div>
  );
}
