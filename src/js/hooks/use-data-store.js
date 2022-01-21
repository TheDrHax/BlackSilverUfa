import { useEffect, useState } from 'react';
import { Data } from '../data';

export const useDataStore = () => {
  const [connection, setConnection] = useState([{}, false]);

  useEffect(() => {
    Data.then((data) => {
      setConnection([data, true]);
    });
  }, []);

  return connection;
};
