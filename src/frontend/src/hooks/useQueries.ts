import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOfficersFromFirebase, upsertOfficerInFirebase, deleteOfficerFromFirebase } from '../lib/officersRtdb';
import type { Officer } from '../lib/officersRtdb';

/**
 * Fetch officers from Firebase RTDB
 * No authentication required - works with local admin login
 */
export function useGetOfficers() {
  return useQuery<Officer[]>({
    queryKey: ['officers'],
    queryFn: getOfficersFromFirebase,
    staleTime: 10000, // Consider data fresh for 10 seconds
  });
}

/**
 * Add or update an officer in Firebase RTDB
 * Automatically refreshes the officers list on success
 */
export function useAddOrUpdateOfficer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, mobileNumber }: { name: string; mobileNumber: string }) => {
      await upsertOfficerInFirebase({ name, mobileNumber });
    },
    onSuccess: () => {
      // Invalidate and refetch officers list
      queryClient.invalidateQueries({ queryKey: ['officers'] });
    },
  });
}

/**
 * Delete an officer from Firebase RTDB
 * Automatically refreshes the officers list on success
 */
export function useRemoveOfficer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      await deleteOfficerFromFirebase(name);
    },
    onSuccess: () => {
      // Invalidate and refetch officers list
      queryClient.invalidateQueries({ queryKey: ['officers'] });
    },
  });
}
