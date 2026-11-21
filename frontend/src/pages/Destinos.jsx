import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Filter,
  MapPinned,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { destinosApi } from '../api/geotourApi';
import Alert from '../components/Alert';
import DestinoCard from '../components/DestinoCard';
import Loader from '../components/Loader';
import ReservaModal from '../components/ReservaModal';
import ResenasModal from '../components/ResenasModal';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/format';

const ordenes = {
  nombre: (a, b) => a.nombre.localeCompare(b.nombre),
  'precio-asc': (a, b) => Number(a.precioBase) - Number(b.precioBase),
  'precio-desc': (a, b) => Number(b.precioBase) - Number(a.precioBase),
  'capacidad-desc': (a, b) => b.capacidad - a.capacidad,
};

export default function Destinos() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [search, setSearch] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [capacidadMin, setCapacidadMin] = useState('');
  const [orden, setOrden] = useState('nombre');

  const [reservaDestino, setReservaDestino] = useState(null);
  const [resenasDestino, setResenasDestino] = useState(null);

  const cargarDestinos = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await destinosApi.listar();
      setDestinos(data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible cargar el catalogo de destinos.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDestinos();
  }, []);

  const destinosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();

    return destinos
      .filter((destino) => {
        const coincideTexto =
          !term ||
          destino.nombre.toLowerCase().includes(term) ||
          destino.descripcion.toLowerCase().includes(term);

        const coincidePrecio =
          !precioMax || Number(destino.precioBase) <= Number(precioMax);

        const coincideCapacidad =
          !capacidadMin || Number(destino.capacidad) >= Number(capacidadMin);

        return coincideTexto && coincidePrecio && coincideCapacidad;
      })
      .sort(ordenes[orden] ?? ordenes.nombre);
  }, [destinos, search, precioMax, capacidadMin, orden]);

  const handleReservar = (destino) => {
    setNotice('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/destinos' } } });
      return;
    }

    if (isAdmin) {
      setNotice(
        'El rol administrador no puede crear reservas. Inicia sesion con una cuenta de usuario.'
      );
      return;
    }

    setReservaDestino(destino);
  };

  const limpiarFiltros = () => {
    setSearch('');
    setPrecioMax('');
    setCapacidadMin('');
    setOrden('nombre');
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-brand-800 py-16 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-white/5" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-brand-400/10 blur-3xl" />

        <div className="container-page relative">
          <span className="badge bg-white/10 text-brand-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Clima en tiempo real
          </span>

          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Descubre destinos increibles y reserva con{' '}
            <span className="text-brand-300">informacion del clima</span>.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-50/80 sm:text-base">
            Explora el catalogo turistico, consulta la temperatura, humedad y viento
            de cada lugar, y asegura tu cupo en segundos.
          </p>

          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o descripcion..."
                className="w-full rounded-2xl border border-white/20 bg-white px-12 py-3.5 text-sm text-slate-800 shadow-xl outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-brand-300/40"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container-page -mt-7 relative z-10">
        <div className="card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 lg:pb-2">
              <SlidersHorizontal className="h-4 w-4 text-brand-600" /> Filtros
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="precioMax" className="mb-1 block text-xs font-semibold text-slate-500">
                  Precio maximo
                </label>
                <select
                  id="precioMax"
                  className="input"
                  value={precioMax}
                  onChange={(event) => setPrecioMax(event.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="250000">Hasta $250.000</option>
                  <option value="300000">Hasta $300.000</option>
                  <option value="400000">Hasta $400.000</option>
                  <option value="500000">Hasta $500.000</option>
                </select>
              </div>

              <div>
                <label htmlFor="capacidadMin" className="mb-1 block text-xs font-semibold text-slate-500">
                  Capacidad minima
                </label>
                <select
                  id="capacidadMin"
                  className="input"
                  value={capacidadMin}
                  onChange={(event) => setCapacidadMin(event.target.value)}
                >
                  <option value="">Cualquiera</option>
                  <option value="10">10+ personas</option>
                  <option value="20">20+ personas</option>
                  <option value="30">30+ personas</option>
                </select>
              </div>

              <div>
                <label htmlFor="orden" className="mb-1 block text-xs font-semibold text-slate-500">
                  Ordenar por
                </label>
                <select
                  id="orden"
                  className="input"
                  value={orden}
                  onChange={(event) => setOrden(event.target.value)}
                >
                  <option value="nombre">Nombre (A-Z)</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="capacidad-desc">Mayor capacidad</option>
                </select>
              </div>
            </div>

            <button type="button" onClick={limpiarFiltros} className="btn-secondary">
              <Filter className="h-4 w-4" /> Limpiar
            </button>
          </div>
        </div>
      </div>

      <section className="container-page py-10">
        {notice && (
          <div className="mb-6">
            <Alert type="info" onClose={() => setNotice('')}>
              {notice}
            </Alert>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
              <MapPinned className="h-5 w-5 text-brand-600" /> Destinos disponibles
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? 'Cargando catalogo...'
                : `${destinosFiltrados.length} de ${destinos.length} destinos encontrados`}
            </p>
          </div>

          <button type="button" onClick={cargarDestinos} className="btn-ghost text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Actualizar
          </button>
        </div>

        {loading ? (
          <Loader label="Cargando destinos..." fullScreen />
        ) : error ? (
          <div className="py-10">
            <Alert type="error">{error}</Alert>
            <div className="mt-4 text-center">
              <button type="button" onClick={cargarDestinos} className="btn-primary">
                <RefreshCw className="h-4 w-4" /> Reintentar
              </button>
            </div>
          </div>
        ) : destinosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Compass className="h-12 w-12 text-slate-300" />
            <p className="text-lg font-bold text-slate-700">Sin resultados</p>
            <p className="max-w-sm text-sm text-slate-500">
              No encontramos destinos con los filtros seleccionados. Prueba con otro
              termino de busqueda.
            </p>
            <button type="button" onClick={limpiarFiltros} className="btn-secondary">
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {destinosFiltrados.map((destino) => (
              <DestinoCard
                key={destino.id}
                destino={destino}
                onReservar={handleReservar}
                onVerResenas={setResenasDestino}
              />
            ))}
          </div>
        )}
      </section>

      <ReservaModal
        open={Boolean(reservaDestino)}
        destino={reservaDestino}
        onClose={() => setReservaDestino(null)}
      />

      <ResenasModal
        open={Boolean(resenasDestino)}
        destino={resenasDestino}
        onClose={() => setResenasDestino(null)}
      />
    </div>
  );
}
