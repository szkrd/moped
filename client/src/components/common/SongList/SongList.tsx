import { map, omit } from 'lodash';
import React, { FC, useCallback, useState } from 'react';
import { IStoredSong } from '../../../state/favoritesState';
import { RadioIcon } from '../RadioIcon/RadioIcon';
import styles from './SongList.module.scss';
import classNames from 'classnames';
import { ChevronDown, ChevronUp, Heart, Triangle, X } from 'react-feather';
import { Button } from '../Button/Button';
import { RelativeTime } from '../RelativeTime/RelativeTime';

interface ISongList {
  songs: Partial<IStoredSong>[];
  className?: string;
  onLikeClick?: (id: number) => void;
  onRemoveClick?: (id: number) => void;
}

export const SongList: FC<ISongList> = (props) => {
  const { songs } = props;
  const [opened, setOpened] = useState<number[]>([]);
  const onDetailsClick = useCallback(
    (event: any) => {
      const id = parseInt(event.currentTarget.dataset.id);
      if (opened.includes(id)) setOpened(opened.filter((cid) => cid !== id));
      else setOpened([...opened, id]);
    },
    [opened]
  );
  return (
    <ul className={classNames(styles.songList, props.className)}>
      {songs.map((song, idx) => (
        <li className={idx % 2 ? styles.odd : styles.even} key={song.id}>
          <h3>
            <span
              className={classNames(styles.name, styles.songListSongName)}
              data-id={song.id}
              onClick={onDetailsClick}
            >
              <RadioIcon song={song} />
              {song.formattedName}
            </span>
            <span className={styles.actions}>
              <Button dataId={song.id} onClick={onDetailsClick} selected={opened.includes(song.id ?? -1)}>
                {opened.includes(song.id ?? -1) ? <Triangle /> : <Triangle className={styles.detailsIconFlipped} />}
              </Button>
              {props.onLikeClick !== undefined && (
                <Button data-id={song.id}>
                  <Heart />
                </Button>
              )}
              {props.onRemoveClick !== undefined && (
                <Button data-id={song.id}>
                  <X />
                </Button>
              )}
            </span>
          </h3>
          {opened.includes(song.id ?? -1) && (
            <table className={styles.details}>
              <tbody>
                {/* basically another dumb key-value renderer */}
                {map(omit(song, ['liked', 'formattedName', 'id']), (value, key) => (
                  <tr key={key}>
                    <td>
                      <label className={styles.key}>{key}:</label>
                    </td>
                    <td>
                      {key === 'at' && !!value && typeof value === 'string' ? (
                        <RelativeTime at={value} />
                      ) : (
                        <span className={styles.value}>{value}</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <label>search:</label>
                  </td>
                  <td>todo</td>
                </tr>
              </tbody>
            </table>
          )}
        </li>
      ))}
    </ul>
  );
};
