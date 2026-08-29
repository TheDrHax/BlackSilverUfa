import React, { useState, useMemo } from 'react';
import { Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PATHS from '../../constants/urls';
import Persist from '../../utils/persist';
import { useDataStore } from '../../hooks/use-data-store';

export default function BirthdayToast() {
  const [{ persist }] = useDataStore();

  const now = new Date();

  if (now.getMonth() != 7 || now.getDate() != 29) {
    return;
  }

  const data = Persist.load('birthday-toast', {
    closed: false,
    year: 0,
  });

  const [closed, setClosed] = useState(data.closed);

  const close = () => {
    data.closed = true;
    data.year = now.getFullYear();
    Persist.save('birthday-toast', {}, data, ['closed', 'year']);
    setClosed(true);
  };

  const show = data.year != now.getFullYear() && !closed;

  return (
    <Toast onClose={close} show={show} animation={false}>
      <Toast.Header closeVariant="white">Привет!</Toast.Header>
      <Toast.Body>
        Сегодня у автора этого сайта день рождения! 🎉
        Он занимается архивом уже {now.getFullYear() - 2017} из {now.getFullYear() - 1996} своих лет.
        Вы можете поздравить
        его <Link to={PATHS.DONATE} onClick={close}>здесь</Link> 👉👈
      </Toast.Body>
    </Toast>
  );
}
