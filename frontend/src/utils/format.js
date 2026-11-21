const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export function formatCurrency(value) {
  const number = Number(value ?? 0);
  return currencyFormatter.format(Number.isFinite(number) ? number : 0);
}

export function formatDate(value) {
  if (!value) return 'Sin fecha';

  // Evita desfases de zona horaria al interpretar fechas puras (YYYY-MM-DD).
  const [year, month, day] = String(value).split('-').map(Number);

  if (!year || !month || !day) return String(value);

  return dateFormatter.format(new Date(year, month - 1, day));
}

export function getTodayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function getApiErrorMessage(error, fallback = 'Ocurrio un error inesperado') {
  const data = error?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join('. ');
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.error === 'string' && data.error.trim()) {
    return data.error;
  }

  return fallback;
}

export function getEstadoClasses(estado) {
  switch (estado) {
    case 'CONFIRMADA':
      return 'bg-emerald-100 text-emerald-700';
    case 'CANCELADA':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
}
