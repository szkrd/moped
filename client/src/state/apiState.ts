/** Current song data, which MAY be fuzzy (think of mp3v2 tags or arbitrary metadata fields). */
export interface IApiState {
  callCount: number;
}

export const getInitialApiState = (): IApiState => ({
  callCount: 0,
});
