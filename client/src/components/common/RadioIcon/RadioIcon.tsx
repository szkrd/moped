import { FC } from 'react';
import { IStoredSong } from '../../../state/favoritesState';
import asiadreamUrl from './images/asiadream.png';
import decennialUrl from './images/decennial.png';
import missingUrl from './images/missing.png';
import nachtflugUrl from './images/nachtflug.png';
import offlineUrl from './images/offline.png';
import onlineUrl from './images/online.png';
import somaUrl from './images/soma.png';

interface IRadioIcon {
  song: Partial<IStoredSong>;
}

interface IImage {
  src: string;
  alt: string;
}

const getRadioIcon = (song: Partial<IStoredSong>): IImage => {
  const name = song.name ?? '';
  if (name.includes('J-Pop Sakura') || name.includes('Asia DREAM')) {
    return { src: asiadreamUrl, alt: 'Asia Dream Radio' };
  } else if (name.includes('Radio Nachtflug')) {
    return { src: nachtflugUrl, alt: 'Radio Nachtflug' };
  } else if (name.includes('Decennial Gothica')) {
    return { src: decennialUrl, alt: 'Decennial Gothica' };
  } else if ((song.location ?? '').includes('SomaFM')) {
    return { src: somaUrl, alt: 'Soma FM' };
  } else if ((song.location ?? '').startsWith('online')) {
    return { src: onlineUrl, alt: 'online' };
  } else if ((song.location ?? '').startsWith('local')) {
    return { src: offlineUrl, alt: 'local' };
  } else {
    return { src: missingUrl, alt: '?' };
  }
};

export const RadioIcon: FC<IRadioIcon> = ({ song }) => {
  const imgProps = getRadioIcon(song); // we can't call this props, because... because eslint plugin is buggy
  return <img src={imgProps.src} width="32" height="32" alt={imgProps.alt} />;
};
