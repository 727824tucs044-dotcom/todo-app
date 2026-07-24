import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const taskApi = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTasksByUser: (userId) => api.get(`/tasks/user/${userId}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  toggleComplete: (id) => api.patch(`/tasks/${id}/complete`),
  archiveTask: (id) => api.patch(`/tasks/${id}/archive`),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export const calendarApi = {
  getTasksForDateRange: (startDate, endDate) => 
    api.get('/calendar/tasks', { params: { startDate, endDate } }),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.post('/users/me/change-password', data),
};

export const adminApi = {
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;
