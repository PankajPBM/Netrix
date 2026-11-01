/**
 * NETRIX Local Host Device Identity Manager
 * Manages the client's persistent NETRIX ID and host registration
 */

const LOCAL_DEVICE_STORAGE_KEY = 'netrix_local_device_id';

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

