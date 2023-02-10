import { Ack, IMpdError } from '../models/mpdResponse/error';
import { parseIntSafe } from './number';
import { camelCase, split } from './string';

const camelables = [
  'playlistLength',
  'mixrampDb',
  'nextSongId',
  'nextSong',
  'songId',
  'mixrampDelay',
  'artistSort',
  'albumSort',
  'albumArtist',
  'albumArtistSort',
  'titleSort',
  'originalDate',
  'composerSort',
  'movementNumber',
  'artistId',
  'albumId',
  'albumArtistId',
  'trackId',
  'releaseTrackId',
  'workId',
];
const lowCamelables = camelables.map((text) => text.toLowerCase());

export function parseKeyValueMessage(text: string) {
  const lines = text.split('\n');
  return lines.reduce((acc, val) => {
    const splitIdx = val.indexOf(': ');
    if (splitIdx === -1) return acc;
    const keyPart = val.substring(0, splitIdx);
    const valuePart = val.substring(splitIdx + 2);
    let cameled = camelCase(keyPart);
    const camelablePos = lowCamelables.indexOf(cameled.toLowerCase());
    if (camelablePos > -1) {
      cameled = camelables[camelablePos];
    }
    acc[cameled] = valuePart; // use the proper camelcased key and assign the value
    if (cameled !== keyPart) delete acc[keyPart]; // remove the old key if we changed it
    return acc;
  }, {} as Record<string, string>);
}

export function parseMpdError(text: string): IMpdError {
  const rawMessage = text;
  let messageText = text;
  let currentCommand = '';
  let error = Ack.Unknown;
  let commandListNum = 0;
  if (text.startsWith('ACK ')) {
    // 1: [error@command_listNum
    // 2: {current_command} message_text
    const parts = split(text.replace(/^ACK /, ''), '] ');
    if (parts.length === 2) {
      const left = parts[0].replace(/^\[/, '');
      const right = parts[1];
      const currentAndMsg = split(right, '} '); // 1: {current_command 2: message_text
      const ackAndCmdList = split(left, '@'); // 1: error 2: command_listNum
      if (ackAndCmdList.length === 2) {
        const [ackPart, cmdListNumPart] = ackAndCmdList;
        error = parseIntSafe(ackPart, -1);
        commandListNum = parseIntSafe(cmdListNumPart, -1);
      }
      if (currentAndMsg.length === 2) {
        currentCommand = currentAndMsg[0].replace(/^\{/, '');
        messageText = currentAndMsg[1].replace(/\n+$/, '');
      }
    }
  }
  return {
    error,
    commandListNum,
    currentCommand,
    messageText,
    rawMessage,
  };
}

export function normalizeVersion(ver: string) {
  const parts = ver.split('.');
  if (parts.length === 1) parts.push('0');
  if (parts.length === 2) parts.push('0');
  return parseInt(parts.map((val) => val.padStart(3, '0')).join(''), 10);
}

// taken from mpd package
function parseArrayMessage(text: string) {
  const results: Record<string, string>[] = [];
  let obj: Record<string, string> = {};

  text.split('\n').forEach((part) => {
    if (!part.trim()) return;
    const keyValue = part.match(/([^ ]+): (.*)/);
    if (keyValue === null || keyValue.length !== 2) {
      throw new Error(`Could not parse entry "${part}" as array message.`);
    }
    if (obj[keyValue[1]] !== undefined) {
      results.push(obj);
      obj = {};
      obj[keyValue[1]] = keyValue[2];
    } else {
      obj[keyValue[1]] = keyValue[2];
    }
  });
  results.push(obj);
  return results;
}

export const parseMpdMessage = {
  asKeyValue: parseKeyValueMessage,
  asArray: parseArrayMessage,
};
