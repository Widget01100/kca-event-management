class AuthService {
    setUser(user) {
        localStorage.setItem('kca_user', JSON.stringify({
            ...user,
            loggedIn: true,
            loginTime: new Date().toISOString()
        }));
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('kca_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    logout() {
        localStorage.removeItem('kca_user');
        window.location.href = '/';
    }

    validateKCAEmail(email) {
        const validDomains = [
            '@kca.ac.ke',
            '@students.kca.ac.ke',
            '@staff.kca.ac.ke'
        ];
        return validDomains.some(domain => email.endsWith(domain));
    }

    validatePassword(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

export default new AuthService();
