import type pg from 'pg';
import type { TwitterClient } from '../twitter/client.js';

export interface SuggestionComment {
  id: number;
  tweet_id: string;
  author_id: string;
  author_handle: string;
  content: string;
  like_count: number;
  retweet_count: number;
  reply_count: number;
  category: string | null;
  first_seen_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  comments: number;
  likes: number;
  points: number;
}

export class LeaderboardTracker {
  constructor(
    private pool: pg.Pool,
    private twitter: TwitterClient
  ) {}

  async getLeaderboardTweetId(): Promise<string | null> {
    const result = await this.pool.query(
      'SELECT leaderboard_tweet_id FROM project_state WHERE id = 1'
    );
    return result.rows[0]?.leaderboard_tweet_id || null;
  }

  async setLeaderboardTweetId(tweetId: string): Promise<void> {
    await this.pool.query(
      `UPDATE project_state SET leaderboard_tweet_id = $1, updated_at = NOW() WHERE id = 1`,
      [tweetId]
    );
  }

  async refreshSuggestions(): Promise<number> {
    // Fetch all tweets from the account
    console.log('Fetching all tweets from account...');
    const tweets = await this.twitter.getUserTweets(50);

    if (!tweets || tweets.length === 0) {
      console.log('No tweets found');
      return 0;
    }

    console.log(`Found ${tweets.length} tweets, fetching replies for each...`);

    let newCount = 0;
    let updatedCount = 0;

    for (const tweet of tweets) {
      try {
        const replies = await this.twitter.getReplies(tweet.id);

        for (const reply of replies) {
          const authorHandle = (reply as any)._username || 'unknown';

          const metrics = (reply as any).public_metrics || {
            like_count: 0,
            retweet_count: 0,
            reply_count: 0,
          };

          const existing = await this.pool.query(
            'SELECT id FROM suggestion_comments WHERE tweet_id = $1',
            [reply.id]
          );

          if (existing.rows.length > 0) {
            await this.pool.query(
              `UPDATE suggestion_comments
               SET like_count = $1, retweet_count = $2, reply_count = $3, updated_at = NOW()
               WHERE tweet_id = $4`,
              [metrics.like_count, metrics.retweet_count, metrics.reply_count, reply.id]
            );
            updatedCount++;
          } else {
            await this.pool.query(
              `INSERT INTO suggestion_comments
               (tweet_id, author_id, author_handle, content, like_count, retweet_count, reply_count)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                reply.id,
                reply.author_id,
                authorHandle,
                reply.text,
                metrics.like_count,
                metrics.retweet_count,
                metrics.reply_count,
              ]
            );
            newCount++;
          }
        }
      } catch (err) {
        console.error(`Failed to get replies for tweet ${tweet.id}:`, err);
      }
    }

    await this.pool.query(
      `UPDATE project_state SET last_leaderboard_refresh = NOW() WHERE id = 1`
    );

    console.log(`Refresh complete: ${newCount} new, ${updatedCount} updated across ${tweets.length} tweets`);
    return newCount;
  }

  async trackEngagement(): Promise<void> {
    const result = await this.pool.query(
      'SELECT tweet_id FROM suggestion_comments'
    );

    for (const row of result.rows) {
      try {
        const likers = await this.twitter.getLikingUsers(row.tweet_id);

        for (const user of likers) {
          await this.pool.query(
            `INSERT INTO suggestion_engagement
             (suggestion_tweet_id, user_id, user_handle, engagement_type)
             VALUES ($1, $2, $3, 'like')
             ON CONFLICT DO NOTHING`,
            [row.tweet_id, user.id, user.username]
          );
        }
      } catch (error) {
        console.error(`Failed to get likers for ${row.tweet_id}:`, error);
      }
    }
  }

  async getLeaderboard(options: {
    limit?: number;
    search?: string;
    timeRange?: '24h' | '7d' | '30d' | 'all';
  } = {}): Promise<LeaderboardEntry[]> {
    const { limit = 50, search, timeRange = 'all' } = options;

    // Build time filter
    let timeFilter = '';
    if (timeRange === '24h') {
      timeFilter = `AND first_seen_at >= NOW() - INTERVAL '24 hours'`;
    } else if (timeRange === '7d') {
      timeFilter = `AND first_seen_at >= NOW() - INTERVAL '7 days'`;
    } else if (timeRange === '30d') {
      timeFilter = `AND first_seen_at >= NOW() - INTERVAL '30 days'`;
    }

    // Build search filter
    let searchFilter = '';
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (search) {
      searchFilter = `AND LOWER(author_handle) LIKE LOWER($${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    params.push(limit);

    const result = await this.pool.query(
      `SELECT
         author_handle,
         COUNT(*)::int as comments,
         COALESCE(SUM(like_count), 0)::int as likes
       FROM suggestion_comments
       WHERE 1=1 ${timeFilter} ${searchFilter}
       GROUP BY author_handle
       ORDER BY SUM(like_count) + COUNT(*) * 2 DESC
       LIMIT $${paramIndex}`,
      params
    );

    return result.rows.map((r: { author_handle: string; comments: number; likes: number }, i: number) => ({
      rank: i + 1,
      handle: r.author_handle,
      comments: r.comments,
      likes: r.likes,
      points: r.likes + r.comments * 2,
    }));
  }

  async getStats(): Promise<{
    impressions: number;
    totalComments: number;
    totalContributors: number;
  }> {
    const comments = await this.pool.query(
      'SELECT COUNT(*)::int as count FROM suggestion_comments'
    );

    const contributors = await this.pool.query(
      'SELECT COUNT(DISTINCT author_handle)::int as count FROM suggestion_comments'
    );

    // Fetch actual impressions from tweets
    let totalImpressions = 0;
    try {
      const tweets = await this.twitter.getUserTweets(50);
      for (const tweet of tweets) {
        const metrics = (tweet as any).public_metrics;
        if (metrics?.impression_count) {
          totalImpressions += metrics.impression_count;
        }
      }
    } catch (err) {
      console.error('Failed to fetch tweet impressions:', err);
    }

    return {
      impressions: totalImpressions,
      totalComments: comments.rows[0].count,
      totalContributors: contributors.rows[0].count,
    };
  }
}
