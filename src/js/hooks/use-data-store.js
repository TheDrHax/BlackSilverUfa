import { useEffect, useState } from 'react';
import { Data } from '../data';

export const useDataStore = () => {
  const [connections, setConnections] = useState({
    isReady: false,
    results: {},
  });

  useEffect(() => {
    Data.then((results) => {
      setConnections({
        results,
        isReady: true,
      });
    });
  }, []);

  const { isReady, results } = connections;
  return { isReady, ...results };
};
