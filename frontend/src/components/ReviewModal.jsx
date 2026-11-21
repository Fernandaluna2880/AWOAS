import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { resenasApi } from '../api/geotourApi';
import { getApiErrorMessage } from '../utils/format';
import Alert from './Alert';
import Modal from './Modal';
import StarRating from './StarRating';

export default function ReviewModal({ open, reserva, onClose, onSaved }) {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setCalificacion(0);
      setComentario('');
      setError('');
      setSuccess(false);
    }
  }, [open, reserva?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (calificacion < 1) {
      setError('Selecciona una calificacion entre 1 y 5 estrellas.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data } = await resenasApi.crear(reserva.destinoId, {
        calificacion,
        comentario: comentario.trim(),
      });

      setSuccess(true);
      onSaved?.(data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible registrar la resena. Intenta nuevamente.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={success ? 'Resena publicada' : 'Escribir resena'}
      description={reserva?.destinoNombre}
      footer={
        success ? (
          <button type="button" onClick={onClose} className="btn-primary">
            Entendido
          </button>
        ) : (
          <>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              form="review-form"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publicar resena
            </button>
          </>
        )
      }
    >
      {success ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <p className="text-base font-bold text-slate-900">
            Gracias por compartir tu experiencia
          </p>
          <p className="max-w-sm text-sm text-slate-500">
            Tu opinion ayuda a otros viajeros a elegir su proximo destino.
          </p>
        </div>
      ) : (
        <form id="review-form" onSubmit={handleSubmit} className="space-y-5">
          {error && <Alert type="error">{error}</Alert>}

          <div>
            <p className="label">Calificacion</p>
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <StarRating value={calificacion} onChange={setCalificacion} size="lg" />
              <span className="text-sm font-semibold text-slate-500">
                {calificacion > 0 ? `${calificacion} / 5` : 'Selecciona una puntuacion'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="comentario" className="label">
              Comentario
            </label>
            <textarea
              id="comentario"
              className="input min-h-[120px] resize-y"
              value={comentario}
              onChange={(event) => setComentario(event.target.value)}
              maxLength={1000}
              placeholder="Cuentanos como fue tu experiencia en este destino..."
              required
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {comentario.length}/1000
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
}
