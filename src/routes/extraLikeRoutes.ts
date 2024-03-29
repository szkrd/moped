import { Express } from 'express';
import { like } from '../modules/like';

function POST_like(app: Express, path: string) {
  return app.post(path, async (req, res) => {
    await like.addLike(req.body);
    res.json({ success: true });
  });
}

function PATCH_like(app: Express, path: string) {
  return app.patch(path, async (req, res) => {
    await like.updateLike(req.body);
    res.json({ success: true });
  });
}

function DELETE_like(app: Express, path: string) {
  return app.delete(path, async (req, res) => {
    await like.removeLike(req.body.id);
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
  PATCH_like,
  DELETE_like,
  GET_likes,
};
