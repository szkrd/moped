export enum MpdCommand {
  // status
  Ping = 'ping',
  ClearError = 'clearerror',
  Status = 'status',
  CurrentSong = 'currentsong',
  Stats = 'stats',
  // playback options
  GetVolume = 'getvol',
  SetVolume = 'setvol',
  // controlling playback
  Previous = 'previous',
  Next = 'next',
  Stop = 'stop',
}
