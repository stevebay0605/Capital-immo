import { useEffect, useState } from 'react';
import {
  bulkUpdateConfigurations,
  createConfiguration,
  deleteConfiguration,
  getConfigurations,
  updateConfiguration,
  type ConfigurationPayload,
} from '../../api/configurations';
import type { ApiConfiguration } from '../../api/types';

const emptyForm: ConfigurationPayload = {
  key: '',
  value: '',
  type: 'string',
  group: 'general',
  label: '',
};

export default function AdminConfigurations() {
  const [configs, setConfigs] = useState<ApiConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState<ConfigurationPayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const data = await getConfigurations();
      setConfigs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadConfigs();
  }, []);

  const resetForm = () => {
    setEditingKey(null);
    setForm(emptyForm);
  };

  const handleEdit = (config: ApiConfiguration) => {
    setEditingKey(config.key);
    setForm({
      key: config.key,
      value: config.value ?? '',
      type: config.type,
      group: config.group,
      label: config.label,
    });
  };

  const parseValue = (value: string, type: ConfigurationPayload['type']) => {
    if (type === 'json' || type === 'array') {
      return JSON.parse(value);
    }
    if (type === 'integer') return Number(value);
    if (type === 'float') return Number(value);
    if (type === 'boolean') return value === 'true' || value === '1';
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const parsedValue = parseValue(String(form.value ?? ''), form.type);

      if (editingKey) {
        await updateConfiguration(editingKey, {
          value: parsedValue,
          type: form.type,
          group: form.group,
          label: form.label,
        });
      } else {
        await createConfiguration({
          ...form,
          value: parsedValue,
        });
      }

      resetForm();
      await loadConfigs();
    } catch (err) {
      setError('Valeur invalide ou erreur lors de la sauvegarde.');
    }
  };

  const handleDelete = async (key: string) => {
    if (!window.confirm('Supprimer cette configuration ?')) return;
    await deleteConfiguration(key);
    await loadConfigs();
  };

  const handleBulk = async () => {
    const configsToUpdate = configs.map((config) => ({
      key: config.key,
      value: config.value,
      type: config.type,
    }));
    await bulkUpdateConfigurations(configsToUpdate);
    await loadConfigs();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0D354E]">Configurations</h2>
        <p className="text-sm text-slate-500">GÃ©rez les paramÃ¨tres de l'application.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-[#0D354E] mb-4">
          {editingKey ? 'Modifier une configuration' : 'Nouvelle configuration'}
        </h3>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="ClÃ©"
            value={form.key}
            onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))}
            disabled={!!editingKey}
            required
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Label"
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Groupe"
            value={form.group}
            onChange={(e) => setForm((prev) => ({ ...prev, group: e.target.value }))}
            required
          />
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, type: e.target.value as ConfigurationPayload['type'] }))
            }
          >
            <option value="string">string</option>
            <option value="integer">integer</option>
            <option value="float">float</option>
            <option value="boolean">boolean</option>
            <option value="json">json</option>
            <option value="array">array</option>
          </select>
          <textarea
            className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[90px]"
            placeholder="Valeur"
            value={String(form.value ?? '')}
            onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
            required
          />
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0D354E] text-white text-sm font-semibold hover:bg-[#0D354E]/90"
            >
              {editingKey ? 'Mettre Ã  jour' : 'CrÃ©er'}
            </button>
            {editingKey && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm"
              >
                Annuler
              </button>
            )}
            <button
              type="button"
              onClick={handleBulk}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm"
            >
              Bulk update
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">ClÃ©</th>
                  <th className="py-2">Label</th>
                  <th className="py-2">Groupe</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((config) => (
                  <tr key={config.id} className="border-t border-slate-100">
                    <td className="py-2">{config.key}</td>
                    <td className="py-2">{config.label}</td>
                    <td className="py-2">{config.group}</td>
                    <td className="py-2">{config.type}</td>
                    <td className="py-2 flex flex-wrap gap-2">
                      <button
                        className="text-xs px-2 py-1 rounded border border-slate-200"
                        onClick={() => handleEdit(config)}
                      >
                        Modifier
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-red-200 text-red-500"
                        onClick={() => handleDelete(config.key)}
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
