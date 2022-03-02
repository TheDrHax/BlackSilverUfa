import { useEffect, useRef, useState } from 'react';

export const usePlyrTime = (plyr, hash = (t) => t) => {
  const getTime = () => plyr?.currentTime || 0;
  const timeRef = useRef(getTime());
  const [currentTime, setTime] = useState(timeRef.current);

  useEffect(() => {
    const callback = () => {
      const newTime = getTime();
      if (hash(timeRef.current) !== hash(newTime)) {
        timeRef.current = newTime;
        setTime(newTime);
      }
    };

    plyr?.on('timeupdate', callback);

    return () => {
      plyr?.off('timeupdate', callback);
    };
  }, [plyr]);

  return currentTime;
};
