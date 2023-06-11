import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

const SEGMENT_HASH_REGEX = /^([0-9]+(\.[0-9]+|,)?)+$/;

function RedirectLinks() {
  const { game } = useParams();
  let { location: { hash } } = useHistory();

  let segment = '';
  let search = '';

  hash = hash.substr(1);

  if (hash.length > 0) {
    const index = hash.indexOf('?');
    if (index !== -1) {
      [segment, search] = hash.split('?');
      segment = `/${segment}`;
      search = `?${search}`;
    } else {
      segment = `/${hash}`;
    }
  }

  return (
    <Redirect
      to={{
        pathname: `/play/${game}${segment}${search}`,
        search,
        state: { autostart: true },
      }}
    />
  );
}

function RedirectR() {
  const { location: { search, pathname } } = useHistory();
  let query;

  if (pathname.split('/').filter((p) => p).length === 1) {
    query = search.substring(1);
  } else {
    query = pathname.split('/').slice(2).join('/') + search;
  }

  if (query.length === 0) {
    return <Redirect to="/" />;
  }

  let [hash, params] = query
    .replaceAll(/%3F/g, '?')
    .replaceAll(/%2F/g, '/')
    .replaceAll(/%2C/g, ',')
    .split('?');

  const parts = hash.split('/');

  let game;
  let segment;
  let timecode;

  if (!parts[0].match(SEGMENT_HASH_REGEX)) {
    [game, segment, timecode] = parts;

    if (!segment) {
      return <Redirect to={`/play/${game}`} />;
    }
  } else {
    [segment, timecode] = parts;
  }

  // Legacy timecodes support
  if (timecode && !params) {
    params = `t=${timecode}`;
  }

  // Strip .0 from segments
  if (segment.endsWith('.0')) {
    segment = segment.substr(0, segment.length - 2);
  }

  params = params ? `?${params}` : '';

  return (
    <Redirect
      to={{
        pathname: `/play/unknown/${segment}`,
        search: params,
        state: { autostart: true },
      }}
    />
  );
}

export { RedirectLinks, RedirectR };
