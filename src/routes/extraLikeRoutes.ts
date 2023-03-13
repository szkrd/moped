import { Express } from 'express';
import { like } from '../modules/like';

function POST_like(app: Express, path: string) {
  return app.post(path, async (req, res) => {
    await like.addLike(req.body);
    res.json({ success: true });
  });
}

function GET_likes(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    const songs = await like.getLikedSongs();
    res.json({ songs });
  });
}

export const extraLikeRoutes = {
  POST_like,
  GET_likes,
};
