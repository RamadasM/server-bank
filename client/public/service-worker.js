if ('serviceWorker' in navigator) {
    window.addEventListener('DOMContentLoaded', () => {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/KYC/' }) // Adjust the scope according to your KYC page path
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Failed to register Service Worker:', error);
        });
    });
  }
  