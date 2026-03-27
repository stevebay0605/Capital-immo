import { useEffect, useMemo, useState } from 'react';
import { getServices, type ServiceQueryParams } from '../api/services';
import { mapServiceToUi } from '../api/mappers';
import type { UiService } from '../types/ui';

export const useServices = (params: ServiceQueryParams = { active_only: true }) => {
  const [services, setServices] = useState<UiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const paramsKey = useMemo(() => JSON.stringify(params ?? {}), [params]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getServices(params);
        if (isMounted) {
          setServices(data.map(mapServiceToUi));
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

  return { services, loading, error };
};
