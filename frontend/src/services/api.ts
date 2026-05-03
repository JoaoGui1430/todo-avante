import axios from 'axios';
import { List, Task, TaskStatus } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
});


// --- LISTS ---
export const getLists = () =>
  api.get<List[]>('/lists').then(r => r.data);

export const getListById = (id: string) =>
  api.get<List & { tasks: Task[] }>(`/lists/${id}`).then(r => r.data);

export const createList = (data: { title: string; description: string }) =>
  api.post<List>('/lists', data).then(r => r.data);

export const updateList = (id: string, data: { title: string; description: string }) =>
  api.put<List>(`/lists/${id}`, data).then(r => r.data);

export const deleteList = (id: string) =>
  api.delete(`/lists/${id}`);

// --- TASKS ---
export const getTasks = (params?: { listId?: string; status?: TaskStatus }) =>
  api.get<Task[]>('/tasks', { params }).then(r => r.data);

export const getTaskById = (id: string) =>
  api.get<Task>(`/tasks/${id}`).then(r => r.data);

export const createTask = (data: {
  title: string;
  description: string;
  status: TaskStatus;
  endDate: string | null;
  listId: string;
}) => api.post<Task>('/tasks', data).then(r => r.data);

export const updateTask = (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    endDate: string | null;
  }>
) => api.put<Task>(`/tasks/${id}`, data).then(r => r.data);

export const deleteTask = (id: string) =>
  api.delete(`/tasks/${id}`);