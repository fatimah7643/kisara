import { useCallback, useEffect, useState } from "react";

// Memuat data async untuk komponen. `deps` = nilai yang bila berubah memicu pemuatan ulang.
// data   : hasil terakhir; null saat memuat parameter baru (kecuali keepPrevious: true)
// loading: true selama memuat      error: ApiError bila gagal      reload(): muat ulang
export function useAsync(fn, deps = [], { keepPrevious = false } = {}) {
  const depsKey = JSON.stringify(deps);
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState({ depsKey: null, tick: -1, data: null, error: null });

  useEffect(() => {
    let active = true;
    fn().then(
      (data) => {
        if (active) setResult({ depsKey, tick, data, error: null });
      },
      (error) => {
        if (active) setResult({ depsKey, tick, data: null, error });
      }
    );
    return () => {
      active = false;
    };
    // fn sengaja tidak jadi dependensi: pemuatan ulang dikendalikan oleh deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey, tick]);

  const sameParams = result.depsKey === depsKey;
  const loading = !(sameParams && result.tick === tick);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  return {
    data: sameParams || keepPrevious ? result.data : null,
    error: sameParams ? result.error : null,
    loading,
    reload,
  };
}