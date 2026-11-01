const { contextBridge, ipcRenderer } = require('electron');

// Expose safe desktop capabilities to window.netrixDesktop
contextBridge.exposeInMainWorld('netrixDesktop', {
  isElectron: true,
  platform: process.platform,
  version: '1.0.0',

  // Screen Capture
  getScreenSources: () => ipcRenderer.invoke('netrix:get-screen-sources'),
  getPrimaryDisplay: () => ipcRenderer.invoke('netrix:get-primary-display'),

  // Native Input Injection (for incoming remote control requests)
  injectMouseMove: (x, y) => ipcRenderer.send('netrix:inject-mouse-move', { x, y }),
  injectMouseAction: (type, button, delta) => ipcRenderer.send('netrix:inject-mouse-action', { type, button, delta }),
  injectKeyboardAction: (type, keyCode) => ipcRenderer.send('netrix:inject-keyboard-action', { type, keyCode }),
});
