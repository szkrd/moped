## Versions

- .1 = MPD 0.14
- .2 = MPD 0.15
- .3 = MPD 0.16
- .4 = MPD 0.19
- .5 = MPD 0.20
- .6 = MPD 0.21
- .7 = MPD 0.22.4
- .8 = MPD 0.23
- .9 = MPD 0.23.1
- .10 = MPD 0.23.3
- .11 = MPD 0.23.4
- .12 = MPD 0.23.5
- .13 = MPD 0.24

## Playback options

`consume {STATE:0|1|oneshot.13} .2`
Sets consume state to STATE, STATE should be 0, 1 or oneshot 13. When consume is activated, each song played is removed from playlist.

`crossfade {SECONDS:positiveInteger}`
Sets crossfading between songs. See Cross-Fading.

`mixrampdb {deciBels:integer}`
Sets the threshold at which songs will be overlapped. See MixRamp.

`mixrampdelay {SECONDS:integer|nan}`
Additional time subtracted from the overlap calculated by mixrampdb. A value of “nan” disables MixRamp overlapping and falls back to crossfading. See MixRamp.

`random {STATE:0|1}`
Sets random state to STATE, STATE should be 0 or 1.

`repeat {STATE:0|1}`
Sets repeat state to STATE, STATE should be 0 or 1.
If enabled, MPD keeps repeating the whole queue (single mode disabled) or the current song (single mode enabled).
If random mode is also enabled, the playback order will be shuffled each time the queue gets repeated.
