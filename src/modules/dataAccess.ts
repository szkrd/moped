import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { log } from './log';

const getFileName = (fileName: string) => path.join(__dirname, `../../data/${fileName}`);

async function read(fileName: string) {
  fileName = getFileName(fileName);
  if (!existsSync(fileName)) return [];
  const text: string = await readFile(fileName, 'utf-8');
  let ret = [];
  try {
    ret = JSON.parse(String(text));
  } catch (err) {
    log.error(`Error parsing "${fileName}"!`, err);
  }
  return ret;
}

async function write(fileName: string, data: any[]) {
  await writeFile(getFileName(fileName), JSON.stringify(data, null, 2), 'utf-8');
}

async function upsert(fileName: string, item: any, matcherFn: (a: any, b: any) => boolean) {
  const data = await read(fileName);
  matcherFn = matcherFn ?? ((a: any, b: any) => a.id === (b.id ?? -1));
  const idx = data.findIndex((el: any) => matcherFn(el, item));
  if (idx === -1) {
    log.info(`Inserting new data to "${fileName}"`);
    data.push({ ...item, id: getNewId(data) });
  }
  if (idx >= 0) {
    log.info(`Updating existing data in "${fileName}"`);
    Object.assign(data[idx], item);
  }
  await write(fileName, data);
}

async function insert(fileName: string, item: any, onBeforeWrite: (data: any[]) => void) {
  const data = await read(fileName);
  data.push({ ...item, id: getNewId(data) });
  if (onBeforeWrite) onBeforeWrite(data);
  await write(fileName, data);
}

async function deleteById(fileName: string, id: number) {
  const data = await read(fileName);
  await write(
    fileName,
    data.filter((item: any) => item.id !== id)
  );
}

function getNewId(data: any[]) {
  let lastId = 0;
  data.forEach((item) => {
    if (lastId < item.id) lastId = item.id;
  });
  return lastId + 1;
}

export const dataAccess = {
  read,
  write,
  insert,
  upsert,
  getNewId,
  deleteById,
};
