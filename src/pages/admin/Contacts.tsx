import { useEffect, useState } from 'react';
import {
  deleteContact,
  getContacts,
  markContactRead,
  markContactUnread,
  type ContactsQueryParams,
} from '../../api/contacts';
import type { ApiContact } from '../../api/types';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ApiContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContactsQueryParams>({});

  const loadContacts = async (params?: ContactsQueryParams) => {
    setLoading(true);
    try {
      const data = await getContacts(params);
      setContacts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContacts(filter);
  }, [filter]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce contact ?')) return;
    await deleteContact(id);
    await loadContacts(filter);
  };

  const handleMarkRead = async (id: number, isRead: boolean) => {
    if (isRead) {
      await markContactUnread(id);
    } else {
      await markContactRead(id);
    }
    await loadContacts(filter);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D354E]">Gestion des contacts</h2>
        <p className="text-sm text-slate-500">Suivez les demandes clients.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <label className="text-sm text-slate-600">Filtrer</label>
        <select
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={filter.is_read === undefined ? 'all' : filter.is_read ? 'read' : 'unread'}
          onChange={(e) => {
            const value = e.target.value;
            setFilter((prev) => ({
              ...prev,
              is_read: value === 'all' ? undefined : value === 'read',
            }));
          }}
        >
          <option value="all">Tous</option>
          <option value="read">Lus</option>
          <option value="unread">Non lus</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">Nom</th>
                  <th className="py-2">Objet</th>
                  <th className="py-2">TÃ©lÃ©phone</th>
                  <th className="py-2">Statut</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-t border-slate-100 align-top">
                    <td className="py-2 pr-4">
                      <p className="font-medium text-slate-700">{contact.nom}</p>
                      <p className="text-xs text-slate-500">{contact.email ?? '—'}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{contact.message}</p>
                    </td>
                    <td className="py-2">{contact.objet}</td>
                    <td className="py-2">{contact.telephone}</td>
                    <td className="py-2">{contact.is_read ? 'Lu' : 'Non lu'}</td>
                    <td className="py-2 flex flex-wrap gap-2">
                      <button
                        className="text-xs px-2 py-1 rounded border border-slate-200"
                        onClick={() => handleMarkRead(contact.id, contact.is_read)}
                      >
                        {contact.is_read ? 'Marquer non lu' : 'Marquer lu'}
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded border border-red-200 text-red-500"
                        onClick={() => handleDelete(contact.id)}
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
