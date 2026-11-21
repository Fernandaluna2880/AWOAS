import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Compass className="h-10 w-10" />
      </span>
      <h1 className="mt-6 text-4xl font-extrabold text-slate-900">404</h1>
      <p className="mt-2 text-lg font-semibold text-slate-700">
        Te has desviado del mapa
      </p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        La pagina que buscas no existe o fue movida a otro destino.
      </p>
      <Link to="/destinos" className="btn-primary mt-6">
        <Home className="h-4 w-4" /> Volver al catalogo
      </Link>
    </div>
  );
}
