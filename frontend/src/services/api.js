const API_URL = 'http://localhost:5000/api';

class ApiService {
    setAuthHeaders(user) {
        this.user = user;
    }

    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.user && {
                'X-User-Id': this.user.id,
                'X-User-Role': this.user.role
            }),
            ...options.headers
        };

        try {
            const response = await fetch(url, { ...options, headers });
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

    async registerForEvent(eventId) {
        return this.request(`/events/${eventId}/register`, {
            method: 'POST'
        });
    }

    async getUserRegistrations() {
        return this.request('/user/registrations');
    }

    async cancelRegistration(id) {
        return this.request(`/registrations/${id}`, {
            method: 'DELETE'
        });
    }

    async getStats() {
        return this.request('/stats');
    }

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
}

export default new ApiService();
