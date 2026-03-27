import { useEffect, useState } from 'react';
import {
  getDashboardActivity,
  getDashboardCharts,
  getDashboardStats,
} from '../../api/dashboard';
import type {
  ApiDashboardActivity,
  ApiDashboardCharts,
  ApiDashboardStats,
} from '../../api/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<ApiDashboardStats | null>(null);
  const [activity, setActivity] = useState<ApiDashboardActivity | null>(null);
  const [charts, setCharts] = useState<ApiDashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
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
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !stats) {
    return <div className="text-slate-500">Chargement du dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0D354E]">Vue d'ensemble</h2>
        <p className="text-sm text-slate-500">
          Suivi en temps rÃ©el des biens, contacts et performances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs uppercase text-slate-400">Biens actifs</p>
          <p className="text-2xl font-bold text-[#0D354E]">{stats.biens.disponibles}</p>
          <p className="text-xs text-slate-500">Total: {stats.biens.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs uppercase text-slate-400">Vendus / rÃ©servÃ©s</p>
          <p className="text-2xl font-bold text-[#0D354E]">
            {stats.biens.vendus + stats.biens.reserves}
          </p>
          <p className="text-xs text-slate-500">En vedette: {stats.biens.en_vedette}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs uppercase text-slate-400">Contacts</p>
          <p className="text-2xl font-bold text-[#0D354E]">{stats.contacts.total}</p>
          <p className="text-xs text-slate-500">Non lus: {stats.contacts.non_lus}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs uppercase text-slate-400">TÃ©moignages</p>
          <p className="text-2xl font-bold text-[#0D354E]">{stats.temoignages.total}</p>
          <p className="text-xs text-slate-500">Actifs: {stats.temoignages.actifs}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs uppercase text-slate-400">Ã‰quipe</p>
          <p className="text-2xl font-bold text-[#0D354E]">{stats.equipe.total}</p>
          <p className="text-xs text-slate-500">Actifs: {stats.equipe.actifs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-[#0D354E] mb-3">ActivitÃ© rÃ©cente</h3>
          <div className="space-y-2 text-sm text-slate-600">
            {activity?.derniers_biens?.map((bien) => (
              <div key={bien.id} className="flex items-center justify-between">
                <span className="truncate">{bien.titre}</span>
                <span className="text-xs text-slate-400">{bien.transaction}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-[#0D354E] mb-3">Contacts rÃ©cents</h3>
          <div className="space-y-2 text-sm text-slate-600">
            {activity?.derniers_contacts?.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between">
                <span className="truncate">{contact.nom}</span>
                <span className="text-xs text-slate-400">{contact.objet}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-[#0D354E] mb-3">Biens populaires</h3>
          <div className="space-y-2 text-sm text-slate-600">
            {activity?.biens_populaires?.map((bien) => (
              <div key={bien.id} className="flex items-center justify-between">
                <span className="truncate">{bien.titre}</span>
                <span className="text-xs text-slate-400">{bien.vue_count ?? 0} vues</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {charts && (
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-[#0D354E] mb-4">Tendances mensuelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
            <div>
              <p className="font-medium text-slate-700 mb-2">Biens par mois</p>
              <div className="space-y-1">
                {charts.biens_par_mois.map((item) => (
                  <div key={item.mois} className="flex justify-between">
                    <span>{item.mois}</span>
                    <span className="text-slate-500">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-700 mb-2">Contacts par mois</p>
              <div className="space-y-1">
                {charts.contacts_par_mois.map((item) => (
                  <div key={item.mois} className="flex justify-between">
                    <span>{item.mois}</span>
                    <span className="text-slate-500">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
