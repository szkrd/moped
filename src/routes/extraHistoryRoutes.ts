import { Express } from 'express';
import { history } from '../modules/history';

function GET_history(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const songs = await history.getSongHistory();
    res.json({ songs });
  });
}

export const extraHistoryRoutes = {
  GET_history,
};
