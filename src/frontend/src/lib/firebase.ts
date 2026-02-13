// Firebase Realtime Database configuration and mock implementation
// This provides a working interface that matches Firebase RTDB API
// To enable real Firebase: install 'firebase' package and update imports

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDu9Lo3-ElvB8stK3xPgCgW2gmYP-tkqxE",
  authDomain: "forest-fire-iot-new.firebaseapp.com",
  databaseURL: "https://forest-fire-iot-new-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "forest-fire-iot-new",
  storageBucket: "forest-fire-iot-new.firebasestorage.app",
  messagingSenderId: "684327971880",
  appId: "1:684327971880:web:501c085bc31d79bd36191d"
};

// Type definitions for Firebase-compatible interface
interface DatabaseReference {
  path: string;
}

interface DataSnapshot {
  val(): any;
}

type FirebaseCallback = (snapshot: DataSnapshot) => void;
type FirebaseErrorCallback = (error: Error) => void;

// Database interface that matches Firebase RTDB API
interface DatabaseInterface {
  ref(path: string): DatabaseReference;
  onValue(
    ref: DatabaseReference,
    callback: FirebaseCallback,
    errorCallback?: FirebaseErrorCallback
  ): () => void;
  off(ref: DatabaseReference): void;
}

// Mock Firebase Realtime Database implementation
// This simulates Firebase behavior and can connect to real RTDB via REST API
class MockFirebaseDatabase implements DatabaseInterface {
  private listeners: Map<string, Set<FirebaseCallback>> = new Map();
  private pollingIntervals: Map<string, number> = new Map();
  private cache: Map<string, any> = new Map();

  ref(path: string): DatabaseReference {
    return { path };
  }

  onValue(
    reference: DatabaseReference,
    callback: FirebaseCallback,
    errorCallback?: FirebaseErrorCallback
  ): () => void {
    const path = reference.path;
    
    // Initialize listener set for this path
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    
    const callbacks = this.listeners.get(path)!;
    callbacks.add(callback);

    // Start polling Firebase REST API for this path
    this.startPolling(path, errorCallback);

    // Initial fetch
    this.fetchData(path, callback, errorCallback);

    // Return unsubscribe function
    return () => {
      const cbs = this.listeners.get(path);
      if (cbs) {
        cbs.delete(callback);
        if (cbs.size === 0) {
          this.stopPolling(path);
          this.listeners.delete(path);
        }
      }
    };
  }

  off(reference: DatabaseReference): void {
    const path = reference.path;
    this.stopPolling(path);
    this.listeners.delete(path);
    this.cache.delete(path);
  }

  private startPolling(path: string, errorCallback?: FirebaseErrorCallback): void {
    // Don't start multiple polling intervals for the same path
    if (this.pollingIntervals.has(path)) {
      return;
    }

    // Poll every 5 seconds for updates
    const intervalId = window.setInterval(() => {
      const callbacks = this.listeners.get(path);
      if (callbacks && callbacks.size > 0) {
        callbacks.forEach(callback => {
          this.fetchData(path, callback, errorCallback);
        });
      }
    }, 5000);

    this.pollingIntervals.set(path, intervalId);
  }

  private stopPolling(path: string): void {
    const intervalId = this.pollingIntervals.get(path);
    if (intervalId !== undefined) {
      window.clearInterval(intervalId);
      this.pollingIntervals.delete(path);
    }
  }

  private async fetchData(
    path: string,
    callback: FirebaseCallback,
    errorCallback?: FirebaseErrorCallback
  ): Promise<void> {
    try {
      // Construct Firebase REST API URL
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      const url = `${firebaseConfig.databaseURL}/${cleanPath}.json`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Firebase fetch failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Only trigger callback if data has changed
      const cachedData = this.cache.get(path);
      if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
        this.cache.set(path, data);
        callback({
          val: () => data
        });
      }
    } catch (error) {
      console.warn('Firebase REST API fetch failed, returning null:', error);
      // On error, return null (empty database)
      if (errorCallback) {
        errorCallback(error as Error);
      } else {
        // Still call the callback with null to indicate empty state
        callback({
          val: () => null
        });
      }
    }
  }
}

// Create database instance
const database = new MockFirebaseDatabase();

// Export database instance and helper functions
export { database, firebaseConfig };

export function ref(db: DatabaseInterface, path: string): DatabaseReference {
  return db.ref(path);
}

export function onValue(
  reference: DatabaseReference,
  callback: FirebaseCallback,
  errorCallback?: FirebaseErrorCallback
): () => void {
  return database.onValue(reference, callback, errorCallback);
}

export function off(reference: DatabaseReference): void {
  database.off(reference);
}

// Helper to check if Firebase is initialized
export function isFirebaseReady(): boolean {
  return true; // Mock is always ready
}

// Type exports for use in other files
export type { DatabaseReference, DataSnapshot, FirebaseCallback, FirebaseErrorCallback };
