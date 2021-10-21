import { useEffect } from 'react';
import config from '../../../config/config.json';

export const useTitle = (name) => {
  useEffect(() => {
    document.title = `${name} | ${config.title}`;
  }, [name]);
};
