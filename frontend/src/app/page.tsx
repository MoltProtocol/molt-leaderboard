"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Contributor {
  rank: number;
  handle: string;
  comments: number;
  likes: number;
  ideas: number;
  points: number;
}

interface Stats {
  impressions: number;
  totalComments: number;
  totalContributors: number;
}

interface Idea {
  id: number;
  tweet_id: string;
  author_handle: string;
  content: string;
  like_count: number;
  reply_count: number;
  first_seen_at: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-5">
        <p className="text-2xl font-semibold font-mono text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <span className="text-sm font-medium font-mono text-primary">
        #{rank}
      </span>
    );
  }
  return (
    <span className="text-sm font-mono text-muted-foreground">
      #{rank}
    </span>
  );
}

function IdeaCard({ idea }: { idea: Idea }) {
  const tweetUrl = `https://x.com/${idea.author_handle}/status/${idea.tweet_id}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="bg-card border border-border hover:border-primary/50 transition-colors h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-primary font-medium">
              @{idea.author_handle}
            </span>
            <Badge variant="outline" className="text-xs">
              +50 pts
            </Badge>
          </div>
          <p className="text-sm text-foreground line-clamp-4 mb-3">
            {idea.content}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{idea.like_count} likes</span>
            <span>{idea.reply_count} replies</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

type TimeRange = '24h' | '7d' | '30d' | 'all';
type Tab = 'leaderboard' | 'ideas' | 'progress';

interface ProtocolStep {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  author: string;
  steps: ProtocolStep[];
}

const PROTOCOLS: Protocol[] = [
  {
    id: 'native-randomness',
    title: 'Native On-Chain Randomness',
    description: 'Native randomness on-chain. No more praying to Chainlink VRF gods and paying tribute fees every time you need a coin flip.',
    author: 'Community Vote Winner',
    steps: [
      { title: 'Research & Design', description: 'Analyze existing VRF solutions and design native randomness architecture', status: 'in-progress' },
      { title: 'Smart Contract Development', description: 'Build core randomness generation contracts', status: 'upcoming' },
      { title: 'Security Audit', description: 'Third-party audit of randomness source and contracts', status: 'upcoming' },
      { title: 'Testnet Deployment', description: 'Deploy to testnet for community testing', status: 'upcoming' },
      { title: 'Mainnet Launch', description: 'Production deployment with documentation', status: 'upcoming' },
    ],
  },
  {
    id: 'decentralized-ai-oracle',
    title: 'Decentralized AI Oracle Network',
    description: 'Base layer on Ethereum/L2 with open-source AI models on volunteer nodes. Nodes stake tokens, run verifications on off-chain data, and submit ZK proofs on-chain.',
    author: 'Community Vote Winner',
    steps: [
      { title: 'Architecture Design', description: 'Design node network, staking mechanism, and ZK proof system', status: 'in-progress' },
      { title: 'GitHub Repo & MVP', description: 'Open-source repository with initial implementation', status: 'upcoming' },
      { title: 'Testnet Node Network', description: 'Deploy testnet and onboard initial CT nodes', status: 'upcoming' },
      { title: 'DAO Governance', description: 'Implement on-chain voting for feature decisions', status: 'upcoming' },
      { title: 'Model Plugin System', description: 'Build extensible system for adding AI model plugins', status: 'upcoming' },
      { title: 'Mainnet Launch', description: 'Production deployment with full documentation', status: 'upcoming' },
    ],
  },
];

function ProgressStep({ step, index }: { step: ProtocolStep; index: number }) {
  const statusColors = {
    'completed': 'bg-green-500',
    'in-progress': 'bg-primary',
    'upcoming': 'bg-muted-foreground/30',
  };

  const statusText = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'upcoming': 'Upcoming',
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${statusColors[step.status]}`} />
        {index < 5 && <div className="w-0.5 h-full bg-border mt-1" />}
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium text-foreground">{step.title}</h4>
          <Badge
            variant="outline"
            className={`text-xs ${step.status === 'in-progress' ? 'border-primary text-primary' : ''}`}
          >
            {statusText[step.status]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{step.description}</p>
      </div>
    </div>
  );
}

function ProtocolCard({ protocol }: { protocol: Protocol }) {
  const completedSteps = protocol.steps.filter(s => s.status === 'completed').length;
  const inProgressSteps = protocol.steps.filter(s => s.status === 'in-progress').length;
  const progress = Math.round(((completedSteps + inProgressSteps * 0.5) / protocol.steps.length) * 100);

  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">{protocol.title}</h3>
            <p className="text-xs text-muted-foreground">{protocol.author}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {progress}% Complete
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{protocol.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{completedSteps}/{protocol.steps.length} steps</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-0">
          {protocol.steps.map((step, i) => (
            <ProgressStep key={i} step={step} index={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard');
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchData();
      fetchIdeas();
      // Poll for updates every 30 seconds
      const interval = setInterval(() => {
        fetchData();
        fetchIdeas();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [mounted, debouncedSearch, timeRange]);

  async function fetchData() {
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (timeRange !== 'all') params.set('timeRange', timeRange);

      const res = await fetch(`${API_URL}/api/leaderboard?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setContributors(data.leaderboard || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchIdeas() {
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`${API_URL}/api/ideas?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas || []);
      }
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    } finally {
      setIdeasLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Molt
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Your vote, your protocol.
          </p>
        </motion.header>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <StatCard
            value={stats ? formatNumber(stats.impressions) : "—"}
            label="Impressions"
          />
          <StatCard
            value={stats ? formatNumber(stats.totalComments) : "—"}
            label="Comments"
          />
          <StatCard
            value={stats ? stats.totalContributors.toString() : "—"}
            label="Contributors"
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex items-center gap-1 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.3 }}
        >
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'ideas'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Ideas
            {ideas.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-foreground/20 rounded">
                {ideas.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'progress'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Protocol Progress
          </button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {activeTab === 'leaderboard' ? (
            <Card className="bg-card border border-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-medium">Contributors</h2>
                <Badge variant="outline" className="text-xs font-normal">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
                  Live
                </Badge>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
                <input
                  type="text"
                  placeholder="Search username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 max-w-xs bg-background border border-border rounded-md px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex items-center gap-1">
                  {(['24h', '7d', '30d', 'all'] as TimeRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        timeRange === range
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {range === 'all' ? 'All' : range.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="w-16 text-xs font-medium text-muted-foreground">Rank</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Contributor</TableHead>
                    <TableHead className="w-20 text-right text-xs font-medium text-muted-foreground">Comments</TableHead>
                    <TableHead className="w-20 text-right text-xs font-medium text-muted-foreground">Likes</TableHead>
                    <TableHead className="w-16 text-right text-xs font-medium text-muted-foreground">Ideas</TableHead>
                    <TableHead className="w-24 text-right text-xs font-medium text-muted-foreground">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : contributors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        No contributors yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    contributors.map((entry) => (
                      <TableRow
                        key={entry.handle}
                        className="hover:bg-muted/30 transition-colors border-border"
                      >
                        <TableCell className="py-3">
                          <RankBadge rank={entry.rank} />
                        </TableCell>
                        <TableCell className="py-3">
                          <a
                            href={`https://x.com/${entry.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-foreground hover:text-primary transition-colors"
                          >
                            @{entry.handle}
                          </a>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className="text-sm font-mono text-muted-foreground">
                            {entry.comments}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className="text-sm font-mono text-muted-foreground">
                            {formatNumber(entry.likes)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className="text-sm font-mono text-muted-foreground">
                            {entry.ideas || 0}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className="text-sm font-mono text-foreground font-medium">
                            {formatNumber(entry.points)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          ) : activeTab === 'ideas' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium">Protocol Ideas</h2>
                <Badge variant="outline" className="text-xs font-normal">
                  +50 points each
                </Badge>
              </div>

              {/* Search for Ideas */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full max-w-xs bg-background border border-border rounded-md px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {ideasLoading ? (
                <div className="py-8 text-center text-muted-foreground">
                  Loading ideas...
                </div>
              ) : ideas.length === 0 ? (
                <Card className="bg-card border border-border">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-2">No ideas yet</p>
                    <p className="text-xs text-muted-foreground">
                      Reply to @MoltProto with a protocol idea to earn +50 points!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ideas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-medium">Protocol Progress</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tracking development of community-voted protocols
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-normal">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse" />
                  Building
                </Badge>
              </div>

              <div className="space-y-6">
                {PROTOCOLS.map((protocol) => (
                  <ProtocolCard key={protocol.id} protocol={protocol} />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-10 pt-6 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Built in public</span>
            <a href="https://x.com/MoltProto" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Twitter
            </a>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
