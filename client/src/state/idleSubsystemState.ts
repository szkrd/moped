type TSubsystemName =
  | ''
  | 'database'
  | 'update'
  | 'stored_playlist'
  | 'playlist'
  | 'player'
  | 'mixer'
  | 'output'
  | 'options'
  | 'partition'
  | 'sticker'
  | 'subscription'
  | 'message'
  | 'neighbor'
  | 'mount';

export interface IIdleSubsystemState {
  uninitialized: boolean; // NOT exactly the same as the api related one
  subsystem: TSubsystemName;
  at: number;
}

export const getInitialIdleSubsystemState = (): IIdleSubsystemState => ({
  uninitialized: true,
  subsystem: '',
  at: -1,
});
