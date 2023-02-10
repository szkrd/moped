import { Response } from 'express';
import { IMpdError } from '../models/mpdResponse/error';

export function invalidVersionError(res: Response, ver: string) {
  res.status(400).json({ error: `mpd version ${ver} or greater required` });
}

export function catchMpdError(res: Response) {
  return (error: IMpdError) => {
    res.status(500).json({ status: 500, error });
  };
}
