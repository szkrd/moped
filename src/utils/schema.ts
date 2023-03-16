import { parseBoolean, parseBooleanOrOneshot } from './boolean';
import { parseKeyValueMessage } from './mpd';
import { parseIntSafe } from './number';
import { objectKeys } from './typescript';

export enum SchemaType {
  Number = 'number',
  Boolean = 'boolean',
  BooleanOrOneshot = 'booleanOrOneshot',
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const noopConverter = (val: any, fallback: any) => val;

export function toSchema<T>(obj: Record<string, string> | string, schema: Record<SchemaType | string, '*' | string[]>) {
  if (typeof obj === 'string') obj = parseKeyValueMessage(obj);
  const ret = { ...obj };
  objectKeys(schema).forEach((sKey) => {
    let val = schema[sKey];
    if (val === '*') val = Object.keys(ret);
    let converter = noopConverter;
    let fallback: any;
    if (sKey === SchemaType.Number) {
      converter = parseIntSafe;
      fallback = -1;
    }
    if (sKey === SchemaType.BooleanOrOneshot) {
      converter = parseBooleanOrOneshot;
    }
    if (sKey === SchemaType.Boolean) {
      converter = parseBoolean;
    }
    if (!Array.isArray(val)) throw new Error('Unknown schema type.');
    val.forEach((rKey) => {
      if (rKey in ret) {
        ret[rKey] = converter(ret[rKey], fallback);
      }
    });
  });
  return ret as T;
}
