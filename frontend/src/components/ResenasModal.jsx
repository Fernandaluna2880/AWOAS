import { useCallback, useEffect, useState } from 'react';
import { MessageSquareOff, RefreshCw, Trash2, UserRound } from 'lucide-react';
import { resenasApi } from '../api/geotourApi';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/format';
import Alert from './Alert';
import Loader from './Loader';
import Modal from './Modal';
import StarRating from './StarRating';

export default function ResenasModal({ open, destino, onClose }) {
  const { isAdmin } = useAuth();
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const cargarResenas = useCallback(async () => {
    if (!destino?.id) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await resenasApi.listarPorDestino(destino.id);
      setResenas(data);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible cargar las resenas del destino.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [destino?.id]);

  useEffect(() => {
    if (open) {
      cargarResenas();
    }
  }, [open, cargarResenas]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError('');

    try {
      await resenasApi.eliminar(id);
      setResenas((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No fue posible eliminar la resena.'));
    } finally {
      setDeletingId(null);
    }
  };

  const promedio =
    resenas.length > 0
      ? (
          resenas.reduce((total, item) => total + item.calificacion, 0) /
          resenas.length
        ).toFixed(1)
      : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Resenas del destino"
      description={destino?.nombre}
      size="lg"
      footer={
        <button type="button" onClick={onClose} className="btn-secondary">
          Cerrar
        </button>
      }
    >
      {loading ? (
        <Loader label="Cargando resenas..." />
      ) : (
        <div className="space-y-4">
          {error && <Alert type="error">{error}</Alert>}

          {resenas.length > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <StarRating value={Math.round(Number(promedio))} size="sm" />
                <span className="text-sm font-bold text-amber-700">{promedio} / 5</span>
              </div>
              <span className="text-xs font-semibold text-amber-600">
                {resenas.length} opinion(es)
              </span>
            </div>
          )}

          {resenas.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-slate-400">
              <MessageSquareOff className="h-10 w-10" />
              <p className="text-sm">Este destino aun no tiene resenas.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {resenas.map((resena) => (
                <li
                  key={resena.id}
                  className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <UserRound className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {resena.usuarioNombre}
                        </p>
                        <StarRating value={resena.calificacion} size="sm" />
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDelete(resena.id)}
                        disabled={deletingId === resena.id}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                        title="Eliminar resena"
                      >
                        {deletingId === resena.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {resena.comentario}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={cargarResenas}
            className="btn-ghost w-full text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Actualizar resenas
          </button>
        </div>
      )}
    </Modal>
  );
}
