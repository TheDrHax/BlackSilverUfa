import React from 'react';
// Components
import { Container, Row } from 'react-bootstrap';
import FooterLinksGroup from './footer-links-group';
// Namespace
import { common as t } from '../../constants/texts';
// Utils
import { interpolate } from '../../utils/text';

export const USEFUL_LINKS = [
  {
    label: t.footer.repositoryLabel,
    link: 'https://github.com/TheDrHax/BlackSilverUfa/',
    iconClass: 'fa-github',
  },
  {
    label: t.footer.channelLabel,
    link: 'https://t.me/BlackUFA_Monitor',
    iconClass: 'fa-telegram',
  },
  {
    label: t.footer.denialLabel,
    link: 'https://matomo.thedrhax.pw/index.php?module=CoreAdminHome&action=optOut&language=ru',
  },
];

export const CHANNEL_LINKS = [
  {
    label: 'BlackSilverUFA',
    link: 'https://www.youtube.com/user/BlackSilverUFA',
    iconClass: 'fa-youtube',
  },
  {
    label: 'BlackSilverChannel',
    link: 'https://www.youtube.com/user/BlackSilverChannel',
    iconClass: 'fa-youtube',
  },
  {
    label: 'BlackUFA',
    link: 'https://www.twitch.tv/blackufa/',
    iconClass: 'fa-twitch',
  },
];

export const NETWORK_LINKS = [
  {
    label: t.footer.vkgroupLabel,
    link: 'https://vk.com/b_silver',
    iconClass: 'fa-vk',
  },
  {
    label: t.footer.vkLabel,
    link: 'https://vk.com/blacksilverufa',
    iconClass: 'fa-vk',
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/Sempai_Black',
    iconClass: 'fa-twitter',
  },
];

const Footer = () => {
  const now = new Date().getFullYear();
  return (
    <footer className="page-footer font-small bg-dark text-white pt-4">
      <Container>
        <Row>
          <FooterLinksGroup title={t.footer.linksTitle} links={USEFUL_LINKS} md={6} />
          <FooterLinksGroup title={t.footer.channelsTitle} links={CHANNEL_LINKS} lg={3} md={6} />
          <FooterLinksGroup title={t.footer.networksTitle} links={NETWORK_LINKS} lg={3} md={6} />
        </Row>
      </Container>
      <div className="footer-copyright py-3 text-center small">
        <i className="far fa-copyright" />
        {interpolate(t.footer.signature, { now })}
        {' '}
        <a href="https://www.youtube.com/watch?v=Bxj09aAOFaI&lc=UgwQmdNhl4TMNn9-Gg94AaABAg.8ZY93MRq32E8ZY9W3KGSJS">
          {t.footer.commentLink}
        </a>
        {' '}
        <a href="/static/images/answer.jpg">{t.footer.screenshotLink}</a>
        .
      </div>
    </footer>
  );
};

export default Footer;
