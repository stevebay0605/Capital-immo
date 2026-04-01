import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { staticAssets } from '@/assets';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const target = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin';
      navigate(target, { replace: true });
    }
  }, [user, location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn({ email, password });
      const target = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin';
      navigate(target, { replace: true });
    } catch {
      setError('Identifiants invalides. Merci de réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0D354E] p-8 text-white shadow-[0_28px_80px_rgba(13,53,78,0.28)] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,158,159,0.34),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_25%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <img
                src={staticAssets.logo}
                alt="Capital Immo Group"
                className="h-16 w-auto object-contain"
              />
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-white/72">
                <Sparkles className="h-4 w-4 text-[#7A9E9F]" />
                Back-office premium
              </div>
              <h1 className="mt-6 max-w-lg text-4xl font-bold leading-tight md:text-5xl">
                L'administration reprend désormais les codes du site public.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/74">
                Même univers visuel, même palette et une expérience plus élégante pour gérer
                les biens, les services et les contenus de l'agence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Palette</p>
                <p className="mt-2 text-lg font-semibold">Marine & sauge</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Ressenti</p>
                <p className="mt-2 text-lg font-semibold">Clair & premium</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Usage</p>
                <p className="mt-2 text-lg font-semibold">Gestion fluide</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-panel flex items-center p-6 md:p-8">
          <div className="w-full">
            <span className="admin-eyebrow">Connexion</span>
            <h2 className="mt-5 text-3xl font-bold text-[#0D354E]">Espace administrateur</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Connecte-toi pour piloter l'offre immobilière et les contenus éditoriaux.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="admin-label">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-input pl-11"
                    placeholder="admin@capitalimogroup.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="admin-label">Mot de passe</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input pl-11"
                    placeholder="********"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="admin-primary-btn w-full disabled:opacity-70">
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
