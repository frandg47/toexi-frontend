import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/admin', // URL base para las rutas de admin
  withCredentials: true, // Esta línea es CRUCIAL para enviar cookies
});

export default api;
