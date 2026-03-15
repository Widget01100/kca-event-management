const API_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.user = null;
    }

    setAuthHeaders(user) {
        this.user = user;
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.user) {
            headers['X-User-Id'] = this.user.id;
            headers['X-User-Role'] = this.user.role;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Request failed');
            }
            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // EVENTS
    async getEvents() {
        return this.request('/events');
    }

    async getEvent(id) {
        return this.request(`/events/${id}`);
    }

    async createEvent(eventData) {
        return this.request('/events', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    }

    async updateEvent(id, eventData) {
        return this.request(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
    }

    async deleteEvent(id) {
        return this.request(`/events/${id}`, {
            method: 'DELETE'
        });
    }

    // CATEGORIES
    async getCategories() {
        return this.request('/categories');
    }

    async getEventsByCategory(categoryId) {
        return this.request(`/categories/${categoryId}/events`);
    }

    // REGISTRATIONS
    async registerForEvent(eventId) {
        return this.request(`/events/${eventId}/register`, {
            method: 'POST'
        });
    }

    async getUserRegistrations() {
        return this.request('/user/registrations');
    }

    async getAllRegistrations() {
        return this.request('/registrations');
    }

    async getEventRegistrations(eventId) {
        return this.request(`/events/${eventId}/registrations`);
    }

    async cancelRegistration(id) {
        return this.request(`/registrations/${id}`, {
            method: 'DELETE'
        });
    }

    // ATTENDANCE
    async markAttendance(registrationId) {
        return this.request(`/registrations/${registrationId}/attendance`, {
            method: 'PUT'
        });
    }

    async getAttendanceReport(eventId) {
        return this.request(`/events/${eventId}/attendance`);
    }

    // STATISTICS (THIS IS THE MISSING ONE)
    async getStats() {
        return this.request('/stats');
    }

    async getDetailedStats() {
        return this.request('/stats/detailed');
    }

    // AUDIT LOGS
    async getAuditLogs(limit = 100) {
        return this.request(`/audit-logs?limit=${limit}`);
    }

    // USERS
    async getUsers() {
        return this.request('/users');
    }

    async getUser(id) {
        return this.request(`/users/${id}`);
    }

    async updateUser(id, userData) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE'
        });
    }

    // AUTH
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // DATABASE TEST
    async testDatabase() {
        return this.request('/test-db');
    }
}

export default new ApiService();
