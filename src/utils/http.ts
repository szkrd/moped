import { Response } from 'express';
import { IMpdError } from '../models/mpdResponse/error';
import { log } from '../modules/log';

export function invalidVersionError(res: Response, ver: string, field?: string) {
  res.status(400).json({ error: `mpd version ${ver} or greater required`, field });
}

export function invalidQueryParamError(res: Response, field: string | string[]) {
  res.status(400).json({ error: `invalid or missing query parameter ${JSON.stringify(field)}` });
}

export function thenSuccess(res: Response) {
  return (data: string) => {
    data = String(data).trim();
    if (data) log.warn('Unexpected non empty response will be treated as success.');
    res.status(200).json({ success: true });
  };
}

export function catchMpdError(res: Response) {
  return (error: IMpdError) => {
    res.status(500).json({ status: 500, error });
  };
}
