import dayjs from 'dayjs';
import { last, omit } from 'lodash';
import { trimCutAll } from '../utils/string';
import { MpdCommand } from '../models/mpdCommand';
import { getSongLocation } from '../utils/mpd';
import { config } from './config';
import { dataAccess } from './dataAccess';
import { mpd } from './mpd';
import { status } from './status';

const dbName = 'history.json';

async function addCurrentSongToHistory() {
  const resp = await mpd.sendCommand(MpdCommand.CurrentSong);
  const song = omit(status.normalizeCurrentSong(resp), ['time', 'duration', 'pos', 'lastModified']);
  trimCutAll(song);
  song.location = getSongLocation(song);
  song.at = dayjs().format('YYYY-MM-DD HH:mm:ss');

  let history = await dataAccess.read(dbName);
  if (history.length > 0) {
    const lastItem: any = last(history);
    if (lastItem.formattedName === song.formattedName) {
      return; // nothing to do, same as the last song
    }
  }
  history.push({ ...song, id: dataAccess.getNewId(history) });
  const { maxHistory } = config;
  if (history.length > maxHistory) history = history.splice(maxHistory * -1);
  await dataAccess.write(dbName, history);
}

async function getSongHistory() {
  const history = await dataAccess.read(dbName);
  history.sort((a: any, b: any) => a.id > b.id).reverse();
  return history;
}

export const history = {
  addCurrentSongToHistory,
  getSongHistory,
};
