// this is not really important, ts typeof would be enough
// but with more complex states this will be clearer...
export interface IStatsState {
  uptime: number;
  playtime: number;
  artists: number;
  albums: number;
  songs: number;
  dbPlaytime: number;
  dbUpdate: number;
}

export const getInitialStatsState = (): IStatsState => ({
  uptime: -1,
  playtime: -1,
  artists: -1,
  albums: -1,
  songs: -1,
  dbPlaytime: -1,
  dbUpdate: -1,
});
