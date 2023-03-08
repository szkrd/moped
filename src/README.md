# server

## env vars

The code uses [dotenv](https://www.npmjs.com/package/dotenv).
Copy _.env.example_ to _.env_ and edit to your needs.

- **HOST** = `127.0.0.1`
- **PORT** = `4000`
- **MPD_HOST** = `127.0.0.1`
- **MPD_PORT** = `6600`
- **PUBLIC_DIR** = `public`

## protocol support

All api calls are routed to `/api`, if set, static public will be served at the server root.

- [x] version
- [x] requests
- [x] OK response
- [ ] binary responses
- [x] failure response
- [ ] command lists
- [ ] filters

## command support

- [x] Querying MPD's status
  - [x] clearerror: `/api/status/clear-error`
  - [x] currentsong: `/api/status/current-song`
  - [x] idle (subsystem change listener), **socketio**
  - [x] status: `/api/status/status`
  - [x] stats: `/api/status/stats`
- [x] Playback options
  - [x] consume: `/api/playback-options/consume`?`state=true|false|oneshot`
  - [x] crossfade: `/api/playback-options/crossfade`?`seconds=number`
  - [x] mixrampdb: `/api/playback-options/mixramp-db`?`decibels=number`
  - [x] mixrampdelay: `/api/playback-options/mixramp-delay`?`seconds=number`
  - [x] random: `/api/playback-options/random`?`state=true|false`
  - [x] repeat: `/api/playback-options/repeat`?`state=true|false`
  - [x] getvol: `/api/playback-options/volume`
  - [x] setvol: `/api/playback-options/volume`?`vol=percent`
  - [x] single: `/api/playback-options/single`?`state=true|false|oneshot`
  - [x] replay_gain_mode: `/api/playback-options/replay-gain-mode`?`mode=off|track|album|auto`
  - [x] replay_gain_status: `/api/playback-options/replay-gain-status`
- [x] Controlling playback
  - [x] next: `/api/controlling-playback/next`
  - [x] pause: `/api/controlling-playback/pause`?`(state)=true|false`
  - [x] play: `/api/controlling-playback/play`?`(songPos)=number`
  - [x] playid: `/api/controlling-playback/play-id`?`(songId)=number`
  - [x] previous: `/api/controlling-playback/previous`
  - [x] seek: `/api/controlling-playback/seek`?`songPos=number`&`time=number`
  - [x] seekId: `/api/controlling-playback/seek-id`?`songId=number`&`time=number`
  - [x] seekCur: `/api/controlling-playback/seek-cur`?`time=number|relative-number`
  - [x] stop: `/api/controlling-playback/stop`
- [ ] The Queue
  - [ ] add
  - [ ] addid
  - [ ] clear
  - [ ] delete
  - [ ] deleteid
  - [ ] move
  - [ ] moveid
  - [ ] playlist
  - [ ] playlistfind
  - [ ] playlistid
  - [ ] playlistinfo
  - [ ] playlistsearch
  - [ ] plchanges
  - [ ] plchangesposid
  - [ ] prio
  - [ ] prioid
  - [ ] rangeid
  - [ ] shuffle
  - [ ] swap
  - [ ] swapid
  - [ ] addtagid
  - [ ] cleartagid
- [ ] Stored playlists
  - [ ] listplaylist
  - [ ] listplaylistinfo
  - [ ] listplaylists
  - [ ] load
  - [ ] playlistadd
  - [ ] playlistclear
  - [ ] playlistdelete
  - [ ] playlistmove
  - [ ] rename
  - [ ] rm
  - [ ] save
- [ ] The music database
  - [ ] albumart
  - [ ] count
  - [ ] getfingerprint
  - [ ] find
  - [ ] findadd
  - [ ] list
  - [ ] listall
  - [ ] listallinfo
  - [ ] listfiles
  - [ ] lsinfo
  - [ ] readcomments
  - [ ] readpicture
  - [ ] search
  - [ ] searchadd
  - [ ] searchaddpl
  - [ ] searchcount
  - [ ] update
  - [ ] rescan
- [ ] Mounts and neighbors
  - [ ] mount
  - [ ] unmount
  - [ ] listmounts
  - [ ] listneighbors
- [ ] Stickers
  - [ ] sticker get
  - [ ] sticker set
  - [ ] sticker delete
  - [ ] sticker list
  - [ ] sticker find
- [ ] Connection settings
  - [ ] close
  - [ ] kill
  - [ ] password
  - [ ] ping
  - [ ] binarylimit
  - [ ] tagtypes
  - [ ] tagtypes disable
  - [ ] tagtypes enable
  - [ ] tagtypes clear
  - [ ] tagtypes all
- [ ] Partition commands
  - [ ] partition
  - [ ] listpartitions
  - [ ] newpartition
  - [ ] delpartition
  - [ ] moveoutput
- [ ] Audio output devices
  - [ ] disableoutput
  - [ ] enableoutput
  - [ ] toggleoutput
  - [ ] outputs
  - [ ] outputset
- [ ] Reflection
  - [ ] config
  - [ ] commands
  - [ ] notcommands
  - [ ] urlhandlers
  - [ ] decoders
- [ ] Client to client
  - [ ] subscribe
  - [ ] unsubscribe
  - [ ] channels
  - [ ] readmessages
  - [ ] sendmessage

## notes about responses

- response keys are camelcased (in mpd it's all lowercase, except for song metadata, which is part of the audio file)
- string, number and boolean are preferred, enums are served as strings

## random dev notes

- mpd [protocol docs](https://mpd.readthedocs.io/en/latest/protocol.html)
- mpd version is 0.21.5 in debian 10.13 (buster)
- mpd docs footnote for version support: **6** = Since MPD 0.21
- `shift + r` in ncmpcpp toggles [consume](https://www.linuxquestions.org/questions/linux-software-2/ncmpcpp-deletes-songs-from-playlist-after-playing-no-volume-augmentation-4175461664/)
- oneshot: https://github.com/MusicPlayerDaemon/mpc/issues/71 - but I still can't enable it in ncmpcpp
