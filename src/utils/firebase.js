import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// Default / fallback Firebase config from Vite env variables
const getInitialFirebaseConfig = () => {
  try {
    const customConfig = localStorage.getItem('custom_firebase_config');
    if (customConfig) {
      const parsed = JSON.parse(customConfig);
      if (parsed?.apiKey && parsed?.projectId) return parsed;
    }
  } catch (e) {
    console.warn('Could not read custom firebase config', e);
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
  };
};

let dbInstance = null;
let currentConfig = getInitialFirebaseConfig();

/**
 * Checks whether Firebase is properly configured with required credentials
 */
export const isFirebaseConfigured = () => {
  return !!(currentConfig.apiKey && currentConfig.projectId);
};

/**
 * Initialize or retrieve Firestore Database instance
 */
export const getDb = () => {
  if (!isFirebaseConfigured()) return null;

  try {
    const app = !getApps().length ? initializeApp(currentConfig) : getApp();
    if (!dbInstance) {
      dbInstance = getFirestore(app);
    }
    return dbInstance;
  } catch (err) {
    console.warn('Firebase initialization error:', err);
    return null;
  }
};

/**
 * Real-time listener for workspace data across devices
 * @param {string} workspaceId - Unique identifier (e.g. user name or 'shared_workspace')
 * @param {function} onData - Callback when data updates in cloud
 * @returns {function} Unsubscribe function
 */
export const subscribeWorkspace = (workspaceId = 'default_workspace', onData) => {
  const db = getDb();
  if (!db) return () => {};

  try {
    const cleanId = (workspaceId || 'default_workspace').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const docRef = doc(db, 'taskmanager_workspaces', cleanId);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (cloudData && typeof onData === 'function') {
            onData(cloudData);
          }
        }
      },
      (error) => {
        console.warn('Firestore snapshot listener error:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to workspace:', err);
    return () => {};
  }
};

/**
 * Push workspace state (tasks, XP, streaks) to Firebase Cloud
 */
export const syncWorkspaceToCloud = async (workspaceId = 'default_workspace', data) => {
  const db = getDb();
  if (!db) return false;

  try {
    const cleanId = (workspaceId || 'default_workspace').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const docRef = doc(db, 'taskmanager_workspaces', cleanId);

    const payload = {
      ...data,
      lastSyncedAt: new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to sync workspace to Firebase cloud:', err);
    return false;
  }
};

/**
 * Fetch initial workspace state from Cloud
 */
export const fetchCloudWorkspace = async (workspaceId = 'default_workspace') => {
  const db = getDb();
  if (!db) return null;

  try {
    const cleanId = (workspaceId || 'default_workspace').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const docRef = doc(db, 'taskmanager_workspaces', cleanId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch from Firebase cloud:', err);
    return null;
  }
};

/**
 * Save custom Firebase Config from Admin UI
 */
export const saveCustomFirebaseConfig = (newConfig) => {
  try {
    localStorage.setItem('custom_firebase_config', JSON.stringify(newConfig));
    currentConfig = newConfig;
    dbInstance = null;
    return true;
  } catch (e) {
    console.error('Failed to save Firebase config', e);
    return false;
  }
};

/**
 * Get current active Firebase configuration
 */
export const getActiveFirebaseConfig = () => {
  return currentConfig;
};
