/**
 * Google OAuth Callback Handler
 * This page handles the redirect from Google OAuth
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback } from '../services/googleOAuth';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          throw new Error(`Google authentication error: ${errorParam}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        setStatus('authenticating');

        // Handle the callback
        const credentials = await handleGoogleCallback(code, state);

        setStatus('success');

        // If opened in popup, send message to parent
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            credentials: credentials
          }, window.location.origin);

          // Close popup after a short delay
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          // If not a popup, redirect to preview page
          setTimeout(() => {
            navigate('/preview');
          }, 2000);
        }

      } catch (err) {
        console.error('Callback error:', err);
        setError(err.message);
        setStatus('error');

        // If opened in popup, send error to parent
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: err.message
          }, window.location.origin);

          setTimeout(() => {
            window.close();
          }, 2000);
        }
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      {status === 'processing' && (
        <>
          <div className="spinner" style={{ marginBottom: '1rem' }}></div>
          <h2>Processing authentication...</h2>
        </>
      )}

      {status === 'authenticating' && (
        <>
          <div className="spinner" style={{ marginBottom: '1rem' }}></div>
          <h2>Authenticating with Google...</h2>
        </>
      )}

      {status === 'success' && (
        <>
          <div style={{ fontSize: '3rem', color: '#28a745', marginBottom: '1rem' }}>✓</div>
          <h2>Authentication successful!</h2>
          <p>You can close this window or you'll be redirected shortly...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '1rem' }}>✗</div>
          <h2>Authentication failed</h2>
          <p style={{ color: '#666' }}>{error}</p>
          <p>This window will close automatically...</p>
        </>
      )}
    </div>
  );
}
