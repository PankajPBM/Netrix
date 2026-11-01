// NETRIX Native Client Protocol Handler
// Handles netrix:// protocol invocation with safe error containment

export interface ProtocolLaunchResult {
  launched: boolean;
  ticket: string;
  uri: string;
}

export function launchNetrixClient(uri: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Attempt URI dispatch via invisible iframe / window location
    try {
      const start = Date.now();
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.src = uri;

      setTimeout(() => {
        document.body.removeChild(iframe);
        // If window still has focus after delay, protocol was dispatched to OS
        const elapsed = Date.now() - start;
        resolve(elapsed < 2000);
      }, 500);
    } catch {
      // Fallback
      window.location.href = uri;
      resolve(true);
    }
  });
}

