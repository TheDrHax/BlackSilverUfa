import React, { useState, useMemo } from 'react';
import { Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PATHS from '../../constants/urls';
import Persist from '../../utils/persist';
import { useDataStore } from '../../hooks/use-data-store';

const VERSION = 3;

export default function DonateToast() {
  const [{ persist }] = useDataStore();
  const data = Persist.load('donate-toast', {
    closed: false,
    at: 0,
    version: VERSION - 1,
  });
  const [closed, setClosed] = useState(data.closed);

  const watched = useMemo(() => {
    if (!persist) return 0;
    const resume = persist.getCollection('resume_playback');
    return resume.count();
  }, [persist]);

  const close = () => {
    data.closed = true;
    data.at = watched;
    data.date = new Date();
    data.version = VERSION;
    Persist.save('donate-toast', {}, data, ['closed', 'at', 'date', 'version']);
    setClosed(true);
  };

  const show = watched >= 10 && (!closed || data.version !== VERSION);

  return (
    <Toast onClose={close} show={show} animation={false}>
      <Toast.Header closeVariant="white">Привет! Нравится сайт? 👀</Toast.Header>
      <Toast.Body>
        Разработка и постоянное наполнение отнимают много времени. Вы можете
        поддержать работу сайта <Link to={PATHS.DONATE} onClick={close}>здесь</Link> ❤️
      </Toast.Body>
    </Toast>
  );
}
