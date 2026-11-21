import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const variants = {
  error: {
    wrapper: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: AlertCircle,
  },
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
  },
  info: {
    wrapper: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: Info,
  },
};

export default function Alert({ type = 'info', children, onClose }) {
  if (!children) return null;

  const variant = variants[type] ?? variants.info;
  const Icon = variant.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${variant.wrapper}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 leading-relaxed">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 transition hover:bg-black/5"
          aria-label="Cerrar mensaje"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
