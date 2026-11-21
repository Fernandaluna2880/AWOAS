import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Users,
  Wallet,
} from 'lucide-react';
import { reservasApi } from '../api/geotourApi';
import {
  formatCurrency,
  getApiErrorMessage,
  getTodayISO,
} from '../utils/format';
import Alert from './Alert';
import Modal from './Modal';

const initialForm = {
  fechaReserva: getTodayISO(),
  numeroPersonas: 1,
};

export default function ReservaModal({ open, destino, onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setError('');
      setSuccess(null);
    }
  }, [open, destino?.id]);

  const precioTotal = useMemo(() => {
    const precio = Number(destino?.precioBase ?? 0);
    const personas = Number(form.numeroPersonas) || 0;
    return precio * personas;
  }, [destino?.precioBase, form.numeroPersonas]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === 'numeroPersonas' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data } = await reservasApi.crear({
        destinoId: destino.id,
        fechaReserva: form.fechaReserva,
        numeroPersonas: Number(form.numeroPersonas),
      });

      setSuccess(data);
      onCreated?.(data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible registrar la reserva. Intente nuevamente.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!destino) return null;

  const handleGoToReservas = () => {
    onClose?.();
    navigate('/mis-reservas');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={success ? 'Reserva creada' : 'Reservar destino'}
      description={destino.nombre}
      footer={
        success ? (
          <>
            <button type="button" onClick={onClose} className="btn-secondary">
              Seguir explorando
            </button>
            <button type="button" onClick={handleGoToReservas} className="btn-primary">
              Ver mis reservas
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              form="reserva-form"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Confirmar reserva
            </button>
          </>
        )
      }
    >
      {success ? (
        <div className="space-y-4 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-900">
              Tu reserva quedo registrada
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Estado inicial: <strong>{success.estado}</strong>. Un asesor confirmara
              la disponibilidad pronto.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-sm">
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Destino</span>
              <span className="font-semibold text-slate-800">{success.destinoNombre}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Personas</span>
              <span className="font-semibold text-slate-800">{success.numeroPersonas}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">Total</span>
              <span className="font-bold text-brand-700">
                {formatCurrency(success.precioTotal)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <form id="reserva-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error">{error}</Alert>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fechaReserva" className="label">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-brand-600" /> Fecha de la visita
                </span>
              </label>
              <input
                id="fechaReserva"
                name="fechaReserva"
                type="date"
                className="input"
                min={getTodayISO()}
                value={form.fechaReserva}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="numeroPersonas" className="label">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-brand-600" /> Numero de personas
                </span>
              </label>
              <input
                id="numeroPersonas"
                name="numeroPersonas"
                type="number"
                className="input"
                min={1}
                max={destino.capacidad}
                value={form.numeroPersonas}
                onChange={handleChange}
                required
              />
              <p className="mt-1 text-xs text-slate-400">
                Capacidad maxima del destino: {destino.capacidad}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
              <Wallet className="h-4 w-4" /> Resumen de pago
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Precio por persona</span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(destino.precioBase)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Personas</span>
                <span className="font-semibold text-slate-700">
                  {form.numeroPersonas}
                </span>
              </div>
              <div className="flex justify-between border-t border-brand-100 pt-2">
                <span className="font-semibold text-slate-700">Total estimado</span>
                <span className="text-lg font-extrabold text-brand-700">
                  {formatCurrency(precioTotal)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            El precio total se calcula automaticamente y se valida contra la
            disponibilidad del destino en la fecha seleccionada.
          </p>
        </form>
      )}
    </Modal>
  );
}
