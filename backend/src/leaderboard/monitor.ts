import type { LeaderboardTracker } from './tracker.js';

export class LeaderboardMonitor {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(
    private tracker: LeaderboardTracker,
    private intervalMs: number = 60000 // Default: 1 minute
  ) {}

  /**
   * Start the monitoring loop
   */
  start(): void {
    if (this.isRunning) {
      console.log('Monitor is already running');
      return;
    }

    this.isRunning = true;
    console.log(`Starting leaderboard monitor (interval: ${this.intervalMs / 1000}s)`);

    // Run immediately on start
    this.poll();

    // Then run on interval
    this.intervalId = setInterval(() => this.poll(), this.intervalMs);
  }

  /**
   * Stop the monitoring loop
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Leaderboard monitor stopped');
  }

  /**
   * Single poll iteration
   */
  private async poll(): Promise<void> {
    const tweetId = this.tracker.getLeaderboardTweetId();
    if (!tweetId) {
      // No tweet set, skip this poll
      return;
    }

    try {
      console.log(`[${new Date().toISOString()}] Polling suggestions...`);
      await this.tracker.refreshSuggestions();
    } catch (error) {
      console.error('Monitor poll failed:', error);
    }
  }

  /**
   * Check if monitor is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}
