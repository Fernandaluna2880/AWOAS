import { useCallback, useEffect, useState } from 'react';
import {
  CloudSun,
  Droplets,
  RefreshCw,
  Thermometer,
  Wind,
} from 'lucide-react';
import { destinosApi } from '../api/geotourApi';
import { getApiErrorMessage } from '../utils/format';
import Alert from './Alert';
import Loader from './Loader';

export default function WidgetClima({ destinoId }) {
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarClima = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await destinosApi.clima(destinoId);
      setClima(data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible obtener el clima del destino en este momento.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [destinoId]);

  useEffect(() => {
    cargarClima();
  }, [cargarClima]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50/70">
        <Loader label="Consultando clima..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Alert type="error">{error}</Alert>
        <button
          type="button"
          onClick={cargarClima}
          className="btn-secondary w-full text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reintentar
        </button>
      </div>
    );
  }

  if (!clima) return null;

  return (
    <div className="animate-fadeUp rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-sky-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {clima.icono ? (
            <img
              src={`https://openweathermap.org/img/wn/${clima.icono}@2x.png`}
              alt={clima.descripcion}
              className="h-14 w-14 -my-1"
              loading="lazy"
            />
          ) : (
            <CloudSun className="h-10 w-10 text-brand-600" />
          )}
          <div>
            <p className="text-2xl font-extrabold text-slate-900">
              {clima.temperatura}°C
            </p>
            <p className="text-sm font-medium capitalize text-slate-600">
              {clima.descripcion}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={cargarClima}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-brand-600"
          title="Actualizar clima"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-white/80 px-2 py-2">
          <Thermometer className="mx-auto h-4 w-4 text-brand-600" />
          <p className="mt-1 text-[10px] font-semibold uppercase text-slate-400">
            Sensacion
          </p>
          <p className="text-sm font-bold text-slate-700">
            {clima.sensacionTermica}°C
          </p>
        </div>
        <div className="rounded-lg bg-white/80 px-2 py-2">
          <Droplets className="mx-auto h-4 w-4 text-sky-500" />
          <p className="mt-1 text-[10px] font-semibold uppercase text-slate-400">
            Humedad
          </p>
          <p className="text-sm font-bold text-slate-700">{clima.humedad}%</p>
        </div>
        <div className="rounded-lg bg-white/80 px-2 py-2">
          <Wind className="mx-auto h-4 w-4 text-teal-600" />
          <p className="mt-1 text-[10px] font-semibold uppercase text-slate-400">
            Viento
          </p>
          <p className="text-sm font-bold text-slate-700">
            {clima.velocidadViento} m/s
          </p>
        </div>
      </div>

      <p className="mt-3 text-right text-[10px] text-slate-400">
        Actualizado:{' '}
        {new Date(clima.consultadoEn).toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  );
}
