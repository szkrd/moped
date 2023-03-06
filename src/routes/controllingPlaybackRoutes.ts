import { Express } from 'express';
import { MpdCommand } from '../models/mpdCommand';
import { mpd } from '../modules/mpd';
import { parseBoolean } from '../utils/boolean';
import { catchMpdError, invalidQueryParamError, thenSuccess } from '../utils/http';
import { parseFloatSafe, parseIntSafe } from '../utils/number';

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

export const controllingPlaybackRoutes = {
  GET_previous,
  GET_next,
  GET_stop,
  GET_pause,
  GET_seek,
  // GET_play,
  // GET_playid,
  // GET_seek,
  // GET_seekId,
  // GET_seekCur,
};
