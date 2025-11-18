/**
 * Google OAuth service for authentication and Docs export
 */
import api from './api';

/**
 * Store Google credentials in session storage
 */
export const storeGoogleCredentials = (credentials) => {
  sessionStorage.setItem('google_credentials', JSON.stringify(credentials));
};

/**
 * Get stored Google credentials
 */
export const getGoogleCredentials = () => {
  const credentials = sessionStorage.getItem('google_credentials');
  return credentials ? JSON.parse(credentials) : null;
};

/**
 * Clear stored Google credentials
 */
export const clearGoogleCredentials = () => {
  sessionStorage.removeItem('google_credentials');
};

/**
 * Check if user has authorized Google Docs access
 */
export const hasGoogleAuth = () => {
  const credentials = getGoogleCredentials();
  return credentials && credentials.token;
};

/**
 * Get Google OAuth authorization URL
 */
export const getGoogleAuthUrl = async () => {
  try {
    const response = await api.get('/auth/google/url');
    return response.data;
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
    throw error;
  }
};

/**
 * Handle Google OAuth callback
 */
export const handleGoogleCallback = async (code, state) => {
  try {
    const response = await api.get(`/auth/google/callback?code=${code}&state=${state}`);
    if (response.data.success && response.data.credentials) {
      storeGoogleCredentials(response.data.credentials);
      return response.data.credentials;
    }
    throw new Error('Failed to get credentials from callback');
  } catch (error) {
    console.error('Error handling Google callback:', error);
    throw error;
  }
};

/**
 * Initiate Google OAuth flow
 * Opens a popup window for Google authentication
 */
export const initiateGoogleAuth = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get authorization URL
      const { authorization_url, state } = await getGoogleAuthUrl();

      // Open popup window for authentication
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authorization_url,
        'Google OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Poll for popup closure or message
      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          // Check if credentials were stored
          const credentials = getGoogleCredentials();
          if (credentials) {
            resolve(credentials);
          } else {
            reject(new Error('Authentication cancelled or failed'));
          }
        }
      }, 500);

      // Listen for messages from popup (callback handling)
      const messageHandler = (event) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkPopup);
          window.removeEventListener('message', messageHandler);
          if (popup) popup.close();

          storeGoogleCredentials(event.data.credentials);
          resolve(event.data.credentials);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkPopup);
          window.removeEventListener('message', messageHandler);
          if (popup) popup.close();

          reject(new Error(event.data.error || 'Authentication failed'));
        }
      };

      window.addEventListener('message', messageHandler);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkPopup);
        window.removeEventListener('message', messageHandler);
        if (popup && !popup.closed) {
          popup.close();
        }
        reject(new Error('Authentication timeout'));
      }, 5 * 60 * 1000);

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Export CV to Google Docs
 */
export const exportToGoogleDocs = async () => {
  try {
    // Check if we have credentials
    let credentials = getGoogleCredentials();

    // If no credentials, initiate auth flow
    if (!credentials) {
      credentials = await initiateGoogleAuth();
    }

    // Export to Google Docs
    const response = await api.post('/export/google-docs', credentials);
    return response.data;
  } catch (error) {
    // If auth error, clear credentials and try again
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearGoogleCredentials();
      throw new Error('Google authentication expired. Please try again.');
    }
    throw error;
  }
};
