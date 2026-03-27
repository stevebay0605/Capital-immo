import { useEffect, useState } from 'react';
import { defaultEntrepriseInfo } from '../api/defaults';
import { getEntreprise } from '../api/entreprise';
import { mapEntrepriseToUi } from '../api/mappers';
import type { UiEntrepriseInfo } from '../types/ui';

let cachedEntreprise: UiEntrepriseInfo | null = null;
let cachedPromise: Promise<UiEntrepriseInfo> | null = null;

export const useEntrepriseInfo = () => {
  const [entreprise, setEntreprise] = useState<UiEntrepriseInfo>(
    cachedEntreprise ?? defaultEntrepriseInfo
  );
  const [loading, setLoading] = useState(!cachedEntreprise);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        if (!cachedPromise) {
          cachedPromise = getEntreprise().then((data) => mapEntrepriseToUi(data));
        }
        const result = await cachedPromise;
        cachedEntreprise = result;
        if (isMounted) {
          setEntreprise(result);
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

    if (!cachedEntreprise) {
      void load();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return { entreprise, loading, error };
};
