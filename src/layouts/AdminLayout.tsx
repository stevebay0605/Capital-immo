import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  Building2,
  Globe,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  UserCircle2,
  Users2,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { staticAssets } from '@/assets';
import { getContactsStats } from '../api/contacts';
import { useAuth } from '../contexts/AuthContext';

type AdminNavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badgeKey?: 'contacts';
};

type AdminNotification = {
  id: number;
  type: 'contact' | 'bien' | 'info';
  message: string;
  time: string;
  read: boolean;
};

const navGroups: Array<{ label: string; items: AdminNavItem[] }> = [
  {
    label: 'PRINCIPAL',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'CATALOGUE',
    items: [
      { to: '/admin/biens', label: 'Biens', icon: Building2 },
      { to: '/admin/services', label: 'Services', icon: Briefcase },
    ],
  },
  {
    label: 'COMMUNAUTE',
    items: [
      { to: '/admin/temoignages', label: 'Temoignages', icon: MessageSquare },
      { to: '/admin/equipe', label: 'Equipe', icon: Users2 },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [{ to: '/admin/contacts', label: 'Contacts', icon: Bell, badgeKey: 'contacts' }],
  },
  {
    label: 'PARAMETRES',
    items: [
      { to: '/admin/configurations', label: 'Configurations', icon: SlidersHorizontal },
      { to: '/admin/entreprise', label: 'Entreprise', icon: Globe },
    ],
  },
];

const initialNotifications: AdminNotification[] = [
  {
    id: 1,
    type: 'contact',
    message: 'Nouveau contact de Marie K.',
    time: 'Il y a 5 min',
    read: false,
  },
  {
    id: 2,
    type: 'bien',
    message: 'Bien CIG-V-001 marque vendu',
    time: 'Il y a 1h',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    message: 'Mise a jour du catalogue effectuee',
    time: 'Il y a 2h',
    read: true,
  },
];

function SidebarTooltip({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      {children}
      {show && (
        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {label}
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  collapsed,
  desktop,
  unreadContacts,
  onNavigate,
  onLogout,
  onToggleCollapse,
  userName,
  userEmail,
}: {
  collapsed: boolean;
  desktop: boolean;
  unreadContacts: number;
  onNavigate?: () => void;
  onLogout: () => void;
  onToggleCollapse?: () => void;
  userName: string;
  userEmail: string;
}) {
  return (
    <div className="flex h-full flex-col bg-[#0D354E] text-white">
      <div className="flex h-16 flex-shrink-0 items-center border-b border-white/10 px-4">
        {collapsed ? (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white transition-all duration-300">
            CI
          </div>
        ) : (
          <img
            src={staticAssets.logo}
            className="h-9 w-auto object-contain transition-all duration-300"
            alt="Capital Immo Group"
          />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
        <div>
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="mb-1 mt-2 truncate px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {group.label}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <SidebarTooltip key={item.to} label={item.label} show={collapsed}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/admin'}
                        onClick={onNavigate}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          cn(
                            'relative mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150',
                            collapsed && 'justify-center px-0',
                            isActive
                              ? 'border-l-2 border-[#7A9E9F] bg-[#7A9E9F]/20 text-[#7A9E9F]'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          )
                        }
                      >
                        <Icon className="h-[18px] w-[18px] flex-shrink-0" />

                        {!collapsed && (
                          <span className="truncate text-sm transition-all duration-200">{item.label}</span>
                        )}

                        {item.badgeKey === 'contacts' && unreadContacts > 0 && !collapsed && (
                          <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                            {unreadContacts}
                          </span>
                        )}

                        {item.badgeKey === 'contacts' && unreadContacts > 0 && collapsed && (
                          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                        )}
                      </NavLink>
                    </SidebarTooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {desktop && onToggleCollapse && (
        <div className="border-t border-white/10">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex h-10 w-full items-center justify-center text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
            title={collapsed ? 'Agrandir la sidebar' : 'Reduire la sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      <div className="flex-shrink-0 border-t border-white/10 p-3">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7A9E9F] text-sm font-semibold text-white">
            {userName.slice(0, 1).toUpperCase()}
          </div>

          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{userName}</p>
                <p className="truncate text-xs text-white/40">{userEmail}</p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                title="Deconnexion"
                className="flex-shrink-0 text-white/40 transition-colors hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const notifRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem('sidebar_collapsed');
    if (stored !== null) {
      setCollapsed(stored === 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const stats = await getContactsStats();
        if (isMounted) {
          setUnreadContacts(stats.non_lus);
        }
      } catch {
        if (isMounted) {
          setUnreadContacts(0);
        }
      }
    };

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!notifOpen) return;

      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [notifOpen]);

  const activeMeta = useMemo(() => {
    for (const group of navGroups) {
      for (const item of group.items) {
        const isActive =
          item.to === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.to);

        if (isActive) {
          return { parent: group.label, current: item.label };
        }
      }
    }

    return { parent: 'PRINCIPAL', current: 'Dashboard' };
  }, [location.pathname]);

  const hasUnreadNotifications = notifications.some((notification) => !notification.read);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setNotifOpen(false);
  };

  const userName = user?.name ?? 'Administrateur';
  const userEmail = user?.email ?? 'capitalimmo.group';
  const sidebarWidthClass = collapsed ? 'w-[68px]' : 'w-[260px]';
  const contentMarginClass = collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]';

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-barlow text-[#1E293B]">
      <Toaster position="bottom-right" richColors />

      <div className="min-h-screen">
        <aside
          className={cn(
            'fixed left-0 top-0 z-30 hidden h-screen flex-col bg-[#0D354E] transition-all duration-300 ease-in-out lg:flex',
            sidebarWidthClass
          )}
        >
          <SidebarContent
            collapsed={collapsed}
            desktop
            unreadContacts={unreadContacts}
            onLogout={() => void handleLogout()}
            onToggleCollapse={() => setCollapsed((prev) => !prev)}
            userName={userName}
            userEmail={userEmail}
          />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[260px] border-r-0 bg-transparent p-0 sm:max-w-[260px]">
            <SidebarContent
              collapsed={false}
              desktop={false}
              unreadContacts={unreadContacts}
              onNavigate={() => setMobileOpen(false)}
              onLogout={() => void handleLogout()}
              userName={userName}
              userEmail={userEmail}
            />
          </SheetContent>
        </Sheet>

        <div className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${contentMarginClass}`}>
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
            <div className="flex h-[76px] items-center justify-between px-6 md:px-8">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-400">{activeMeta.parent}</span>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-700">{activeMeta.current}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div ref={notifRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setNotifOpen((prev) => !prev)}
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <Bell className="h-[18px] w-[18px]" />
                    {hasUnreadNotifications && (
                      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800">Notifications</p>
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="text-xs text-[#7A9E9F] hover:underline"
                        >
                          Tout marquer lu
                        </button>
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.map((notification) => {
                          const iconConfig =
                            notification.type === 'contact'
                              ? {
                                  icon: MessageSquare,
                                  className: 'bg-[#7A9E9F]/10 text-[#7A9E9F]',
                                }
                              : notification.type === 'bien'
                                ? {
                                    icon: Building2,
                                    className: 'bg-[#0D354E]/10 text-[#0D354E]',
                                  }
                                : {
                                    icon: Info,
                                    className: 'bg-amber-50 text-amber-500',
                                  };

                          const Icon = iconConfig.icon;

                          return (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => handleNotificationClick(notification.id)}
                              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                                notification.read ? 'bg-white' : 'bg-blue-50/40'
                              }`}
                            >
                              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${iconConfig.className}`}>
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-slate-700">{notification.message}</p>
                                <p className="mt-0.5 text-xs text-slate-400">{notification.time}</p>
                              </div>

                              {!notification.read && (
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="border-t border-slate-100 px-4 py-3 text-center">
                        <button type="button" className="text-xs text-[#7A9E9F] hover:underline">
                          Voir toutes les notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-6 w-px bg-slate-200" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left hover:bg-slate-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D354E] text-sm font-semibold text-white">
                        {userName.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-800">{userName}</p>
                        <p className="text-xs text-slate-400">{userEmail}</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 bg-white p-1 shadow-md">
                    <DropdownMenuItem className="rounded-lg text-slate-700">
                      <UserCircle2 className="h-4 w-4" />
                      Mon profil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => void handleLogout()}
                      className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      Deconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 bg-[#F8FAFC] p-6 md:p-8">
            <div key={location.pathname} className="animate-[adminFadeIn_200ms_ease-out]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
