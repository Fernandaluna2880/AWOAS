import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Cargando...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">{content}</div>
    );
  }

  return <div className="py-10">{content}</div>;
}
