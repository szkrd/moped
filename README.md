# moped

- a **work in progress** mpd http/rest/socket server
- so far: it's just a mess of spaghetti code

## protocol support

- [x] version
- [x] requests
- [x] OK response
- [ ] binary responses
- [x] failure response
- [ ] command lists
- [ ] filters

## command support

- [ ] Querying MPD’s status
  - [x] clearerror: **GET** `/status/clear-error`
  - [x] currentsong: **GET** `/status/current-song`
  - [ ] idle (subsystem change listener)
  - [x] status: **GET** `/status/status`
  - [x] stats: **GET** `/status/stats`
- [ ] Playback options
  - [ ] consume
  - [ ] crossfade
  - [ ] mixrampdb
  - [ ] mixrampdelay
  - [ ] random
  - [ ] repeat
  - [x] getvol: **GET** `/playback-options/volume`
  - [ ] setvol
  - [ ] single
  - [ ] replay_gain_mode
  - [ ] replay_gain_status
- [ ] Controlling playback
  - [x] next: **GET** `/controlling-playback/next`
  - [ ] pause {state}
  - [ ] play {songPos}
  - [ ] playid {songId}
  - [x] previous: **GET** `/controlling-playback/previous`
  - [ ] seek {songPos} {time}
  - [ ] seekId {songId} {time}
  - [ ] seekCur {time}
  - [x] stop: **GET** `/controlling-playback/stop`
- [ ] The Queue
- [ ] Stored playlists
- [ ] The music database
- [ ] Mounts and neighbors
- [ ] Stickers
- [ ] Connection settings
- [ ] Partition commands
- [ ] Audio output devices
- [ ] Reflection
- [ ] Client to clien

## notes about responses

- response keys are camelcased (in mpd it's all lowercase, except for song metadata, which is part of the audio file)
- string, number and boolean are preferred, enums are served as strings

## dev notes

- mpd [protocol docs](https://mpd.readthedocs.io/en/latest/protocol.html)
- mpd version is 0.21.5 in debian 10.13 (buster)
- mpd docs footnote for version support: **6** = Since MPD 0.21
- `shift + r` in ncmpcpp toggles [consume](https://www.linuxquestions.org/questions/linux-software-2/ncmpcpp-deletes-songs-from-playlist-after-playing-no-volume-augmentation-4175461664/)
- oneshot: https://github.com/MusicPlayerDaemon/mpc/issues/71 - but I still can't enable it in ncmpcpp
