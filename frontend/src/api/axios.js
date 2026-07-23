import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
    withCredentials: true, // For CSRF cookies
});

// Request Interceptor: Attach Token & CSRF
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Attach CSRF Token if present in cookies (Django default name: csrftoken)
        const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
        if (match) {
            config.headers['X-CSRFToken'] = match[2];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If 401 Unauthorized and not already retrying
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const res = await axios.post(`${api.defaults.baseURL}users/login/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    if (res.status === 200) {
                        localStorage.setItem('access_token', res.data.access);
                        // Update default header
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                        // Retry original request
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // If refresh fails, clear everything
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
