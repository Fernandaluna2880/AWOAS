import { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  CircleDollarSign,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { reservasApi } from '../api/geotourApi';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import {
  formatCurrency,
  formatDate,
  getApiErrorMessage,
  getEstadoClasses,
} from '../utils/format';

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('TODAS');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const cargarReservas = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await reservasApi.listarTodas();
      setReservas(data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible cargar las reservas del sistema.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const filtradas = useMemo(() => {
    const term = search.trim().toLowerCase();

    return reservas.filter((reserva) => {
      const coincideEstado = filtro === 'TODAS' || reserva.estado === filtro;
      const coincideTexto =
        !term ||
        reserva.usuarioNombre.toLowerCase().includes(term) ||
        reserva.destinoNombre.toLowerCase().includes(term) ||
        String(reserva.id).includes(term);

      return coincideEstado && coincideTexto;
    });
  }, [reservas, search, filtro]);

  const estadisticas = useMemo(() => {
    const activas = reservas.filter((reserva) => reserva.estado !== 'CANCELADA');

    return {
      total: reservas.length,
      personas: activas.reduce(
        (total, reserva) => total + Number(reserva.numeroPersonas),
        0
      ),
      ingresos: activas.reduce(
        (total, reserva) => total + Number(reserva.precioTotal),
        0
      ),
      pendientes: reservas.filter((reserva) => reserva.estado === 'PENDIENTE').length,
    };
  }, [reservas]);

  const handleEliminar = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError('');

    try {
      await reservasApi.eliminar(deleteTarget.id);
      setReservas((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'No fue posible eliminar la reserva.')
      );
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-600">
            <ShieldCheck className="h-4 w-4" /> Panel de administracion
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Reservas del sistema
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Vista general de todas las reservas registradas por los usuarios.
          </p>
        </div>

        <button type="button" onClick={cargarReservas} className="btn-secondary">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <CalendarClock className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Reservas
            </p>
            <p className="text-2xl font-extrabold text-slate-900">{estadisticas.total}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <CalendarClock className="h-6 w-6" />
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
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Personas (activas)
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {estadisticas.personas}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CircleDollarSign className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Ingresos estimados
            </p>
            <p className="text-lg font-extrabold text-slate-900">
              {formatCurrency(estadisticas.ingresos)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {error && (
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              className="input pl-10"
              placeholder="Buscar por usuario, destino o numero de reserva..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="input sm:w-56"
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="TODAS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>

        {loading ? (
          <Loader label="Cargando reservas..." />
        ) : filtradas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
            <p className="text-sm font-semibold text-slate-600">
              No se encontraron reservas
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Usuario</th>
                  <th>Destino</th>
                  <th>Fecha</th>
                  <th>Personas</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td className="font-semibold text-slate-500">{reserva.id}</td>
                    <td>
                      <p className="font-semibold text-slate-800">{reserva.usuarioNombre}</p>
                    </td>
                    <td className="text-slate-600">{reserva.destinoNombre}</td>
                    <td className="whitespace-nowrap text-slate-600">
                      {formatDate(reserva.fechaReserva)}
                    </td>
                    <td>{reserva.numeroPersonas}</td>
                    <td className="whitespace-nowrap font-semibold text-brand-700">
                      {formatCurrency(reserva.precioTotal)}
                    </td>
                    <td>
                      <span className={`badge ${getEstadoClasses(reserva.estado)}`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(reserva)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Eliminar reserva"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar reserva"
        message={
          deleteTarget
            ? `Se eliminara la reserva #${deleteTarget.id} de "${deleteTarget.usuarioNombre}" para "${deleteTarget.destinoNombre}".`
            : ''
        }
        confirmLabel="Eliminar reserva"
        loading={deleting}
        onConfirm={handleEliminar}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
