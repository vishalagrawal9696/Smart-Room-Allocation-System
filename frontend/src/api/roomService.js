import api from "./axiosInstance";

export const roomAPI = {
  // Get all rooms with optional filters
  getAll: (params) => api.get("/rooms", { params }),

  // Get single room
  getById: (id) => api.get(`/rooms/${id}`),

  // Add new room
  create: (data) => api.post("/rooms", data),

  // Update room
  update: (id, data) => api.put(`/rooms/${id}`, data),

  // Delete room
  delete: (id) => api.delete(`/rooms/${id}`),

  // Allocate room
  allocate: (data) => api.post("/rooms/allocate", data),

  // Deallocate room
  deallocate: (id) => api.patch(`/rooms/${id}/deallocate`),

  // Get stats
  getStats: () => api.get("/rooms/stats"),
};
