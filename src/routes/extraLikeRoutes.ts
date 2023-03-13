import { Express } from 'express';
import { like } from '../modules/like';

function POST_like(app: Express, path: string) {
  return app.post(path, async (req, res) => {
    await like.addLike(req.body);
    res.json({ success: true });
  });
}

export const extraLikeRoutes = {
  POST_like,
};
