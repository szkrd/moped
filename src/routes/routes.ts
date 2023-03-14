import { Express } from 'express';
import { controllingPlaybackRoutes } from './controllingPlaybackRoutes';
import { extraHistoryRoutes } from './extraHistoryRoutes';
import { extraLikeRoutes } from './extraLikeRoutes';
import { playbackOptionsRoutes } from './playbackOptionsRoutes';
import { statusRoutes } from './statusRoutes';

export function setupRoutes(app: Express) {
  statusRoutes.GET_clearError(app, '/api/status/clear-error');
  statusRoutes.GET_currentSong(app, '/api/status/current-song');
  statusRoutes.GET_status(app, '/api/status/status');
  statusRoutes.GET_stats(app, '/api/status/stats');
  playbackOptionsRoutes.GET_consume(app, '/api/playback-options/consume'); // ?state
  playbackOptionsRoutes.GET_crossfade(app, '/api/playback-options/crossfade'); // ?seconds
  playbackOptionsRoutes.GET_mixrampDb(app, '/api/playback-options/mixramp-db'); // ?decibels
  playbackOptionsRoutes.GET_mixrampDelay(app, '/api/playback-options/mixramp-delay'); // ?seconds
  playbackOptionsRoutes.GET_random(app, '/api/playback-options/random'); // ?state
  playbackOptionsRoutes.GET_repeat(app, '/api/playback-options/repeat'); // ?state
  playbackOptionsRoutes.GET_volume(app, '/api/playback-options/volume'); // none or ?vol
  playbackOptionsRoutes.GET_single(app, '/api/playback-options/single'); // ?state
  playbackOptionsRoutes.GET_replayGainStatus(app, '/api/playback-options/replay-gain-status');
  playbackOptionsRoutes.GET_replayGainMode(app, '/api/playback-options/replay-gain-mode'); // ?mode
  controllingPlaybackRoutes.GET_previous(app, '/api/controlling-playback/previous');
  controllingPlaybackRoutes.GET_next(app, '/api/controlling-playback/next');
  controllingPlaybackRoutes.GET_stop(app, '/api/controlling-playback/stop');
  controllingPlaybackRoutes.GET_pause(app, '/api/controlling-playback/pause'); // ?state
  controllingPlaybackRoutes.GET_seek(app, '/api/controlling-playback/seek'); // ?songPos &time
  controllingPlaybackRoutes.GET_seekId(app, '/api/controlling-playback/seek-id'); // ?songId &time
  controllingPlaybackRoutes.GET_play(app, '/api/controlling-playback/play'); // ?songPos
  controllingPlaybackRoutes.GET_playId(app, '/api/controlling-playback/play-id'); // ?songId
  controllingPlaybackRoutes.GET_seekCur(app, '/api/controlling-playback/seek-cur'); // ?time
  extraLikeRoutes.POST_like(app, '/api/extra/like'); // { ...currentSong }
  extraLikeRoutes.DELETE_like(app, '/api/extra/like'); // { id }
  extraLikeRoutes.GET_likes(app, '/api/extra/likes'); // returns: { songs: [] }
  extraHistoryRoutes.GET_history(app, '/api/extra/history'); // returns: { songs: [] }
}
