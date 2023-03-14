import dayjs from 'dayjs';
import { omit } from 'lodash';
import { getSongLocation } from '../utils/mpd';
import { trimCutAll } from '../utils/string';
import { dataAccess } from './dataAccess';
import { log } from './log';

const dbName = 'likes.json';
const MAX_PAYLOAD_SIZE = 2048;

function normalizeSongData(data: any) {
  data = omit(trimCutAll(data), ['pos', 'duration', 'id', 'time', 'lastModified', 'liked']);
  if (JSON.stringify(data).length > MAX_PAYLOAD_SIZE) {
    throw new Error('Data overflow error!');
  }
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
    log.error('addLike failure, song has no formattedName');
    return false;
  }
  return true;
}

async function addLike(currentSong: any) {
  if (!checkSongObject(currentSong)) return false;
  await dataAccess.upsert(dbName, normalizeSongData(currentSong), (a, b) => a.formattedName === b.formattedName);
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
  removeLike,
  isLiked,
  getLikedSongs,
};
