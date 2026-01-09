'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Espera que la API devuelva:
 * [
 *   { id, nombre, posicion, rol, dorsal, activo, imagen_url }
 * ]
 * o bien { items: [...] }
 */
export function usePlantel({ endpoint = '/api/plantel', onlyActivas = true } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(endpoint, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        // acepta array directo o { items }
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.items)
          ? json.items
          : [];

        setData(list);
      } catch (e) {
        if (e?.name === 'AbortError') return;
        console.error(e);
        setError('No se pudo cargar el plantel.');
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [endpoint]);

  const jugadoras = useMemo(() => {
    return onlyActivas ? data.filter((p) => p?.activo) : data;
  }, [data, onlyActivas]);

  return { jugadoras, loading, error };
}
