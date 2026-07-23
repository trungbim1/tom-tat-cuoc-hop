// Local Persistent Database Service using IndexedDB & localStorage
// Guarantees 100% Data Privacy (All saved locally in user's browser)

const DB_NAME = 'MeetMindDB';
const DB_VERSION = 1;
const STORE_NAME = 'meetings';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('title', 'title', { unique: false });
      }
    };
  });
}

export const dbService = {
  // Save or update a meeting record locally
  async saveMeeting(meeting) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record = {
          ...meeting,
          updatedAt: new Date().toISOString()
        };
        const request = store.put(record);
        request.onsuccess = () => resolve(record);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.warn('Fallback to localStorage:', err);
      const existing = JSON.parse(localStorage.getItem('meetmind_saved_meetings') || '[]');
      const index = existing.findIndex(m => m.id === meeting.id);
      if (index >= 0) {
        existing[index] = meeting;
      } else {
        existing.unshift(meeting);
      }
      localStorage.setItem('meetmind_saved_meetings', JSON.stringify(existing));
      return meeting;
    }
  },

  // Get all saved meetings
  async getAllMeetings() {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      return JSON.parse(localStorage.getItem('meetmind_saved_meetings') || '[]');
    }
  },

  // Delete a saved meeting
  async deleteMeeting(id) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('meetmind_saved_meetings') || '[]');
      const filtered = existing.filter(m => m.id !== id);
      localStorage.setItem('meetmind_saved_meetings', JSON.stringify(filtered));
      return true;
    }
  },

  // Clear all local data
  async clearAll() {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
    } catch (err) {
      localStorage.removeItem('meetmind_saved_meetings');
    }
  }
};
