import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import type { LeaderboardTracker } from '../leaderboard/tracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createWebServer(tracker: LeaderboardTracker, port: number = 3001) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/api/leaderboard', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await tracker.getLeaderboard(limit);
      const stats = await tracker.getStats();
      const tweetId = await tracker.getLeaderboardTweetId();

      res.json({
        leaderboard,
        stats,
        tweetUrl: tweetId ? `https://x.com/i/status/${tweetId}` : null,
      });
    } catch (error) {
      console.error('Leaderboard API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await tracker.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Stats API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  const server = app.listen(port, () => {
    console.log(`Leaderboard server running on http://localhost:${port}`);
  });

  return server;
}
