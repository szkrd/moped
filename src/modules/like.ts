import dayjs from 'dayjs';
import { omit } from 'lodash';
import { trimCutAll } from '../utils/string';
import { dataAccess } from './dataAccess';
import { log } from './log';

const dbName = 'likes.json';

function normalizeSongData(data: any) {
  // let fileDomain = '';
  // if (data.file && String(data.file).startsWith('http')) {
  //   const url = new URL(data.file);
  //   fileDomain = url.hostname;
  // }
  data = omit(trimCutAll(data), ['pos', 'duration', 'id', 'time', 'lastModified']);
  const ret = {
    ...data,
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

async function isLiked(currentSong: any) {
  if (!checkSongObject(currentSong)) return false;
  const likedSongs = await dataAccess.read(dbName);
  return likedSongs.findIndex((song: any) => song.formattedName === currentSong.formattedName) > -1;
}

export const like = {
  addLike,
  isLiked,
};
