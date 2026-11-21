import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { destinosApi } from '../api/geotourApi';
import { getApiErrorMessage } from '../utils/format';
import Alert from './Alert';
import Modal from './Modal';

const emptyForm = {
  nombre: '',
  descripcion: '',
  latitud: '',
  longitud: '',
  precioBase: '',
  capacidad: '',
};

export default function DestinoFormModal({ open, destino, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(destino?.id);

  useEffect(() => {
    if (!open) return;

    if (destino) {
      setForm({
        nombre: destino.nombre ?? '',
        descripcion: destino.descripcion ?? '',
        latitud: String(destino.latitud ?? ''),
        longitud: String(destino.longitud ?? ''),
        precioBase: String(destino.precioBase ?? ''),
        capacidad: String(destino.capacidad ?? ''),
      });
    } else {
      setForm(emptyForm);
    }

    setError('');
  }, [open, destino]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      latitud: Number(form.latitud),
      longitud: Number(form.longitud),
      precioBase: Number(form.precioBase),
      capacidad: Number(form.capacidad),
    };

    try {
      const response = isEditing
        ? await destinosApi.actualizar(destino.id, payload)
        : await destinosApi.crear(payload);

      onSaved?.(response.data, isEditing);
      onClose?.();
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'No fue posible guardar el destino. Verifique los datos.'
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
      title={isEditing ? 'Editar destino' : 'Nuevo destino'}
      description={
        isEditing
          ? 'Actualiza la informacion del destino seleccionado.'
          : 'Registra un nuevo destino en el catalogo turistico.'
      }
      size="lg"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            form="destino-form"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? 'Guardar cambios' : 'Crear destino'}
          </button>
        </>
      }
    >
      <form id="destino-form" onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error">{error}</Alert>}

        <div>
          <label htmlFor="nombre" className="label">
            Nombre del destino
          </label>
          <input
            id="nombre"
            name="nombre"
            className="input"
            value={form.nombre}
            onChange={handleChange}
            maxLength={150}
            placeholder="Ej. Parque Nacional Tayrona"
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="label">
            Descripcion
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="input min-h-[100px] resize-y"
            value={form.descripcion}
            onChange={handleChange}
            maxLength={2000}
            placeholder="Describe los atractivos del destino..."
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="latitud" className="label">
              Latitud
            </label>
            <input
              id="latitud"
              name="latitud"
              type="number"
              step="any"
              min={-90}
              max={90}
              className="input"
              value={form.latitud}
              onChange={handleChange}
              placeholder="11.3100"
              required
            />
          </div>

          <div>
            <label htmlFor="longitud" className="label">
              Longitud
            </label>
            <input
              id="longitud"
              name="longitud"
              type="number"
              step="any"
              min={-180}
              max={180}
              className="input"
              value={form.longitud}
              onChange={handleChange}
              placeholder="-74.1200"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="precioBase" className="label">
              Precio base (COP)
            </label>
            <input
              id="precioBase"
              name="precioBase"
              type="number"
              step="0.01"
              min="0.01"
              className="input"
              value={form.precioBase}
              onChange={handleChange}
              placeholder="350000"
              required
            />
          </div>

          <div>
            <label htmlFor="capacidad" className="label">
              Capacidad (personas)
            </label>
            <input
              id="capacidad"
              name="capacidad"
              type="number"
              min="1"
              className="input"
              value={form.capacidad}
              onChange={handleChange}
              placeholder="25"
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
