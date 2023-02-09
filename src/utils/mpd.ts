import { camelCase } from './string';

const camelables = ['playlistLength', 'mixrampDb', 'nextSongId', 'nextSong', 'songId', 'mixrampDelay'];
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
