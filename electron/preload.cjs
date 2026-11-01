const { contextBridge } = require('electron');

// Expose safe platform APIs to window if needed
contextBridge.exposeInMainWorld('netrixDesktop', {
  isElectron: true,
  platform: process.platform,
  version: '1.0.0',
});
