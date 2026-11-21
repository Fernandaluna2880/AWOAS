import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/format';

export default function Login() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ correo: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectParam = new URLSearchParams(location.search).get('redirect');
  const fromPath = location.state?.from?.pathname;
  const target = fromPath || redirectParam || null;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(target || (isAdmin ? '/admin/destinos' : '/destinos'), {
        replace: true,
      });
    }
  }, [isAuthenticated, isAdmin, navigate, target]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const session = await login({
        correo: form.correo.trim(),
        password: form.password,
      });

      const isAdminSession = session?.usuario?.rol === 'ROLE_ADMIN';
      navigate(target || (isAdminSession ? '/admin/destinos' : '/destinos'), {
        replace: true,
      });
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible iniciar sesion. Verifica tus credenciales.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-teal-700 to-slate-900 p-10 text-white lg:flex">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[20px] border-white/10" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-400/20 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-2xl font-extrabold">
              <Compass className="h-8 w-8" /> GeoTour
            </div>
            <h1 className="mt-10 text-3xl font-extrabold leading-tight">
              Tu proximo destino, con el clima a tu favor.
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-50/90">
              Inicia sesion para reservar experiencias, gestionar tus viajes y
              consultar el clima en tiempo real de cada destino.
            </p>
          </div>

          <div className="relative space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-200" /> Autenticacion segura con JWT
            </p>
            <p className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-brand-200" /> Datos climaticos actualizados
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold text-slate-900">Iniciar sesion</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ingresa con tu correo y contrasena para continuar.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <Alert type="error">{error}</Alert>}

            <div>
              <label htmlFor="correo" className="label">
                Correo electronico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  className="input pl-10"
                  placeholder="tu@correo.com"
                  value={form.correo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Contrasena
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input px-10"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Iniciar sesion
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Registrate aqui
            </Link>
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">Cuentas de prueba</p>
            <p className="mt-1">Admin: admin@geotour.com / Admin1234!</p>
            <p>Usuario: usuario@geotour.com / User1234!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
