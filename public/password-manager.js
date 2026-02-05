// Password management utility for Kitchen Stories
// This script handles admin authentication for editing/deleting recipes

class PasswordManager {
    constructor() {
        this.storageKey = 'kitchen_stories_admin_password';
    }

    // Get stored password from session storage
    getPassword() {
        return sessionStorage.getItem(this.storageKey);
    }

    // Store password in session storage
    setPassword(password) {
        sessionStorage.setItem(this.storageKey, password);
    }

    // Clear stored password
    clearPassword() {
        sessionStorage.removeItem(this.storageKey);
    }

    // Prompt for password
    async promptPassword() {
        const password = prompt('Enter admin password to continue:');
        if (!password) {
            return null;
        }
        this.setPassword(password);
        return password;
    }

    // Get password or prompt if not stored
    async getOrPromptPassword() {
        let password = this.getPassword();
        if (!password) {
            password = await this.promptPassword();
        }
        return password;
    }

    // Make authenticated API request
    async authenticatedFetch(url, options = {}) {
        const password = await this.getOrPromptPassword();
        
        if (!password) {
            throw new Error('Password required');
        }

        // Add password to headers
        options.headers = options.headers || {};
        options.headers['X-Admin-Password'] = password;

        const response = await fetch(url, options);

        // If unauthorized, clear password and retry once
        if (response.status === 401) {
            this.clearPassword();
            alert('Invalid password. Please try again.');
            
            const newPassword = await this.promptPassword();
            if (!newPassword) {
                throw new Error('Authentication cancelled');
            }

            options.headers['X-Admin-Password'] = newPassword;
            const retryResponse = await fetch(url, options);
            
            if (retryResponse.status === 401) {
                this.clearPassword();
                throw new Error('Authentication failed');
            }
            
            return retryResponse;
        }

        return response;
    }
}

// Create global instance
const passwordManager = new PasswordManager();
