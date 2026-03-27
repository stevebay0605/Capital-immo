import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Building2,
  Star,
  Users,
  MessageSquare,
  Sliders,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/biens', label: 'Biens', icon: Home },
  { to: '/admin/services', label: 'Services', icon: Building2 },
  { to: '/admin/temoignages', label: 'TÃ©moignages', icon: Star },
  { to: '/admin/equipe', label: 'Ã‰quipe', icon: Users },
  { to: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { to: '/admin/configurations', label: 'Configurations', icon: Sliders },
  { to: '/admin/entreprise', label: 'Entreprise', icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex md:w-64 md:flex-col bg-[#0D354E] text-white">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-lg font-bold">Capital Immo Admin</div>
            <div className="text-xs text-white/70 mt-1">Gestion immobiliÃ¨re</div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              DÃ©connexion
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200">
            <div className="px-4 py-4 md:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-[#0D354E]">Administration</h1>
                <p className="text-xs text-slate-500">
                  ConnectÃ© en tant que {user?.name ?? 'Administrateur'}
                </p>
              </div>
              <div className="md:hidden flex flex-wrap gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin'}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border ${
                          isActive
                            ? 'border-[#0D354E] text-[#0D354E]'
                            : 'border-slate-200 text-slate-500'
                        }`
                      }
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </NavLink>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border border-slate-200 text-slate-500"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sortir
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
