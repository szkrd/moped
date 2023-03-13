import dayjs from 'dayjs';
import { dataAccess } from './dataAccess';
import { log } from './log';

const dbName = 'likes.json';

const trimCut = (text: string) =>
  String(text ?? '')
    .trim()
    .substring(0, 255)
    .replace(/\s+/g, ' ');

function normalizeSongData(data: any) {
  // let fileDomain = '';
  // if (data.file && String(data.file).startsWith('http')) {
  //   const url = new URL(data.file);
  //   fileDomain = url.hostname;
  // }
  return {
    name: trimCut(data.name),
    title: trimCut(data.title),
    file: trimCut(data.file),
    at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
}

async function addLike(currentSong: any) {
  if (!currentSong.title || !String(currentSong.title).trim()) {
    log.error('addLike failure, song has no title');
    return;
  }
  await dataAccess.upsert(dbName, normalizeSongData(currentSong), (a, b) => a.title === b.title);
}

export const like = {
  addLike,
};
