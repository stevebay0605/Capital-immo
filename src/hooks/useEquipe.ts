import { useEffect, useMemo, useState } from 'react';
import { getEquipe, type EquipeQueryParams } from '../api/equipe';
import { mapMembreEquipeToUi } from '../api/mappers';
import type { UiMembreEquipe } from '../types/ui';

export const useEquipe = (params: EquipeQueryParams = { active_only: true }) => {
  const [equipe, setEquipe] = useState<UiMembreEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const paramsKey = useMemo(() => JSON.stringify(params ?? {}), [params]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getEquipe(params);
        if (isMounted) {
          setEquipe(data.map(mapMembreEquipeToUi));
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

  return { equipe, loading, error };
};
