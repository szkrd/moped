import { Express } from 'express';
import { history } from '../modules/history';
import { like } from '../modules/like';

function GET_history(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const songs: Record<string, string | number | boolean>[] = await history.getSongHistory();
    const favs: Record<string, string | number | boolean>[] = await like.getLikedSongs();
    const favNames = favs.map((song) => song.formattedName ?? '').filter((name: string) => name);
    songs.forEach((song) => (song.liked = favNames.includes(song.formattedName)));
    res.json({ songs });
  });
}

export const extraHistoryRoutes = {
  GET_history,
};
