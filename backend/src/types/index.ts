export interface Contributor {
  id: number;
  twitterId: string;
  twitterHandle: string;
  walletAddress: string | null;
  totalContributions: number;
  impactScore: number; // weighted by actual code changes
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  id: number;
  contributorId: number;
  tweetId: string;
  content: string;
  type: ContributionType;
  status: ContributionStatus;
  impactScore: number;
  resultingCommitSha: string | null;
  createdAt: string;
  processedAt: string | null;
}

export type ContributionType =
  | 'vote'           // voted in a poll
  | 'suggestion'     // suggested a feature/change
  | 'feedback'       // gave feedback on implementation
  | 'bug_report'     // reported a bug
  | 'clarification'; // answered a clarifying question

export type ContributionStatus =
  | 'pending'              // not yet processed
  | 'processing'           // being processed by OpenClaw
  | 'accepted'             // resulted in code changes
  | 'rejected'             // not actionable
  | 'duplicate'            // already suggested
  | 'pending_clarification'; // waiting for community input

export interface PendingPost {
  id: number;
  content: string;
  replyToTweetId: string | null;
  type: PostType;
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  telegramMessageId: number | null;
  createdAt: string;
  processedAt: string | null;
}

export type PostType =
  | 'poll'           // voting poll
  | 'update'         // progress update
  | 'question'       // clarifying question
  | 'announcement'   // major announcement
  | 'reply';         // reply to contributor

export interface Poll {
  id: number;
  tweetId: string | null;
  question: string;
  options: string[];
  status: 'pending' | 'active' | 'closed';
  winningOption: string | null;
  createdAt: string;
  closedAt: string | null;
}

export interface ProjectState {
  id: number;
  phase: ProjectPhase;
  protocolType: string | null;  // dex, lending, bridge, etc
  chain: string | null;         // determined by community
  repoUrl: string | null;
  currentTask: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProjectPhase =
  | 'voting_protocol_type'  // initial vote on what to build
  | 'voting_chain'          // vote on which chain
  | 'gathering_requirements'// collecting feature requests
  | 'building'              // OpenClaw is building
  | 'testing'               // community testing
  | 'auditing'              // security audit phase
  | 'launching'             // deploying
  | 'launched';             // live
