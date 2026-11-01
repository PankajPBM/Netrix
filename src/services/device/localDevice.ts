/**
 * NETRIX Local Host Device Identity Manager
 * Manages the client's persistent NETRIX ID and host registration
 */

const LOCAL_DEVICE_STORAGE_KEY = 'netrix_local_device_id';
const LOCAL_DEVICE_PIN_KEY = 'netrix_local_device_pin';

function generateRandomSegment(): string {
  const num = Math.floor(100 + Math.random() * 900);
  return String(num);
}

export function getLocalNetrixId(): string {
  let id = localStorage.getItem(LOCAL_DEVICE_STORAGE_KEY);
  if (!id) {
    id = `${generateRandomSegment()} ${generateRandomSegment()} ${generateRandomSegment()}`;
    localStorage.setItem(LOCAL_DEVICE_STORAGE_KEY, id);
  }
  return id;
}

export function getNormalizedLocalNetrixId(): string {
  return getLocalNetrixId().replace(/\s+/g, '');
}

export function getLocalOneTimePassword(): string {
  let pin = localStorage.getItem(LOCAL_DEVICE_PIN_KEY);
  if (!pin) {
    pin = String(Math.floor(1000 + Math.random() * 9000));
    localStorage.setItem(LOCAL_DEVICE_PIN_KEY, pin);
  }
  return pin;
}

export function regenerateOneTimePassword(): string {
  const pin = String(Math.floor(1000 + Math.random() * 9000));
  localStorage.setItem(LOCAL_DEVICE_PIN_KEY, pin);
  return pin;
}


