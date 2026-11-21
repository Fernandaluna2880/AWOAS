import api from './client';

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
};

export const destinosApi = {
  listar: () => api.get('/destinos'),
  obtener: (id) => api.get(`/destinos/${id}`),
  crear: (payload) => api.post('/destinos', payload),
  actualizar: (id, payload) => api.put(`/destinos/${id}`, payload),
  eliminar: (id) => api.delete(`/destinos/${id}`),
  clima: (id) => api.get(`/destinos/${id}/clima`),
};

export const reservasApi = {
  crear: (payload) => api.post('/reservas', payload),
  misReservas: () => api.get('/reservas/mis-reservas'),
  cancelar: (id) => api.put(`/reservas/${id}/cancelar`),
  listarTodas: () => api.get('/reservas'),
  eliminar: (id) => api.delete(`/reservas/${id}`),
};

export const resenasApi = {
  listarPorDestino: (destinoId) => api.get(`/destinos/${destinoId}/resenas`),
  crear: (destinoId, payload) => api.post(`/destinos/${destinoId}/resenas`, payload),
  eliminar: (id) => api.delete(`/resenas/${id}`),
};
