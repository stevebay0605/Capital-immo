import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Settings2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PageHeader from '@/components/admin/PageHeader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
import {
  clearConfigurationsCache,
  createConfiguration,
  deleteConfiguration,
  getConfigurations,
  updateConfiguration,
  type ConfigurationPayload,
} from '../../api/configurations';
import type { ApiConfiguration } from '../../api/types';

type ConfigurationDraft = {
  value: string;
  type: ConfigurationPayload['type'];
  label: string;
};

const emptyCreateForm: ConfigurationPayload = {
  key: '',
  value: '',
  type: 'string',
  group: 'general',
  label: '',
};

const serializeConfigValue = (value: unknown, type: ConfigurationPayload['type']) => {
  if (value === null || value === undefined) return '';
  if (type === 'json' || type === 'array') {
    try {
      return JSON.stringify(typeof value === 'string' ? JSON.parse(value) : value, null, 2);
    } catch {
      return String(value);
    }
  }
  if (type === 'boolean') {
    return value === true || value === 'true' || value === 1 || value === '1' ? 'true' : 'false';
  }
  return String(value);
};

const parseConfigValue = (value: string, type: ConfigurationPayload['type']) => {
  if (type === 'json' || type === 'array') {
    return JSON.parse(value);
  }
  if (type === 'integer' || type === 'float') {
    return Number(value);
  }
  if (type === 'boolean') {
    return value === 'true' || value === '1';
  }
  return value;
};

export default function AdminConfigurations() {
  const [configs, setConfigs] = useState<ApiConfiguration[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ConfigurationDraft>>({});
  const [loading, setLoading] = useState(true);
  const [savingGroup, setSavingGroup] = useState<string | null>(null);
  const [savingCreate, setSavingCreate] = useState(false);
  const [createForm, setCreateForm] = useState<ConfigurationPayload>(emptyCreateForm);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const data = await getConfigurations();
      setConfigs(data);
      setDrafts(
        Object.fromEntries(
          data.map((config) => [
            config.key,
            {
              value: serializeConfigValue(config.value, config.type),
              type: config.type,
              label: config.label,
            },
          ])
        )
      );
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadConfigs();
  }, []);

  const groupedConfigs = useMemo(() => {
    return configs.reduce<Record<string, ApiConfiguration[]>>((groups, config) => {
      const key = config.group || 'general';
      groups[key] = groups[key] ? [...groups[key], config] : [config];
      return groups;
    }, {});
  }, [configs]);

  const groupEntries = useMemo(() => Object.entries(groupedConfigs), [groupedConfigs]);

  const updateDraft = (key: string, patch: Partial<ConfigurationDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...patch,
      },
    }));
  };

  const handleSaveGroup = async (group: string) => {
    const groupConfigs = groupedConfigs[group] ?? [];
    if (groupConfigs.length === 0) return;

    setSavingGroup(group);

    try {
      await Promise.all(
        groupConfigs.map((config) =>
          updateConfiguration(config.key, {
            label: drafts[config.key]?.label ?? config.label,
            type: drafts[config.key]?.type ?? config.type,
            value: parseConfigValue(
              drafts[config.key]?.value ?? serializeConfigValue(config.value, config.type),
              drafts[config.key]?.type ?? config.type
            ),
          })
        )
      );
      toast.success('Configurations mises a jour');
      await loadConfigs();
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setSavingGroup(null);
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingCreate(true);

    try {
      await createConfiguration({
        ...createForm,
        value: parseConfigValue(String(createForm.value ?? ''), createForm.type),
      });
      toast.success('Configuration creee avec succes');
      setCreateForm(emptyCreateForm);
      await loadConfigs();
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setSavingCreate(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteKey) return;

    try {
      await deleteConfiguration(confirmDeleteKey);
      toast.success('Configuration supprimee avec succes');
      setConfirmDeleteKey(null);
      await loadConfigs();
    } catch {
      toast.error('Impossible de supprimer cette configuration');
    }
  };

  const handleClearCache = async () => {
    try {
      await clearConfigurationsCache();
      toast.success('Cache de configuration vide');
    } catch {
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurations"
        subtitle={`${configs.length} configuration(s) reparties sur ${groupEntries.length} groupe(s)`}
        action={
          <button
            type="button"
            onClick={() => void handleClearCache()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Vider le cache
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_420px]">
        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">Parametres applicatifs</h2>
            <p className="text-sm text-slate-500">
              Chaque groupe se sauvegarde independamment pour garder un workflow clair et rapide.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : groupEntries.length > 0 ? (
            <Accordion type="multiple" defaultValue={groupEntries.slice(0, 2).map(([group]) => group)} className="space-y-4">
              {groupEntries.map(([group, items]) => (
                <AccordionItem
                  key={group}
                  value={group}
                  className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/40 px-5"
                >
                  <AccordionTrigger className="py-5 no-underline hover:no-underline">
                    <div className="text-left">
                      <p className="text-base font-semibold capitalize text-slate-800">{group}</p>
                      <p className="text-xs text-slate-500">{items.length} element(s)</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="space-y-4">
                      {items.map((config) => {
                        const draft = drafts[config.key];
                        const isStructured = draft?.type === 'json' || draft?.type === 'array';

                        return (
                          <div key={config.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{config.label}</p>
                                <p className="mt-1 text-xs text-slate-500">{config.key}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteKey(config.key)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
                              <input
                                value={draft?.label ?? config.label}
                                onChange={(event) => updateDraft(config.key, { label: event.target.value })}
                                placeholder="Label"
                                className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                              />
                              <select
                                value={draft?.type ?? config.type}
                                onChange={(event) =>
                                  updateDraft(config.key, {
                                    type: event.target.value as ConfigurationPayload['type'],
                                  })
                                }
                                className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                              >
                                <option value="string">string</option>
                                <option value="integer">integer</option>
                                <option value="float">float</option>
                                <option value="boolean">boolean</option>
                                <option value="json">json</option>
                                <option value="array">array</option>
                              </select>
                            </div>

                            {isStructured ? (
                              <textarea
                                value={draft?.value ?? ''}
                                onChange={(event) => updateDraft(config.key, { value: event.target.value })}
                                rows={6}
                                className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                              />
                            ) : (
                              <input
                                value={draft?.value ?? ''}
                                onChange={(event) => updateDraft(config.key, { value: event.target.value })}
                                className="mt-4 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => void handleSaveGroup(group)}
                        disabled={savingGroup === group}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90 disabled:opacity-70"
                      >
                        {savingGroup === group ? 'Enregistrement...' : 'Enregistrer le groupe'}
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyState
              icon={Settings2}
              title="Aucune configuration"
              description="Cree une premiere configuration pour commencer a parametrer l application."
            />
          )}
        </section>

        <aside className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">Nouvelle configuration</h2>
            <p className="text-sm text-slate-500">
              Ajoute un nouveau parametre avec sa cle, son type et son groupe de rattachement.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <input
              value={createForm.key}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, key: event.target.value }))}
              placeholder="Cle"
              required
              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
            <input
              value={createForm.label}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, label: event.target.value }))}
              placeholder="Label"
              required
              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={createForm.group}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, group: event.target.value }))}
                placeholder="Groupe"
                required
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
              />
              <select
                value={createForm.type}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    type: event.target.value as ConfigurationPayload['type'],
                  }))
                }
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
              >
                <option value="string">string</option>
                <option value="integer">integer</option>
                <option value="float">float</option>
                <option value="boolean">boolean</option>
                <option value="json">json</option>
                <option value="array">array</option>
              </select>
            </div>
            <textarea
              value={String(createForm.value ?? '')}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, value: event.target.value }))}
              placeholder="Valeur"
              rows={6}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
            />
            <button
              type="submit"
              disabled={savingCreate}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90 disabled:opacity-70"
            >
              <Plus className="h-4 w-4" />
              {savingCreate ? 'Creation...' : 'Ajouter la configuration'}
            </button>
          </form>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDeleteKey !== null}
        onCancel={() => setConfirmDeleteKey(null)}
        onConfirm={handleDelete}
        title="Supprimer cette configuration ?"
        message="Cette action supprimera definitivement le parametre selectionne."
      />
    </div>
  );
}
