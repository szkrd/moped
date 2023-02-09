# WIP

- response keys are camelcased (in mpd it's all lowercase, except for song metadata, which is part of the audio file)
- string, number and boolean are preferred, enums are served as strings

## notes

- mpd [protocol docs](https://mpd.readthedocs.io/en/latest/protocol.html)
- mpd version is 0.21.5 in debian 10.13 (buster)
- mpd docs footnote for version support: **6** = Since MPD 0.21
- `shift + r` in ncmpcpp toggles [consume](https://www.linuxquestions.org/questions/linux-software-2/ncmpcpp-deletes-songs-from-playlist-after-playing-no-volume-augmentation-4175461664/)
- oneshot: https://github.com/MusicPlayerDaemon/mpc/issues/71 - but I still can't enable it in ncmpcpp
