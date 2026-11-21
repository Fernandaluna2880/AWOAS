import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  CalendarX2,
  CircleDollarSign,
  Clock3,
  Compass,
  MessageSquarePlus,
  RefreshCw,
  Ticket,
  Users,
  Wallet,
} from 'lucide-react';
import { reservasApi } from '../api/geotourApi';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import ReviewModal from '../components/ReviewModal';
import {
  formatCurrency,
  formatDate,
  getApiErrorMessage,
  getEstadoClasses,
} from '../utils/format';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('TODAS');

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewedDestinos, setReviewedDestinos] = useState([]);

  const cargarReservas = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await reservasApi.misReservas();
      setReservas(data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible cargar tus reservas. Intenta nuevamente.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const reservasFiltradas = useMemo(
    () =>
      filtro === 'TODAS'
        ? reservas
        : reservas.filter((reserva) => reserva.estado === filtro),
    [reservas, filtro]
  );

  const estadisticas = useMemo(() => {
    const activas = reservas.filter((reserva) => reserva.estado !== 'CANCELADA');

    return {
      total: reservas.length,
      pendientes: reservas.filter((reserva) => reserva.estado === 'PENDIENTE').length,
      invertido: activas.reduce(
        (total, reserva) => total + Number(reserva.precioTotal),
        0
      ),
    };
  }, [reservas]);

  const handleCancelar = async () => {
    if (!cancelTarget) return;

    setCancelling(true);
    setError('');

    try {
      const { data } = await reservasApi.cancelar(cancelTarget.id);
      setReservas((current) =>
        current.map((reserva) => (reserva.id === data.id ? data : reserva))
      );
      setCancelTarget(null);
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'No fue posible cancelar la reserva.')
      );
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSaved = (resena, reserva) => {
    setReviewedDestinos((current) =>
      current.includes(reserva.destinoId) ? current : [...current, reserva.destinoId]
    );
  };

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-600">
            <Ticket className="h-4 w-4" /> Historial de viajes
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Mis reservas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Consulta el estado de tus reservas, cancela cuando lo necesites y comparte
            tu experiencia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="input w-auto"
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="TODAS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
          <button type="button" onClick={cargarReservas} className="btn-secondary">
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Ticket className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Reservas totales
            </p>
            <p className="text-2xl font-extrabold text-slate-900">{estadisticas.total}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock3 className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Pendientes
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {estadisticas.pendientes}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CircleDollarSign className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total invertido
            </p>
            <p className="text-xl font-extrabold text-slate-900">
              {formatCurrency(estadisticas.invertido)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        {loading ? (
          <Loader label="Cargando tus reservas..." />
        ) : reservasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <CalendarX2 className="h-12 w-12 text-slate-300" />
            <p className="text-lg font-bold text-slate-700">
              {reservas.length === 0
                ? 'Aun no tienes reservas'
                : 'No hay reservas con este estado'}
            </p>
            <p className="max-w-sm text-sm text-slate-500">
              Explora los destinos disponibles y asegura tu proxima experiencia.
            </p>
            <Link to="/destinos" className="btn-primary">
              <Compass className="h-4 w-4" /> Explorar destinos
            </Link>
          </div>
        ) : (
          reservasFiltradas.map((reserva) => {
            const cancelada = reserva.estado === 'CANCELADA';
            const yaResenada = reviewedDestinos.includes(reserva.destinoId);

            return (
              <article
                key={reserva.id}
                className={`card overflow-hidden ${cancelada ? 'opacity-75' : ''}`}
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-extrabold text-slate-900">
                        {reserva.destinoNombre}
                      </h2>
                      <span className={`badge ${getEstadoClasses(reserva.estado)}`}>
                        {reserva.estado}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-brand-600" />
                        {formatDate(reserva.fechaReserva)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-brand-600" />
                        {reserva.numeroPersonas} persona(s)
                      </p>
                      <p className="flex items-center gap-2 font-semibold text-slate-800">
                        <Wallet className="h-4 w-4 text-brand-600" />
                        {formatCurrency(reserva.precioTotal)}
                      </p>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      Reserva #{reserva.id} - Titular: {reserva.usuarioNombre}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {!cancelada && (
                      <>
                        <button
                          type="button"
                          onClick={() => setReviewTarget(reserva)}
                          className="btn-secondary text-xs"
                          disabled={yaResenada}
                        >
                          <MessageSquarePlus className="h-4 w-4" />
                          {yaResenada ? 'Resena enviada' : 'Escribir resena'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelTarget(reserva)}
                          className="btn-danger text-xs"
                        >
                          <CalendarX2 className="h-4 w-4" /> Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancelar reserva"
        message={
          cancelTarget
            ? `Vas a cancelar tu reserva para "${cancelTarget.destinoNombre}" del ${formatDate(
                cancelTarget.fechaReserva
              )}. Esta accion no se puede revertir.`
            : ''
        }
        confirmLabel="Si, cancelar"
        loading={cancelling}
        onConfirm={handleCancelar}
        onClose={() => setCancelTarget(null)}
      />

      <ReviewModal
        open={Boolean(reviewTarget)}
        reserva={reviewTarget}
        onClose={() => setReviewTarget(null)}
        onSaved={(resena) => handleReviewSaved(resena, reviewTarget)}
      />
    </div>
  );
}
