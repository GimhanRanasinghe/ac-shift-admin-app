import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

// Generic hook for API calls
export function useApi<T, E = any>(
  apiFunction: () => Promise<T>,
  initialData?: T,
  immediate: boolean = true
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      const axiosError = err as AxiosError<E>;
      setError(axiosError.response?.data as E || null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute().catch(err => {
        console.error('Error in useApi hook:', err);
      });
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}

// Example usage:
// const { data: equipment, loading, error } = useApi(() => equipmentService.getAll());
