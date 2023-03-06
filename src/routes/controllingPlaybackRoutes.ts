import { Express } from 'express';
import { MpdCommand } from '../models/mpdCommand';
import { mpd } from '../modules/mpd';
import { parseBoolean } from '../utils/boolean';
import { catchMpdError, invalidQueryParamError, thenSuccess } from '../utils/http';
import { parseFloatRelativeSafe, parseFloatSafe, parseIntSafe } from '../utils/number';
import { stringOrUndefined } from '../utils/string';

// previous
// Plays previous song in the playlist.
function GET_previous(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    mpd.sendCommand(MpdCommand.Previous).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// next
// Plays next song in the playlist.
function GET_next(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    mpd.sendCommand(MpdCommand.Next).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// stop
// Stops playing.
function GET_stop(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    mpd.sendCommand(MpdCommand.Stop).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// pause {STATE}
// Pause or resume playback. Pass 1 to pause playback or 0 to resume playback.
// Without the parameter, the pause state is toggled.
function GET_pause(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const stateParam = parseBoolean(req.query.state);
    const state = stateParam === null ? undefined : String(Number(stateParam));
    mpd.sendCommand(MpdCommand.Pause, state).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// seek {SONGPOS} {TIME}
// Seeks to the position TIME (in seconds; fractions allowed)
// of entry SONGPOS in the playlist.
function GET_seek(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const songPos = parseIntSafe(req.query.songPos);
    const time = parseFloatSafe(req.query.time);
    if (songPos === -1 || time === -1) return invalidQueryParamError(res, ['songPos', 'time']);
    mpd.sendCommand(MpdCommand.Seek, [songPos, time].map(String)).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// seekid {SONGID} {TIME}
// Seeks to the position TIME (in seconds; fractions allowed) of song SONGID.
function GET_seekId(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const songId = parseIntSafe(req.query.songId);
    const time = parseFloatSafe(req.query.time);
    if (songId === -1 || time === -1) return invalidQueryParamError(res, ['songId', 'time']);
    mpd.sendCommand(MpdCommand.SeekId, [songId, time].map(String)).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// play [SONGPOS]
// Begins playing the playlist at song number SONGPOS.
function GET_play(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const songPos = req.query.songPos === undefined ? undefined : parseIntSafe(req.query.songPos, -1);
    if (songPos === -1) return invalidQueryParamError(res, 'songPos');
    mpd.sendCommand(MpdCommand.Play, stringOrUndefined(songPos)).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// playid [SONGID]
// Begins playing the playlist at song SONGID.
function GET_playId(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const songId = req.query.songId === undefined ? undefined : parseIntSafe(req.query.songId, -1);
    if (songId === -1) return invalidQueryParamError(res, 'songId');
    mpd.sendCommand(MpdCommand.PlayId, stringOrUndefined(songId)).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// seekcur {TIME}
// Seeks to the position TIME (in seconds; fractions allowed) within the current song.
// If prefixed by + or -, then the time is relative to the current playing position.
function GET_seekCur(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const time = parseFloatRelativeSafe(req.query.time, NaN);
    if (typeof time === 'number' && isNaN(time)) return invalidQueryParamError(res, 'time');
    mpd.sendCommand(MpdCommand.SeekCur, stringOrUndefined(time)).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

export const controllingPlaybackRoutes = {
  GET_previous,
  GET_next,
  GET_stop,
  GET_pause,
  GET_seek,
  GET_play,
  GET_playId,
  GET_seekId,
  GET_seekCur,
};
