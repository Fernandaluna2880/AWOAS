import { useEffect, useMemo, useState } from 'react';
import {
  Compass,
  DollarSign,
  MapPinned,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { destinosApi } from '../api/geotourApi';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';
import DestinoFormModal from '../components/DestinoFormModal';
import Loader from '../components/Loader';
import { formatCurrency, getApiErrorMessage } from '../utils/format';

export default function AdminDestinos() {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingDestino, setEditingDestino] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const cargarDestinos = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await destinosApi.listar();
      setDestinos(data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'No fue posible cargar los destinos.')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDestinos();
  }, []);

  const filtrados = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return destinos;

    return destinos.filter(
      (destino) =>
        destino.nombre.toLowerCase().includes(term) ||
        destino.descripcion.toLowerCase().includes(term)
    );
  }, [destinos, search]);

  const estadisticas = useMemo(() => {
    const totalCapacidad = destinos.reduce(
      (total, destino) => total + Number(destino.capacidad),
      0
    );

    const precioPromedio =
      destinos.length > 0
        ? destinos.reduce((total, destino) => total + Number(destino.precioBase), 0) /
          destinos.length
        : 0;

    return { total: destinos.length, totalCapacidad, precioPromedio };
  }, [destinos]);

  const abrirCreacion = () => {
    setEditingDestino(null);
    setFormOpen(true);
  };

  const abrirEdicion = (destino) => {
    setEditingDestino(destino);
    setFormOpen(true);
  };

  const handleEliminar = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError('');

    try {
      await destinosApi.eliminar(deleteTarget.id);
      setDestinos((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible eliminar el destino. Puede tener reservas o resenas asociadas.'
        )
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
            <Compass className="h-4 w-4" /> Panel de administracion
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Gestion de destinos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Crea, actualiza y elimina los destinos disponibles en el catalogo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={cargarDestinos} className="btn-secondary">
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
          <button type="button" onClick={abrirCreacion} className="btn-primary">
            <Plus className="h-4 w-4" /> Nuevo destino
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <MapPinned className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Destinos registrados
            </p>
            <p className="text-2xl font-extrabold text-slate-900">{estadisticas.total}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Capacidad total
            </p>
            <p className="text-2xl font-extrabold text-slate-900">
              {estadisticas.totalCapacidad}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Precio promedio
            </p>
            <p className="text-xl font-extrabold text-slate-900">
              {formatCurrency(estadisticas.precioPromedio)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            className="input pl-10"
            placeholder="Buscar destino..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <Loader label="Cargando destinos..." />
        ) : filtrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
            <p className="text-sm font-semibold text-slate-600">
              No se encontraron destinos
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Destino</th>
                  <th>Coordenadas</th>
                  <th>Precio base</th>
                  <th>Capacidad</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((destino) => (
                  <tr key={destino.id}>
                    <td>
                      <p className="font-bold text-slate-800">{destino.nombre}</p>
                      <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-slate-400">
                        {destino.descripcion}
                      </p>
                    </td>
                    <td className="whitespace-nowrap text-xs text-slate-500">
                      {Number(destino.latitud).toFixed(4)}, {Number(destino.longitud).toFixed(4)}
                    </td>
                    <td className="whitespace-nowrap font-semibold text-brand-700">
                      {formatCurrency(destino.precioBase)}
                    </td>
                    <td className="whitespace-nowrap">{destino.capacidad} personas</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => abrirEdicion(destino)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                          title="Editar destino"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(destino)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Eliminar destino"
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

      <DestinoFormModal
        open={formOpen}
        destino={editingDestino}
        onClose={() => setFormOpen(false)}
        onSaved={cargarDestinos}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar destino"
        message={
          deleteTarget
            ? `Se eliminara el destino "${deleteTarget.nombre}". Si tiene reservas o resenas asociadas la operacion fallara.`
            : ''
        }
        confirmLabel="Eliminar destino"
        loading={deleting}
        onConfirm={handleEliminar}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
