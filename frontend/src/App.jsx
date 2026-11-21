import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Destinos from './pages/Destinos';
import MisReservas from './pages/MisReservas';
import AdminDestinos from './pages/AdminDestinos';
import AdminReservas from './pages/AdminReservas';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/destinos" replace />} />

        <Route path="destinos" element={<Destinos />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="mis-reservas"
          element={
            <ProtectedRoute role="ROLE_USER">
              <MisReservas />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/destinos"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDestinos />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reservas"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminReservas />
            </ProtectedRoute>
          }
        />
        <Route path="admin" element={<Navigate to="/admin/destinos" replace />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
