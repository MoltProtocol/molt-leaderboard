import pg from 'pg';

const { Pool } = pg;

export async function initializeDatabase(databaseUrl: string): Promise<pg.Pool> {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contributors (
        id SERIAL PRIMARY KEY,
        twitter_id TEXT UNIQUE NOT NULL,
        twitter_handle TEXT NOT NULL,
        wallet_address TEXT,
        total_contributions INTEGER DEFAULT 0,
        impact_score DOUBLE PRECISION DEFAULT 0,
        airdrop_tx_hash TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contributions (
        id SERIAL PRIMARY KEY,
        contributor_id INTEGER NOT NULL REFERENCES contributors(id),
        tweet_id TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        impact_score DOUBLE PRECISION DEFAULT 0,
        resulting_commit_sha TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        processed_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS pending_posts (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        reply_to_tweet_id TEXT,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        telegram_message_id INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        processed_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS polls (
        id SERIAL PRIMARY KEY,
        tweet_id TEXT,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        winning_option TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        closed_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS project_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        phase TEXT DEFAULT 'voting_protocol_type',
        protocol_type TEXT,
        chain TEXT,
        repo_url TEXT,
        current_task TEXT,
        leaderboard_tweet_id TEXT,
        last_leaderboard_refresh TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS openclaw_messages (
        id SERIAL PRIMARY KEY,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        related_contribution_id INTEGER REFERENCES contributions(id),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bot_tweets (
        id SERIAL PRIMARY KEY,
        tweet_id TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        last_checked_reply_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS token_launches (
        id SERIAL PRIMARY KEY,
        status TEXT DEFAULT 'pending_config',
        token_config TEXT,
        distribution_config TEXT,
        contract_address TEXT,
        deploy_tx_hash TEXT,
        distribution_tx_hashes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        launched_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS suggestion_comments (
        id SERIAL PRIMARY KEY,
        tweet_id TEXT UNIQUE NOT NULL,
        author_id TEXT NOT NULL,
        author_handle TEXT NOT NULL,
        content TEXT NOT NULL,
        like_count INTEGER DEFAULT 0,
        retweet_count INTEGER DEFAULT 0,
        reply_count INTEGER DEFAULT 0,
        category TEXT,
        first_seen_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS suggestion_engagement (
        id SERIAL PRIMARY KEY,
        suggestion_tweet_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_handle TEXT NOT NULL,
        engagement_type TEXT NOT NULL,
        bonus_awarded INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(suggestion_tweet_id, user_id, engagement_type)
      );

      INSERT INTO project_state (id) VALUES (1) ON CONFLICT DO NOTHING;

      CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
      CREATE INDEX IF NOT EXISTS idx_contributions_contributor ON contributions(contributor_id);
      CREATE INDEX IF NOT EXISTS idx_pending_posts_status ON pending_posts(status);
      CREATE INDEX IF NOT EXISTS idx_contributors_handle ON contributors(twitter_handle);
      CREATE INDEX IF NOT EXISTS idx_bot_tweets_tweet_id ON bot_tweets(tweet_id);
      CREATE INDEX IF NOT EXISTS idx_suggestion_comments_likes ON suggestion_comments(like_count DESC);
      CREATE INDEX IF NOT EXISTS idx_suggestion_engagement_tweet ON suggestion_engagement(suggestion_tweet_id);
    `);
  } finally {
    client.release();
  }

  return pool;
}
