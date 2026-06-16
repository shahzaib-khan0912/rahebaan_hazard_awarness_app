import { useState, useEffect, useCallback } from "react";
import { fetchHazards } from "../services/hazardService";

/**
 * Hook to fetch and manage hazard data from Supabase.
 * @returns {{ hazards: Array, loading: boolean, error: string|null, refetch: () => void }}
 */
export function useHazards() {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHazards();
      setHazards(data);
    } catch (err) {
      console.error("useHazards error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { hazards, loading, error, refetch: load };
}
