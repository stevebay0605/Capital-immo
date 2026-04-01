import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, Home, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '@/components/admin/PageHeader';
import StatsCard from '@/components/admin/StatsCard';
import TypeBadge from '@/components/admin/TypeBadge';
import EmptyState from '@/components/admin/EmptyState';
import { getDashboardActivity, getDashboardCharts, getDashboardStats } from '../../api/dashboard';
import type { ApiDashboardActivity, ApiDashboardCharts, ApiDashboardStats } from '../../api/types';
import { formatPrix } from '../../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState<ApiDashboardStats | null>(null);
  const [activity, setActivity] = useState<ApiDashboardActivity | null>(null);
  const [charts, setCharts] = useState<ApiDashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [statsData, activityData, chartsData] = await Promise.all([
          getDashboardStats(),
          getDashboardActivity(),
          getDashboardCharts(),
        ]);

        if (isMounted) {
          setStats(statsData);
          setActivity(activityData);
          setCharts(chartsData);
        }
      } catch {
        toast.error('Impossible de charger le dashboard');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const latestBiens = (activity?.derniers_biens ?? []).slice(0, 5);
  const latestContacts = (activity?.derniers_contacts ?? []).slice(0, 5);
  const biensPerMonth = charts?.biens_par_mois ?? [];
  const contactsPerMonth = charts?.contacts_par_mois ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Vue d'ensemble de l'activite immobiliere et commerciale."
      />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          icon={Home}
          label="Biens disponibles"
          value={stats?.biens.disponibles ?? 0}
          trend={`${stats?.biens.total ?? 0}`}
          trendLabel="au total"
          trendDirection="up"
          colorClass="bg-[#0D354E]/10 text-[#0D354E]"
          loading={loading}
        />
        <StatsCard
          icon={MessageSquare}
          label="Contacts ce mois"
          value={stats?.contacts.ce_mois ?? 0}
          trend={`${stats?.contacts.non_lus ?? 0}`}
          trendLabel="non lus"
          trendDirection="up"
          colorClass="bg-[#7A9E9F]/10 text-[#7A9E9F]"
          loading={loading}
        />
        <StatsCard
          icon={CheckCircle}
          label="Biens vendus"
          value={stats?.biens.vendus ?? 0}
          trend={`${stats?.biens.reserves ?? 0}`}
          trendLabel="reserves"
          trendDirection="up"
          colorClass="bg-emerald-50 text-emerald-600"
          loading={loading}
        />
        <StatsCard
          icon={Star}
          label="En vedette"
          value={stats?.biens.en_vedette ?? 0}
          trend={`${stats?.biens.vues_total ?? 0}`}
          trendLabel="vues totales"
          trendDirection="up"
          colorClass="bg-amber-50 text-amber-600"
          loading={loading}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-800">Biens ajoutes par mois</h3>
            <p className="text-[13px] text-slate-400">Evolution du catalogue immobilier.</p>
          </div>
          <div className="h-[220px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={biensPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="mois"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
                    }}
                  />
                  <Bar dataKey="total" fill="#0D354E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-800">Contacts par mois</h3>
            <p className="text-[13px] text-slate-400">Suivi des demandes commerciales.</p>
          </div>
          <div className="h-[220px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contactsPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="mois"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#7A9E9F"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">Derniers biens ajoutes</h3>
            <Link to="/admin/biens" className="text-sm font-medium text-[#7A9E9F] hover:text-[#0D354E]">
              Voir tous -&gt;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex animate-pulse items-center gap-3 py-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-200" />
                  <div className="min-w-0 flex-1">
                    <div className="h-3 w-36 rounded bg-slate-200" />
                    <div className="mt-2 h-2 w-20 rounded bg-slate-100" />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : latestBiens.length > 0 ? (
            <div>
              {latestBiens.map((bien) => (
                <div key={bien.id} className="flex items-center gap-3 border-b border-slate-50 py-3 last:border-0">
                  <img
                    src={bien.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120'}
                    alt={bien.titre}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{bien.titre}</p>
                    <p className="truncate text-xs text-slate-400">{bien.reference || 'Sans reference'}</p>
                  </div>
                  <TypeBadge type={bien.type} />
                  <p className="text-sm font-semibold text-slate-800">{formatPrix(bien.prix, bien.transaction)}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Home}
              title="Aucun bien trouve"
              description="Ajoutez votre premier bien au catalogue."
            />
          )}
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">Derniers contacts</h3>
            <Link to="/admin/contacts" className="text-sm font-medium text-[#7A9E9F] hover:text-[#0D354E]">
              Voir tous -&gt;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex animate-pulse items-center gap-3 py-3">
                  <div className="h-9 w-9 rounded-full bg-slate-200" />
                  <div className="min-w-0 flex-1">
                    <div className="h-3 w-28 rounded bg-slate-200" />
                    <div className="mt-2 h-2 w-32 rounded bg-slate-100" />
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          ) : latestContacts.length > 0 ? (
            <div>
              {latestContacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 border-b border-slate-50 py-3 last:border-0">
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7A9E9F]/15 text-sm font-semibold text-[#0D354E]">
                      {contact.nom.slice(0, 1).toUpperCase()}
                    </div>
                    {!contact.is_read && (
                      <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{contact.nom}</p>
                    <p className="truncate text-xs text-slate-400">{contact.objet}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {contact.created_at
                      ? formatDistanceToNow(new Date(contact.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : 'recent'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Aucun contact"
              description="Les demandes clients apparaitront ici."
            />
          )}
        </div>
      </section>
    </div>
  );
}
