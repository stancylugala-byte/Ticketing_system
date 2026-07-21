/**
 * logoStorage.js
 * Stores large base64 blobs (logo, favicon) in IndexedDB so they
 * never hit localStorage's ~5 MB quota.
 */

const DB_NAME    = 'jpa_assets';
const DB_VERSION = 1;
const STORE_NAME = 'blobs';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

export async function saveBlob(key, value) {
  const db  = await openDB();
  const tx  = db.transaction(STORE_NAME, 'readwrite');
  const st  = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const req = st.put(value ?? '', key);
    req.onsuccess = () => resolve();
    req.onerror   = (e) => reject(e.target.error);
  });
}

export async function loadBlob(key) {
  const db  = await openDB();
  const tx  = db.transaction(STORE_NAME, 'readonly');
  const st  = tx.objectStore(STORE_NAME);
  return new Promise((resolve) => {
    const req = st.get(key);
    req.onsuccess = (e) => resolve(e.target.result ?? '');
    req.onerror   = () => resolve('');
  });
}

export async function deleteBlob(key) {
  const db  = await openDB();
  const tx  = db.transaction(STORE_NAME, 'readwrite');
  const st  = tx.objectStore(STORE_NAME);
  return new Promise((resolve) => {
    const req = st.delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => resolve();
  });
}
