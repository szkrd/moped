import React, { FC } from 'react';
import { RelativeTime } from '../RelativeTime/RelativeTime';

interface ISongObjectValueRenderer {
  keyName: string;
  value?: string | number | boolean;
  className?: string;
}

export const SongObjectValueRenderer: FC<ISongObjectValueRenderer> = ({ keyName, value, className }) => {
  if (keyName === 'at' && !!value && typeof value === 'string') {
    return <RelativeTime at={value} />;
  }
  if (keyName === 'file' && /^https?:\/\//.test(String(value))) {
    const match = String(value).match(/(^https?:\/\/[^/]*\/?)(.*)/);
    if (match?.length === 3) {
      return (
        <span className={className}>
          <a href={match[1]} target="_blank" rel="noreferrer">
            {match[1]}
          </a>
          {match[2] !== '' && <span>{match[2]}</span>}
        </span>
      );
    }
  }
  return <span className={className}>{value}</span>;
};

export default SongObjectValueRenderer;
