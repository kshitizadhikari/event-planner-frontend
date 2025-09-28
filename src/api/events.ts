import api from "./axiosInstance";

export const getEvents = (params: any) => api.get("/events", { params });
export const getEvent = (id: any) => api.get(`/events/${id}`);
export const createEvent = (data: any) => api.post("/events", data);
export const updateEvent = (id: any, data: any) =>
  api.put(`/events/${id}`, data);
export const deleteEvent = (id: any) => api.delete(`/events/${id}`);
