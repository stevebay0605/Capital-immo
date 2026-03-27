import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
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
    } catch (err) {
      setError('Identifiants invalides. Merci de rÃ©essayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#7A9E9F]">Espace Admin</p>
          <h1 className="text-2xl font-bold mt-2">Connexion sÃ©curisÃ©e</h1>
          <p className="text-white/70 text-sm mt-2">
            Connectez-vous pour gÃ©rer les biens, services et contenus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-white/80">Email</label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <Mail className="h-4 w-4 text-white/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                placeholder="admin@capitalimogroup.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white/80">Mot de passe</label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <Lock className="h-4 w-4 text-white/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                placeholder="********"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#7A9E9F] text-white font-semibold py-2.5 hover:bg-[#7A9E9F]/90 transition disabled:opacity-70"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
