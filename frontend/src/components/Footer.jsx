import { Compass, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-base font-extrabold text-slate-900">
            <Compass className="h-5 w-5 text-brand-600" />
            GeoTour
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Reservas turisticas y analisis climatologico en tiempo real para planear
            experiencias seguras y memorables.
          </p>
        </div>

        <div className="space-y-2 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-600" /> Colombia
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand-600" /> soporte@geotour.com
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        GeoTour {new Date().getFullYear()} - Sistema de gestion de reservas turisticas.
      </div>
    </footer>
  );
}
