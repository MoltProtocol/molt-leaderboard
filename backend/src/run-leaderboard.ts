import 'dotenv/config';
import { initializeDatabase } from './db/schema.js';
import { TwitterClient } from './twitter/client.js';
import { LeaderboardTracker } from './leaderboard/tracker.js';
import { LeaderboardMonitor } from './leaderboard/monitor.js';
import { createWebServer } from './web/server.js';

async function main() {
  console.log('Starting Molt Leaderboard...');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = await initializeDatabase(databaseUrl);

  const twitter = new TwitterClient(
    process.env.X_API_KEY!,
    process.env.X_API_SECRET!,
    process.env.X_ACCESS_TOKEN!,
    process.env.X_ACCESS_TOKEN_SECRET!
  );

  await twitter.initialize();

  const tracker = new LeaderboardTracker(pool, twitter);
  const monitor = new LeaderboardMonitor(tracker, 60000);

  const port = parseInt(process.env.PORT || process.env.WEB_PORT || '3001');
  const server = createWebServer(tracker, port);

  monitor.start();

  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    monitor.stop();
    server.close();
    await pool.end();
    process.exit(0);
  });

  console.log(`Leaderboard API running on http://localhost:${port}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
