import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { faDiscord, faGithub, faTelegram, faTwitch, faTwitter, faVk, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import FooterLinksGroup from './footer-links-group';
import { common as t } from '../../constants/texts';
import { renderTemplate } from '../../utils/text-utils';
import { FAIcon } from '../../utils/fontawesome';

export const USEFUL_LINKS = [
  {
    label: t.footer.repositoryLabel,
    link: 'https://github.com/TheDrHax/BlackSilverUfa/',
    icon: faGithub,
  },
  {
    label: t.footer.channelLabel,
    link: 'https://t.me/BlackUFA_Monitor',
    icon: faTelegram,
  },
  {
    label: t.footer.oldSiteLabel,
    link: 'https://old.bsu.drhx.ru',
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
    icon: faYoutube,
  },
  {
    label: 'BlackSilverChannel',
    link: 'https://www.youtube.com/user/BlackSilverChannel',
    icon: faYoutube,
  },
  {
    label: 'BlackUFA',
    link: 'https://www.twitch.tv/blackufa/',
    icon: faTwitch,
  },
];

export const NETWORK_LINKS = [
  {
    label: t.footer.vkgroupLabel,
    link: 'https://vk.com/b_silver',
    icon: faVk,
  },
  {
    label: t.footer.vkLabel,
    link: 'https://vk.com/blacksilverufa',
    icon: faVk,
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/Sempai_Black',
    icon: faTwitter,
  },
  {
    label: 'Discord',
    link: 'https://discord.com/invite/bsuanddw',
    icon: faDiscord,
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
        <FAIcon icon={faCopyright} />{' '}
        {renderTemplate(t.footer.signature, { now })}
        {' '}
        <a href="https://www.youtube.com/watch?v=Bxj09aAOFaI&lc=UgwQmdNhl4TMNn9-Gg94AaABAg.8ZY93MRq32E8ZY9W3KGSJS">
          {t.footer.commentLink}
        </a>
        {' '}
        (<a href="/static/images/answer.jpg">{t.footer.screenshotLink}</a>)
        .
      </div>
    </footer>
  );
};

export default Footer;
