import { useEffect, useMemo, useState } from 'react';
import { getBiensFilters } from '../api/biens';
import { fallbackBiensFilters, mapBiensFiltersToUi } from '../api/mappers';
import type { UiBienFilters } from '../types/ui';

let cachedFilters: UiBienFilters | null = null;
let cachedPromise: Promise<UiBienFilters> | null = null;

export const useBiensFilters = () => {
  const [filters, setFilters] = useState<UiBienFilters>(cachedFilters ?? fallbackBiensFilters);
  const [loading, setLoading] = useState(!cachedFilters);
  const [error, setError] = useState<unknown>(null);

  const fallback = useMemo(() => fallbackBiensFilters, []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        if (!cachedPromise) {
          cachedPromise = getBiensFilters().then((data) => mapBiensFiltersToUi(data));
        }
        const result = await cachedPromise;
        cachedFilters = result;
        if (isMounted) {
          setFilters(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setFilters(fallback);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!cachedFilters) {
      void load();
    }

    return () => {
      isMounted = false;
    };
  }, [fallback]);

  return { filters, loading, error };
};
