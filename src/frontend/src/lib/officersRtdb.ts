// Firebase Realtime Database REST API helpers for Officers CRUD
// Provides direct persistence without requiring Internet Identity

import { firebaseConfig } from './firebase';

export interface Officer {
  name: string;
  mobileNumber: string;
}

interface FirebaseError {
  status: number;
  statusText: string;
  message: string;
}

// Helper to create detailed error messages
function createFirebaseError(response: Response, context: string): FirebaseError {
  return {
    status: response.status,
    statusText: response.statusText,
    message: `Firebase ${context} failed: ${response.status} ${response.statusText}`
  };
}

// Helper to handle fetch errors
function createNetworkError(error: unknown, context: string): FirebaseError {
  const message = error instanceof Error ? error.message : 'Unknown error';
  return {
    status: 0,
    statusText: 'Network Error',
    message: `Firebase ${context} failed: ${message}`
  };
}

/**
 * Fetch all officers from Firebase RTDB
 * Returns empty array if no officers exist or on error
 */
export async function getOfficersFromFirebase(): Promise<Officer[]> {
  try {
    const url = `${firebaseConfig.databaseURL}/officers.json`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn('Failed to fetch officers from Firebase:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Firebase returns null if path doesn't exist
    if (!data) {
      return [];
    }

    // Convert Firebase object to array
    // Firebase stores as { "officerName": { name, mobileNumber }, ... }
    return Object.values(data);
  } catch (error) {
    console.warn('Network error fetching officers from Firebase:', error);
    return [];
  }
}

/**
 * Add or update an officer in Firebase RTDB
 * Uses officer name as the key for idempotent updates
 * Throws detailed error on failure
 */
export async function upsertOfficerInFirebase(officer: Officer): Promise<void> {
  try {
    // Use name as key for idempotent updates
    const key = encodeURIComponent(officer.name);
    const url = `${firebaseConfig.databaseURL}/officers/${key}.json`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(officer),
    });

    if (!response.ok) {
      const error = createFirebaseError(response, 'write');
      throw new Error(error.message);
    }

    // Verify the response contains valid data
    const result = await response.json();
    if (!result) {
      throw new Error('Firebase write failed: No data returned');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Firebase')) {
      throw error; // Re-throw Firebase errors with context
    }
    const netError = createNetworkError(error, 'write');
    throw new Error(netError.message);
  }
}

/**
 * Delete an officer from Firebase RTDB
 * Throws detailed error on failure
 */
export async function deleteOfficerFromFirebase(name: string): Promise<void> {
  try {
    const key = encodeURIComponent(name);
    const url = `${firebaseConfig.databaseURL}/officers/${key}.json`;
    
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = createFirebaseError(response, 'delete');
      throw new Error(error.message);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Firebase')) {
      throw error; // Re-throw Firebase errors with context
    }
    const netError = createNetworkError(error, 'delete');
    throw new Error(netError.message);
  }
}
