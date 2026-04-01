import { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, EyeOff, MailSearch, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type DataTableColumn } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminDrawer from '@/components/admin/AdminDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
import {
  deleteContact,
  getContacts,
  markContactRead,
  markContactUnread,
  updateContact,
  type ContactsQueryParams,
} from '../../api/contacts';
import type { ApiContact } from '../../api/types';

type ReadFilter = 'all' | 'read' | 'unread';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ApiContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [selectedContact, setSelectedContact] = useState<ApiContact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const queryParams = useMemo<ContactsQueryParams>(
    () => ({
      is_read: readFilter === 'all' ? undefined : readFilter === 'read',
      per_page: 1000,
    }),
    [readFilter]
  );

  const loadContacts = async (params: ContactsQueryParams = queryParams) => {
    setLoading(true);
    try {
      const data = await getContacts(params);
      setContacts(data);
      return data;
    } catch {
      toast.error('Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContacts(queryParams);
  }, [queryParams]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      if (!search.trim()) return true;

      return [
        contact.nom,
        contact.email ?? '',
        contact.telephone,
        contact.objet,
        contact.message,
        contact.reference_bien ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [contacts, search]);

  const syncSelectedContact = (data: ApiContact[], contactId: number | null) => {
    if (!contactId) return;

    const nextContact = data.find((contact) => contact.id === contactId) ?? null;
    setSelectedContact(nextContact);
    setNotes(nextContact?.notes ?? '');
    setDrawerOpen(Boolean(nextContact));
  };

  const openContact = (contact: ApiContact) => {
    setSelectedContact(contact);
    setNotes(contact.notes ?? '');
    setDrawerOpen(true);
  };

  const handleToggleRead = async (contact: ApiContact) => {
    try {
      if (contact.is_read) {
        await markContactUnread(contact.id);
        toast.success('Contact marque comme non lu');
      } else {
        await markContactRead(contact.id);
        toast.success('Contact marque comme lu');
      }

      const data = await loadContacts(queryParams);
      syncSelectedContact(data, selectedContact?.id ?? contact.id);
    } catch {
      toast.error('Une erreur est survenue');
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await deleteContact(confirmDeleteId);
      toast.success('Contact supprime avec succes');
      setConfirmDeleteId(null);

      if (selectedContact?.id === confirmDeleteId) {
        setSelectedContact(null);
        setDrawerOpen(false);
      }

      await loadContacts(queryParams);
    } catch {
      toast.error('Impossible de supprimer ce contact');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedContact) return;

    setSavingNotes(true);

    try {
      const updated = await updateContact(selectedContact.id, { notes });
      toast.success('Notes enregistrees');
      setSelectedContact(updated);
      await loadContacts(queryParams);
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setSavingNotes(false);
    }
  };

  const columns = useMemo<DataTableColumn<ApiContact>[]>(
    () => [
      {
        key: 'nom',
        header: 'Nom',
        render: (contact) => (
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7A9E9F]/15 text-sm font-semibold text-[#0D354E]">
              {contact.nom.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">{contact.nom}</p>
              <p className="truncate text-xs text-slate-500">{contact.email ?? 'Sans email'}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'telephone',
        header: 'Telephone',
        render: (contact) => <span className="text-sm text-slate-600">{contact.telephone}</span>,
      },
      {
        key: 'objet',
        header: 'Objet',
        render: (contact) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-700">{contact.objet}</p>
            <p className="truncate text-xs text-slate-500">{contact.reference_bien ?? 'Sans reference bien'}</p>
          </div>
        ),
      },
      {
        key: 'message',
        header: 'Message',
        render: (contact) => (
          <p className="max-w-[280px] truncate text-sm text-slate-500">{contact.message}</p>
        ),
      },
      {
        key: 'date',
        header: 'Date',
        render: (contact) => (
          <span className="text-sm text-slate-500">
            {contact.created_at
              ? formatDistanceToNow(new Date(contact.created_at), { addSuffix: true, locale: fr })
              : 'recent'}
          </span>
        ),
      },
      {
        key: 'statut',
        header: 'Statut',
        render: (contact) => <StatusBadge status={contact.is_read ? 'lu' : 'non-lu'} />,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (contact) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleToggleRead(contact)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              title={contact.is_read ? 'Marquer non lu' : 'Marquer lu'}
            >
              {contact.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeleteId(contact.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [selectedContact?.id]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        subtitle={`${filteredContacts.length} demande(s) affichee(s), ${contacts.filter((contact) => !contact.is_read).length} non lue(s)`}
      />

      <div className="grid gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_220px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un nom, un objet ou un message..."
            className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
          />
        </label>

        <select
          value={readFilter}
          onChange={(event) => setReadFilter(event.target.value as ReadFilter)}
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
        >
          <option value="all">Tous les statuts</option>
          <option value="unread">Non lus</option>
          <option value="read">Lus</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredContacts}
        loading={loading}
        rowKey={(contact) => contact.id}
        onRowClick={openContact}
        rowClassName={(contact) =>
          contact.is_read
            ? ''
            : 'bg-blue-50/80 hover:!bg-blue-50 border-l-[3px] border-l-[#7A9E9F]'
        }
        emptyState={
          <EmptyState
            icon={MailSearch}
            title="Aucun contact"
            description="Les nouvelles demandes apparaitront ici des qu un client prendra contact."
          />
        }
      />

      <AdminDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedContact(null);
        }}
        title={selectedContact?.nom ?? 'Detail du contact'}
        description="Lecture du message et suivi interne de la demande."
        footer={
          selectedContact ? (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => void handleToggleRead(selectedContact)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {selectedContact.is_read ? 'Marquer non lu' : 'Marquer lu'}
              </button>
              <button
                type="button"
                onClick={() => void handleSaveNotes()}
                disabled={savingNotes}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0D354E] px-4 text-sm font-medium text-white hover:bg-[#0D354E]/90 disabled:opacity-70"
              >
                {savingNotes ? 'Enregistrement...' : 'Enregistrer les notes'}
              </button>
            </div>
          ) : null
        }
      >
        {selectedContact && (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Coordonnees</p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">Email :</span> {selectedContact.email ?? 'Sans email'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Telephone :</span> {selectedContact.telephone}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Statut :</span>{' '}
                    {selectedContact.is_read ? 'Lu' : 'Non lu'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Demande</p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">Objet :</span> {selectedContact.objet}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Reference :</span>{' '}
                    {selectedContact.reference_bien ?? 'Non renseignee'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Recu :</span>{' '}
                    {selectedContact.created_at
                      ? formatDistanceToNow(new Date(selectedContact.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : 'recent'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Message</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {selectedContact.message}
              </p>
            </section>

            <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Notes internes</p>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={6}
                placeholder="Ajouter un suivi, un rappel ou un commentaire interne..."
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 focus:border-[#7A9E9F] focus:outline-none focus:ring-2 focus:ring-[#7A9E9F]/20"
              />
            </section>
          </div>
        )}
      </AdminDrawer>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer ce contact ?"
        message="Cette action supprimera definitivement la demande selectionnee."
      />
    </div>
  );
}
