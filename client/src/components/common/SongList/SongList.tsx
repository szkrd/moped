import classNames from 'classnames';
import { map, omit } from 'lodash';
import { FC, useCallback, useState } from 'react';
import { Heart, Triangle, X } from 'react-feather';
import { IPartialStoredSong } from '../../../state/favoritesState';
import { Button } from '../Button/Button';
import { RadioIcon } from '../RadioIcon/RadioIcon';
import { SearchButton } from '../SearchButton/SearchButton';
import { SongComment } from './SongComment/SongComment';
import styles from './SongList.module.scss';
import SongObjectValueRenderer from './SongObjectValueRenderer';

interface ISongList {
  songs: IPartialStoredSong[];
  className?: string;
  onLikeClick?: (song: IPartialStoredSong) => void;
  onRemoveClick?: (song: IPartialStoredSong) => void;
  withComments?: boolean;
}

export const SongList: FC<ISongList> = (props) => {
  const { songs, onLikeClick, onRemoveClick, withComments } = props;
  const [opened, setOpened] = useState<number[]>([]);
  // okay, capturing the id this (old) way is fine and performant/dry
  // we just can't reuse it in a sane way (see `useDatasetCallback` for the problem)
  const onDetailsClick = useCallback(
    (event: any) => {
      const id = parseInt(event.currentTarget.dataset.id, 10);
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
                <Button
                  dataId={song.id}
                  onClick={onLikeClick ? () => onLikeClick(song) : undefined}
                  selected={song.liked}
                  disabled={song.liked === true}
                >
                  <Heart />
                </Button>
              )}
              {props.onRemoveClick !== undefined && (
                <Button dataId={song.id} onClick={onRemoveClick ? () => onRemoveClick(song) : undefined}>
                  <X />
                </Button>
              )}
            </span>
          </h3>
          {opened.includes(song.id ?? -1) && (
            <table className={styles.details}>
              <tbody>
                {/* basically another dumb key-value renderer */}
                {map(omit(song, ['liked', 'formattedName', 'id', 'comment']), (value, key) => (
                  <tr key={key}>
                    <td>
                      <label className={styles.key}>{key}:</label>
                    </td>
                    <td>
                      <SongObjectValueRenderer keyName={key} value={value} className={styles.value} />
                    </td>
                  </tr>
                ))}
                {withComments && song.id !== undefined && (
                  <tr>
                    <td>
                      <label>comment:</label>
                    </td>
                    <td>
                      <SongComment id={song.id} text={song.comment} />
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <label>search:</label>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <SearchButton provider="google" searchText={song.formattedName} className={styles.searchButton} />
                      <SearchButton
                        provider="youtube"
                        searchText={song.formattedName}
                        className={styles.searchButton}
                      />
                      <SearchButton
                        provider="spotify"
                        searchText={song.formattedName}
                        className={styles.searchButton}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </li>
      ))}
    </ul>
  );
};
