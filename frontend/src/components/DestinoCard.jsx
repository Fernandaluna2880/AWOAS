import { useState } from 'react';
import {
  CloudSun,
  MapPin,
  MessageSquareText,
  Ticket,
  Users,
} from 'lucide-react';
import { formatCurrency } from '../utils/format';
import WidgetClima from './WidgetClima';

export default function DestinoCard({ destino, onReservar, onVerResenas }) {
  const [mostrarClima, setMostrarClima] = useState(false);

  return (
    <article className="card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-brand-500 via-teal-600 to-sky-800 p-4">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full border-[12px] border-white/10" />
        <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />

        <span className="badge bg-white/20 text-white backdrop-blur">
          <MapPin className="h-3.5 w-3.5" /> Destino turistico
        </span>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-medium text-brand-50/90">
            {Number(destino.latitud).toFixed(4)}, {Number(destino.longitud).toFixed(4)}
          </p>
        </div>

        <MapPin className="absolute bottom-4 right-4 h-10 w-10 text-white/30" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold leading-tight text-slate-900">
          {destino.nombre}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
          {destino.descripcion}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Precio base
            </p>
            <p className="text-sm font-extrabold text-brand-700">
              {formatCurrency(destino.precioBase)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              <Users className="h-3 w-3" /> Capacidad
            </p>
            <p className="text-sm font-extrabold text-slate-700">
              {destino.capacidad} personas
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMostrarClima((value) => !value)}
            className={`btn-secondary flex-1 text-xs ${
              mostrarClima ? 'border-brand-200 bg-brand-50 text-brand-700' : ''
            }`}
          >
            <CloudSun className="h-4 w-4" />
            {mostrarClima ? 'Ocultar clima' : 'Ver clima'}
          </button>

          <button
            type="button"
            onClick={() => onVerResenas?.(destino)}
            className="btn-secondary flex-1 text-xs"
          >
            <MessageSquareText className="h-4 w-4" /> Resenas
          </button>

          <button
            type="button"
            onClick={() => onReservar?.(destino)}
            className="btn-primary w-full text-xs"
          >
            <Ticket className="h-4 w-4" /> Reservar ahora
          </button>
        </div>

        {mostrarClima && (
          <div className="mt-4">
            <WidgetClima destinoId={destino.id} />
          </div>
        )}
      </div>
    </article>
  );
}
