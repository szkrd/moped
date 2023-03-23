import { map, omit } from 'lodash';
import React, { FC } from 'react';
import { IStoredSong } from '../../../state/favoritesState';
import { RadioIcon } from '../RadioIcon/RadioIcon';

interface ISongList {
  songs: Partial<IStoredSong>[];
}

export const SongList: FC<ISongList> = ({ songs }) => {
  return (
    <ul className="song-list">
      {songs.map((song, idx) => (
        <li className={idx % 2 ? 'odd' : 'even'} key={song.id}>
          <h3>
            <span className="name song-list-song-name">
              <RadioIcon song={song} />
              {song.formattedName}
            </span>
            <span className="actions">
              <button className="song-action-button song-button-details">details</button>
              <button className="song-action-button song-button-like-from-history" data-id={song.id}>
                like
              </button>
              <button className="song-action-button song-button-remove" data-id={song.id}>
                remove
              </button>
            </span>
          </h3>
          <table className="details">
            {/* basically another dumb key-value renderer */}
            {map(omit(song, ['liked', 'formattedName', 'id']), (value, key) => (
              <tr>
                <td>
                  <label className="key">{key}:</label>
                </td>
                <td>
                  {key === 'at' && value ? (
                    <span data-key="at" data-value={value}></span>
                  ) : (
                    <span className="value">{value}</span>
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
          </table>
        </li>
      ))}
    </ul>
  );
};
