import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Compass,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPinned,
  Menu,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, isUser, usuario, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/destinos');
  };

  const initials = (usuario?.nombreCompleto || 'GT')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const links = (
    <>
      <NavLink to="/destinos" className={navLinkClass} onClick={closeMenu}>
        <span className="inline-flex items-center gap-1.5">
          <MapPinned className="h-4 w-4" /> Destinos
        </span>
      </NavLink>

      {isUser && (
        <NavLink to="/mis-reservas" className={navLinkClass} onClick={closeMenu}>
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4" /> Mis reservas
          </span>
        </NavLink>
      )}

      {isAdmin && (
        <>
          <NavLink to="/admin/destinos" className={navLinkClass} onClick={closeMenu}>
            <span className="inline-flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4" /> Admin destinos
            </span>
          </NavLink>
          <NavLink to="/admin/reservas" className={navLinkClass} onClick={closeMenu}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4" /> Admin reservas
            </span>
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to="/destinos"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900"
          onClick={closeMenu}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-700 text-white shadow-lg shadow-brand-600/25">
            <Compass className="h-5 w-5" />
          </span>
          Geo<span className="-ml-1.5 text-brand-600">Tour</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">{links}</nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                  {initials}
                </span>
                <div className="pr-1">
                  <p className="max-w-[150px] truncate text-xs font-bold text-slate-800">
                    {usuario?.nombreCompleto}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-600">
                    {isAdmin ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
              </div>
              <button type="button" onClick={handleLogout} className="btn-secondary">
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                <LogIn className="h-4 w-4" /> Iniciar sesion
              </Link>
              <Link to="/register" className="btn-primary">
                <UserPlus className="h-4 w-4" /> Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">{links}</nav>

          <div className="mt-3 border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-700">
                    {initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {usuario?.nombreCompleto}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {isAdmin ? 'Administrador' : 'Usuario'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-secondary w-full"
                >
                  <LogOut className="h-4 w-4" /> Cerrar sesion
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-secondary" onClick={closeMenu}>
                  <LogIn className="h-4 w-4" /> Ingresar
                </Link>
                <Link to="/register" className="btn-primary" onClick={closeMenu}>
                  <UserPlus className="h-4 w-4" /> Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
