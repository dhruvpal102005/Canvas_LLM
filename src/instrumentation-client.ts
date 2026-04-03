/**
 * Next.js 16 Client Instrumentation
 * This file runs before hydration and is used to set up global error handling,
 * monitoring, and other side-effects.
 */

if (typeof window !== 'undefined') {
  // Suppress specific MetaMask extension errors that clutter the dev console/overlay
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorMessage = error?.message || String(error);
    const errorStack = error?.stack || '';

    // Extension IDs and names to ignore
    const METAMASK_EXTENSION_ID = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
    
    const isMetaMaskError = 
      errorMessage.includes('MetaMask') || 
      errorStack.includes(METAMASK_EXTENSION_ID) ||
      errorMessage.includes('Failed to connect to MetaMask');

    if (isMetaMaskError) {
      // Prevent the error from triggering the Next.js dev overlay
      event.preventDefault();
      
      // Optionally log a quiet note so the dev knows it was suppressed
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Instrumentation] Suppressed external MetaMask error:', errorMessage);
      }
    }
  });

  // Also catch generic extension errors that might happen in 'error' event
  window.addEventListener('error', (event) => {
    const errorStack = event.error?.stack || '';
    if (errorStack.includes('chrome-extension://')) {
      // If it's a known noisy extension, we could suppress it here too
      // But we'll stick to MetaMask for now as specifically requested.
    }
  });
}
