import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  UserPlus,
  UserRound,
} from 'lucide-react';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/format';

const initialForm = {
  nombreCompleto: '',
  correo: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/destinos', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        nombreCompleto: form.nombreCompleto.trim(),
        correo: form.correo.trim(),
        password: form.password,
      });

      navigate('/destinos', { replace: true });
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible completar el registro. Verifica los datos.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-teal-800 to-brand-600 p-10 text-white lg:flex">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full border-[20px] border-white/10" />
          <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-brand-400/20 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-2xl font-extrabold">
              <Compass className="h-8 w-8" /> GeoTour
            </div>
            <h1 className="mt-10 text-3xl font-extrabold leading-tight">
              Crea tu cuenta y empieza a explorar.
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-50/90">
              Guarda tus reservas, comparte resenas y planea cada viaje con
              informacion climatologica actualizada.
            </p>
          </div>

          <ul className="relative space-y-2 text-sm text-brand-50/90">
            <li>Reservas con calculo automatico de precio.</li>
            <li>Historial y cancelacion de reservas.</li>
            <li>Clima en tiempo real de cada destino.</li>
          </ul>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold text-slate-900">Crear cuenta</h2>
          <p className="mt-1 text-sm text-slate-500">
            Completa tus datos para registrarte como viajero.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <Alert type="error">{error}</Alert>}

            <div>
              <label htmlFor="nombreCompleto" className="label">
                Nombre completo
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="nombreCompleto"
                  name="nombreCompleto"
                  className="input pl-10"
                  placeholder="Ana Maria Torres"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={150}
                  required
                />
              </div>
            </div>

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

            <div className="grid gap-4 sm:grid-cols-2">
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
                    autoComplete="new-password"
                    className="input px-10"
                    placeholder="Minimo 8 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    maxLength={72}
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

              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirmar contrasena
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="input pl-10"
                    placeholder="Repite tu contrasena"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    minLength={8}
                    maxLength={72}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Registrarme
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
