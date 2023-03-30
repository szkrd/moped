import dayjs from 'dayjs';
import { isPlainObject, omit } from 'lodash';
import { getSongLocation } from '../utils/mpd';
import { trimCutAll } from '../utils/string';
import { dataAccess } from './dataAccess';
import { log } from './log';

const dbName = 'likes.json';
const MAX_PAYLOAD_SIZE = 2048;

function normalizeSongData(data: any, updateOnly = false) {
  const blacklist = ['pos', 'duration', 'time', 'lastModified', 'liked'];
  if (!updateOnly) blacklist.push('id');
  data = omit(trimCutAll(data), blacklist);
  if (JSON.stringify(data).length > MAX_PAYLOAD_SIZE) {
    log.error('[like] Data overflow error!');
    return false;
  }
  if (updateOnly) return { ...data };
  const ret = {
    ...data,
    location: getSongLocation(data),
    at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
  return ret;
}

function checkSongObject(currentSong: any) {
  if (
    !currentSong ||
    typeof currentSong !== 'object' ||
    !currentSong.formattedName ||
    !String(currentSong.formattedName).trim()
  ) {
    if (Object.keys(currentSong).length > 1) {
      log.error('[like] Song object has no formattedName', currentSong);
    }
    return false;
  }
  return true;
}

async function addLike(currentSong: any) {
  if (!checkSongObject(currentSong)) return false;
  const data = normalizeSongData(currentSong);
  if (!data) return false;
  await dataAccess.upsert(dbName, data, (a, b) => a.formattedName === b.formattedName);
  return true;
}

async function updateLike(currentSong: any) {
  if (!isPlainObject(currentSong) || typeof currentSong.id !== 'number') return false;
  const data = normalizeSongData(currentSong, true);
  if (!data) return false;
  await dataAccess.upsert(dbName, data);
  return true;
}

async function removeLike(id: number) {
  await dataAccess.deleteById(dbName, id);
}

async function isLiked(currentSong: any) {
  if (!checkSongObject(currentSong)) return false;
  const likedSongs = await dataAccess.read(dbName);
  return likedSongs.findIndex((song: any) => song.formattedName === currentSong.formattedName) > -1;
}

async function getLikedSongs() {
  const likedSongs = await dataAccess.read(dbName);
  likedSongs.sort((a: any, b: any) => a.id > b.id).reverse();
  return likedSongs;
}

export const like = {
  addLike,
  updateLike,
  removeLike,
  isLiked,
  getLikedSongs,
};
