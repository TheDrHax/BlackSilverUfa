import { useEffect, useState } from 'react';
import { Data } from '../data';

export const useDataStore = () => {
  const [connections, setConnections] = useState({
    isReady: false,
    data: {},
  });

  useEffect(() => {
    Data.then((data) => {
      setConnections({
        data,
        isReady: true,
      });
    });
  }, []);

  const { isReady, data } = connections;
  return { isReady, data };
};
