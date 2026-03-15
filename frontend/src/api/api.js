import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Token автоматаар нэмэх
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Шинэ токен ирвэл localStorage-д хадгалах
api.interceptors.response.use((response) => {
    const newToken = response.headers['authorization'];
    if (newToken && newToken.startsWith('Bearer ')) {
        const tokenValue = newToken.substring(7);
        localStorage.setItem('token', tokenValue);
        // Custom event үүсгэж TokenContext эсвэл AuthContext-д мэдэгдэх боломжтой
        window.dispatchEvent(new Event('tokenRefreshed'));
    }
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

// Auth API
export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Student CRUD API
export const studentApi = {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
    restore: (id) => api.post(`/students/${id}/restore`),
    getDeleted: () => api.get('/students/deleted'),
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/students/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// Attendance API
export const attendanceApi = {
    mark: (data) => api.post('/attendance', data),
    get: (date) => api.get('/attendance', { params: { date } }),
};

export default api;
