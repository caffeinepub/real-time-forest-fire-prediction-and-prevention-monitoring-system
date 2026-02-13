import { useGetOfficers, useAddOrUpdateOfficer, useRemoveOfficer } from './useQueries';

export function useOfficers() {
  const { data: officers = [], isLoading } = useGetOfficers();
  return { officers, isLoading };
}

export function useAddOfficer() {
  return useAddOrUpdateOfficer();
}

export function useDeleteOfficer() {
  return useRemoveOfficer();
}
