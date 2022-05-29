<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
% for game in games:
  % if len(game.streams) > 0:
    <url>
      <loc>${config['prefix']}/play/${game.id}</loc>
      <lastmod>${game.streams[-1].date.strftime('%Y-%m-%d')}</lastmod>
    </url>
  % endif
% endfor
</urlset> 