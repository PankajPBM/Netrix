/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_TAGLINE: string;
  readonly VITE_APP_COMPANY: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_PROTOCOL_SCHEME: string;
  readonly VITE_CLIENT_DOWNLOAD_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  netrixDesktop?: {
    isElectron: boolean;
    platform: string;
    version: string;
    getScreenSources: () => Promise<Array<{ id: string; name: string; thumbnail: string }>>;
    getPrimaryDisplay: () => Promise<{ width: number; height: number; scaleFactor: number }>;
    injectMouseMove: (x: number, y: number) => void;
    injectMouseAction: (type: 'mousedown' | 'mouseup' | 'wheel', button?: number, delta?: number) => void;
    injectKeyboardAction: (type: 'keydown' | 'keyup', keyCode: number) => void;
  };
}
