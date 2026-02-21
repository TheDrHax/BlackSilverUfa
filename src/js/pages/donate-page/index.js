import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Components
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { Layout } from '../../components';
import SimpleTooltip from './simple-tooltip';
import { renderTemplate } from '../../utils/text-utils';

const CardModal = ({ name, imgSrc, href, children }) => {
  const [show, setShow] = useState(false);

  let handleOpen = null;

  if (children) {
    handleOpen = (e) => {
      if (e) e.preventDefault();
      setShow(true);
    };
  }

  const handleClose = () => setShow(false);

  return (
    <>
      <Col xs={6} sm={6} md={6} lg={4} xl={3} className="pb-4">
        <Card as="a" href={href} onClick={handleOpen} className="text-white pt-2">
          <Card.Img variant="top" src={imgSrc} style={{ padding: '0 20% 0' }} />
          <Card.Body className="d-flex justify-content-center">
            <Card.Text>{name}</Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

CardModal.propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  href: PropTypes.string,
};

CardModal.defaultProps = {
  href: '#',
};

const siteAge = () => renderTemplate(
  'последни{n#й,е,е} {n} {n#год,года,лет}',
  {
    n: new Date().getFullYear() - 2017,
  },
);

const DonatePage = () => (
  <Layout isLoading={false} title="Поддержать проект">
    <Row>
      <Col>
        <h1 className="text-white pt-2">Поддержать проект</h1>
      </Col>
    </Row>

    <Row className="text-white pt-2 px-3">
      <p>Привет! Надеюсь, что мой архив был вам полезен!</p>

      <p>
        За {siteAge()} я потратил огромное количество времени и сил на создание и поддержку
        этого сайта. Помимо самого сайта пришлось создать много дополнительных инструментов
        и скриптов. Вокруг этого проекта выстроилась целая большая система, которая практически
        всё делает сама. Но некоторые вещи автоматикой не заменить, поэтому я до сих пор
        вручную делаю все таймкоды, вношу новые стримы в базу и исправляю сломанные записи.
      </p>

      <p>
        Я предпочитаю не добавлять рекламу в свои проекты, поэтому ниже перечислены способы,
        которыми вы можете поддержать разработку.
        А взамен с меня: этот сайт, таймкоды на YouTube, записи чата
        {', '}

        <SimpleTooltip text="чистые записи стримов">
          На моих записях звук не удаляется на стороне Twitch, так как я пишу в прямом эфире.
        </SimpleTooltip>
        {', '}

        <a href="https://youtube.com/channel/UC7sAcEnPPqQqkf1IwWOWF-g">
          резервный YouTube-канал
        </a>
        {' '}
        с перезаливами
        {', '}

        ежедневная
        {' '}
        <SimpleTooltip text="проверка записей">
          Все записи, перечисленные на этом сайте, проверяются раз в сутки. Сломанные видео
          обычно исправляются и перезаливаются в тот же день.
        </SimpleTooltip>
        {', '}

        <SimpleTooltip text="торренты">
          Записи за последние 2 месяца (примерно) хранятся у меня на сервере и
          раздаются через торренты. Вы можете найти ссылку на странице конкретного стрима.
        </SimpleTooltip>
        {', '}

        <SimpleTooltip text="весёлый бот в чате">
          TheDrHaxBot расскажет вам про мемы канала, найдёт запись любого стрима,
          покажет всё, что было на текущем стриме, и что написано в анонсе, и,
          если понадобится, даже отразит атаки спам-ботов!
        </SimpleTooltip>
        {', '}

        <a href="https://t.me/blackufa_monitor">
          <SimpleTooltip text="Telegram-канал">
            Уведомления о новых видео на YouTube, начале и изменении стримов, а также
            всех новых твитах Артура.
          </SimpleTooltip>
        </a>
        {', '}

        <a href="https://github.com/BlackSilverUfa/data">
          <SimpleTooltip text="открытая база данных">
            Все стримы, игры и таймкоды, представленные на этом сайте, находятся в этой базе.
          </SimpleTooltip>
        </a>
        {' '}

        и полезные инструменты для работы с записями:
        {' '}
        <a href="https://github.com/TheDrHax/Twitch-Utils">
          <SimpleTooltip text="Twitch-Utils">
            Записывает стримы с самого начала, собирает их по частям в случае ошибок,
            удаляет музыку с помощью нейросети и сравнивает два видео по звуку.
          </SimpleTooltip>
        </a>
        {' и '}

        <a href="https://github.com/TheDrHax/Twitch-Chat-Downloader">
          <SimpleTooltip text="Twitch-Chat-Downloader">
            Скачивает логи чата конкретного стрима и сохраняет их в виде субтитров.
          </SimpleTooltip>
        </a>.
      </p>
    </Row>
    <Row className="text-white mt-4 ms-2 me-2 d-flex justify-content-center">
      <CardModal
        name="Boosty"
        imgSrc="/static/images/boosty.png"
        href="https://boosty.to/thedrhax"
      />
      {/* <CardModal name="Система быстрых платежей" imgSrc="/static/images/sbp.png">
        <p>Номер телефона: <code>+79773102862</code></p>
        <p>Банк: <code>ЮМани</code></p>
      </CardModal> */}
      <CardModal name="Сбер" imgSrc="/static/images/sber.png">
        <p>Номер карты: <code>4276380128807448</code></p>
        <p>Имя (для проверки): Дмитрий Степанович К.</p>
      </CardModal>
      <CardModal name="Ю.Money" imgSrc="/static/images/yoomoney.png">
        <p>Номер счёта: <code>410014087156910</code></p>
        <iframe
          title="yoomoney"
          src="https://yoomoney.ru/quickpay/shop-widget?writer=seller&targets=%D0%90%D1%80%D1%85%D0%B8%D0%B2%20%D1%81%D1%82%D1%80%D0%B8%D0%BC%D0%BE%D0%B2%20BlackUFA&targets-hint=&default-sum=&button-text=12&payment-type-choice=on&mobile-payment-type-choice=on&hint=&successURL=https%3A%2F%2Fdrhx.ru%2Fb&quickpay=shop&account=410014087156910&"
          width="100%"
          height="226"
          frameBorder="0"
          allowtransparency="true"
          scrolling="no"
        />
      </CardModal>
    </Row>
  </Layout>
);

export default DonatePage;
