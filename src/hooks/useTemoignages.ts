import { useEffect, useMemo, useState } from 'react';
import { getTemoignages, type TemoignageQueryParams } from '../api/temoignages';
import { mapTemoignageToUi } from '../api/mappers';
import type { UiTemoignage } from '../types/ui';

export const useTemoignages = (params: TemoignageQueryParams = { active_only: true }) => {
  const [temoignages, setTemoignages] = useState<UiTemoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const paramsKey = useMemo(() => JSON.stringify(params ?? {}), [params]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getTemoignages(params);
        if (isMounted) {
          setTemoignages(data.map(mapTemoignageToUi));
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [paramsKey]);

  return { temoignages, loading, error };
};
