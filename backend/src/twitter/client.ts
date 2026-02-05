import { TwitterApi, type TweetV2, type UserV2 } from 'twitter-api-v2';
import type { ContributionType } from '../types/index.js';

export class TwitterClient {
  private client: TwitterApi;
  private botUserId: string | null = null;

  constructor(
    apiKey: string,
    apiSecret: string,
    accessToken: string,
    accessTokenSecret: string
  ) {
    this.client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });
  }

  async initialize(): Promise<void> {
    const me = await this.client.v2.me();
    this.botUserId = me.data.id;
    console.log(`Twitter client initialized as @${me.data.username}`);
  }

  /**
   * Fetch recent mentions of the bot
   */
  async getMentions(sinceId?: string): Promise<TweetV2[]> {
    if (!this.botUserId) {
      throw new Error('Twitter client not initialized');
    }

    const options: Record<string, unknown> = {
      expansions: ['author_id', 'referenced_tweets.id'],
      'tweet.fields': ['created_at', 'conversation_id', 'in_reply_to_user_id'],
      'user.fields': ['username'],
      max_results: 100,
    };

    if (sinceId) {
      options.since_id = sinceId;
    }

    const mentions = await this.client.v2.userMentionTimeline(this.botUserId, options as any);

    return mentions.data?.data || [];
  }

  /**
   * Get user info by ID
   */
  async getUser(userId: string): Promise<UserV2 | null> {
    try {
      const user = await this.client.v2.user(userId, {
        'user.fields': ['username', 'name', 'description'],
      });
      return user.data;
    } catch {
      return null;
    }
  }

  /**
   * Post a tweet (should only be called after Telegram approval)
   */
  async postTweet(content: string, replyToId?: string): Promise<string> {
    const tweet = await this.client.v2.tweet({
      text: content,
      ...(replyToId && { reply: { in_reply_to_tweet_id: replyToId } }),
    });
    return tweet.data.id;
  }

  /**
   * Create a poll tweet
   */
  async createPoll(
    question: string,
    options: string[],
    durationMinutes: number = 1440 // 24 hours default
  ): Promise<string> {
    const tweet = await this.client.v2.tweet({
      text: question,
      poll: {
        options: options,
        duration_minutes: durationMinutes,
      },
    });
    return tweet.data.id;
  }

  /**
   * Get replies to a specific tweet (conversation thread)
   */
  async getReplies(tweetId: string, sinceId?: string): Promise<(TweetV2 & { _username?: string })[]> {
    // First get the conversation_id from the original tweet
    const originalTweet = await this.client.v2.singleTweet(tweetId, {
      'tweet.fields': ['conversation_id'],
    });

    const conversationId = originalTweet.data.conversation_id;
    if (!conversationId) return [];

    // Search for replies in this conversation
    const query = `conversation_id:${conversationId} -from:${this.botUserId}`;

    const options: Record<string, unknown> = {
      expansions: ['author_id', 'referenced_tweets.id'],
      'tweet.fields': ['created_at', 'conversation_id', 'in_reply_to_user_id', 'public_metrics'],
      'user.fields': ['username'],
      max_results: 100,
    };

    if (sinceId) {
      options.since_id = sinceId;
    }

    try {
      const search = await this.client.v2.search(query, options as any);
      const tweets = search.data?.data || [];
      const users = search.includes?.users || [];

      // Attach resolved username to each tweet
      const userMap = new Map(users.map((u) => [u.id, u.username]));
      return tweets.map((t) => ({
        ...t,
        _username: userMap.get(t.author_id!) || undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get users who liked a specific tweet
   */
  async getLikingUsers(tweetId: string): Promise<UserV2[]> {
    try {
      const result = await this.client.v2.tweetLikedBy(tweetId, {
        'user.fields': ['username'],
      });
      return result.data || [];
    } catch {
      return [];
    }
  }

  /**
   * Get poll results
   */
  async getPollResults(tweetId: string): Promise<{
    options: { label: string; votes: number }[];
    isComplete: boolean;
  } | null> {
    try {
      const tweet = await this.client.v2.singleTweet(tweetId, {
        expansions: ['attachments.poll_ids'],
        'poll.fields': ['options', 'voting_status', 'end_datetime'],
      });

      const poll = tweet.includes?.polls?.[0];
      if (!poll) return null;

      return {
        options: poll.options.map((opt) => ({
          label: opt.label,
          votes: opt.votes,
        })),
        isComplete: poll.voting_status === 'closed',
      };
    } catch {
      return null;
    }
  }

  /**
   * Parse contribution type from tweet content
   */
  parseContributionType(content: string): ContributionType {
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('bug') || lowerContent.includes('broken') || lowerContent.includes('error')) {
      return 'bug_report';
    }
    if (lowerContent.includes('suggest') || lowerContent.includes('should add') || lowerContent.includes('feature')) {
      return 'suggestion';
    }
    if (lowerContent.includes('?')) {
      return 'clarification';
    }
    return 'feedback';
  }

  /**
   * Extract wallet address from tweet if present
   */
  extractWalletAddress(content: string): string | null {
    // EVM address
    const evmMatch = content.match(/0x[a-fA-F0-9]{40}/);
    if (evmMatch) return evmMatch[0];

    // Solana address (base58, 32-44 chars)
    const solMatch = content.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
    if (solMatch) return solMatch[0];

    return null;
  }

  /**
   * Get recent tweets from the bot's account
   */
  async getUserTweets(maxResults: number = 20): Promise<TweetV2[]> {
    if (!this.botUserId) {
      throw new Error('Twitter client not initialized');
    }

    try {
      const tweets = await this.client.v2.userTimeline(this.botUserId, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'conversation_id', 'public_metrics'],
        exclude: ['retweets', 'replies'],
      });
      return tweets.data?.data || [];
    } catch {
      return [];
    }
  }
}
