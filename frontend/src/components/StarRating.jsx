import { Star } from 'lucide-react';

/**
 * Calificacion de 1 a 5 estrellas. Si se omite onChange queda en modo lectura.
 */
export default function StarRating({ value = 0, onChange, size = 'md', showValue = false }) {
  const dimension = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  const interactive = typeof onChange === 'function';

  return (
    <div className="flex items-center gap-1" aria-label={`Calificacion: ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        if (!interactive) {
          return (
            <Star
              key={star}
              className={`${dimension} ${
                active ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'
              }`}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded-md p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-200"
            aria-label={`Asignar ${star} estrellas`}
          >
            <Star
              className={`${dimension} ${
                active ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'
              }`}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-slate-600">{value || 0}/5</span>
      )}
    </div>
  );
}
