import { Express } from 'express';
import { MpdCommand } from '../models/mpdCommand';
import { mpd } from '../modules/mpd';
import { parseBooleanOrOneshot } from '../utils/boolean';
import { catchMpdError, invalidQueryParamError, invalidVersionError, thenSuccess } from '../utils/http';
import { parseKeyValueMessage } from '../utils/mpd';
import { parseIntOrNull, parseIntSafe, parsePercentOrNull } from '../utils/number';
import { SchemaType, toSchema } from '../utils/schema';

// getvol
// Read the volume. The result is a volume: line like in status.
// If there is no mixer, MPD will emit an empty response.
//
// setvol {VOL}
// Sets volume to VOL, the range of volume is 0-100.
function GET_volume(app: Express, path: string) {
  return app.get(path, (req, res) => {
    const hasVol = req.query.vol !== undefined;
    const vol = parsePercentOrNull(req.query.vol);
    if (!hasVol && !mpd.isMinVer('0.23')) return invalidVersionError(res, '0.23');
    if (hasVol && vol === null) return invalidQueryParamError(res, 'vol');
    // get or set
    if (!hasVol) {
      mpd
        .sendCommand(MpdCommand.GetVolume)
        .then((resp) => {
          const obj = parseKeyValueMessage(resp);
          res.json(toSchema(obj, { [SchemaType.Number]: ['volume'] }));
        })
        .catch(catchMpdError(res));
    } else {
      mpd.sendCommand(MpdCommand.SetVolume, String(vol)).then(thenSuccess(res)).catch(catchMpdError(res));
    }
  });
}

// consume {STATE}
// Sets consume state to STATE, STATE should be 0, 1 or oneshot.
// When consume is activated, each song played is removed from playlist.
function GET_consume(app: Express, path: string) {
  return app.get(path, (req, res) => {
    if (!mpd.isMinVer('0.15')) return invalidVersionError(res, '0.15');
    const stateParam = parseBooleanOrOneshot(req.query.state);
    if (stateParam === null) return invalidQueryParamError(res, 'state');
    const state = typeof stateParam === 'boolean' ? String(Number(stateParam)) : stateParam;
    if (!mpd.isMinVer('0.24') && state === 'oneshot') return invalidVersionError(res, '0.24', 'state');
    mpd.sendCommand(MpdCommand.Consume, state).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// crossfade {SECONDS}
// Sets crossfading between songs.
function GET_crossfade(app: Express, path: string) {
  return app.get(path, (req, res) => {
    const seconds = parseIntSafe(req.query.seconds, -1);
    if (seconds < 0) return invalidQueryParamError(res, 'seconds');
    mpd.sendCommand(MpdCommand.Crossfade, String(seconds)).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// mixrampdb {deciBels}
// Sets the threshold at which songs will be overlapped.
function GET_mixrampDb(app: Express, path: string) {
  return app.get(path, (req, res) => {
    const decibels = parseIntOrNull(req.query.decibels);
    if (decibels === null) return invalidQueryParamError(res, 'decibels');
    mpd.sendCommand(MpdCommand.MixrampDb, String(decibels)).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// mixrampdelay {SECONDS}
// Additional time subtracted from the overlap calculated by mixrampdb.
// A value of “nan” disables MixRamp overlapping and falls back to crossfading.
function GET_mixrampDelay(app: Express, path: string) {
  return app.get(path, (req, res) => {
    const seconds = parseIntSafe(req.query.seconds, -1);
    if (seconds < 0) return invalidQueryParamError(res, 'seconds');
    mpd.sendCommand(MpdCommand.MixrampDelay, String(seconds)).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// random {STATE}
// Sets random state to STATE, STATE should be 0 or 1.
function GET_random(app: Express, path: string) {
  return app.get(path, (req, res) => {
    const stateParam = parseBooleanOrOneshot(req.query.state);
    if (stateParam === null) return invalidQueryParamError(res, 'state');
    const state = typeof stateParam === 'boolean' ? String(Number(stateParam)) : stateParam;
    mpd.sendCommand(MpdCommand.Random, state).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// repeat {STATE}
// Sets repeat state to STATE, STATE should be 0 or 1.
// If enabled, MPD keeps repeating the whole queue (single mode disabled) or the current song (single mode enabled).
// If random mode is also enabled, the playback order will be shuffled each time the queue gets repeated.
function GET_repeat(app: Express, path: string) {
  return app.get(path, (req, res) => {
    const stateParam = parseBooleanOrOneshot(req.query.state);
    if (stateParam === null) return invalidQueryParamError(res, 'repeat');
    const state = typeof stateParam === 'boolean' ? String(Number(stateParam)) : stateParam;
    mpd.sendCommand(MpdCommand.Repeat, state).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// single {STATE}
// Sets single state to STATE, STATE should be 0, 1 or oneshot. When single is activated,
// playback is stopped after current song, or song is repeated if the ‘repeat’ mode is enabled.
function GET_single(app: Express, path: string) {
  return app.get(path, (req, res) => {
    if (!mpd.isMinVer('0.15')) return invalidVersionError(res, '0.15');
    const stateParam = parseBooleanOrOneshot(req.query.state);
    if (stateParam === null) return invalidQueryParamError(res, 'state');
    const state = typeof stateParam === 'boolean' ? String(Number(stateParam)) : stateParam;
    if (!mpd.isMinVer('0.21') && state === 'oneshot') return invalidVersionError(res, '0.21', 'state');
    mpd.sendCommand(MpdCommand.Single, state).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// replay_gain_mode {MODE}
// Sets the replay gain mode. One of off, track, album, auto.
// Changing the mode during playback may take several seconds,
// because the new settings do not affect the buffered data.
// This command triggers the options idle event.
function GET_replayGainMode(app: Express, path: string) {
  return app.get(path, (req, res) => {
    if (!mpd.isMinVer('0.16')) return invalidVersionError(res, '0.16');
    const mode = String(req.query.mode);
    const isModeValid = ['off', 'track', 'album', 'auto'].includes(mode);
    if (!isModeValid) return invalidQueryParamError(res, 'mode');
    mpd.sendCommand(MpdCommand.ReplayGainMode, mode).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

// replay_gain_status
// Prints replay gain options. Currently, only the variable replay_gain_mode is returned.
function GET_replayGainStatus(app: Express, path: string) {
  return app.get(path, (req, res) => {
    mpd
      .sendCommand(MpdCommand.ReplayGainStatus)
      .then((resp) => {
        const obj = parseKeyValueMessage(resp);
        res.json(obj);
      })
      .catch(catchMpdError(res));
  });
}

export const playbackOptionsRoutes = {
  GET_consume,
  GET_crossfade,
  GET_mixrampDb,
  GET_mixrampDelay,
  GET_repeat,
  GET_volume,
  GET_random,
  GET_single,
  GET_replayGainMode,
  GET_replayGainStatus,
};
