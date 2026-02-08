"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const FEATURES = [
  {
    title: "Cheap",
    description: "~0.001 ETH per request on Base L2. No token tributes.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Fast",
    description: "2-block finality. Get your random number in ~4 seconds.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Verifiable",
    description: "Cryptographic proofs. Every random value is provably fair.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Simple",
    description: "One function call. No oracles, no subscriptions, no setup.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
];

const ROADMAP = [
  {
    phase: "Phase 1",
    title: "Research & Design",
    status: "in-progress",
    items: [
      "Commit-reveal scheme with keccak256 entropy mixing",
      "VDF fallback for high-stakes randomness requests",
      "EIP-712 typed signatures for request authentication",
      "Gas optimization targeting 0.001 ETH per request",
      "Base L2 architecture for sub-cent transaction costs",
    ],
  },
  {
    phase: "Phase 2",
    title: "Smart Contracts",
    status: "upcoming",
    items: [
      "RandomnessCoordinator.sol — core request queue",
      "EntropyPool.sol — entropy accumulation and mixing",
      "VRFConsumer.sol — base contract for integrators",
      "Callback dispatch with reentrancy protection",
      "Request batching for gas efficiency",
    ],
  },
  {
    phase: "Phase 3",
    title: "Security Audit",
    status: "upcoming",
    items: [
      "Third-party audit by reputable firm",
      "Focus: entropy manipulation resistance",
      "Focus: front-running prevention",
      "Focus: callback reentrancy vectors",
      "Bug bounty program launch",
    ],
  },
  {
    phase: "Phase 4",
    title: "Testnet Launch",
    status: "upcoming",
    items: [
      "Base Sepolia deployment",
      "Testnet faucet for free requests",
      "Example contracts: lottery, NFT reveal, gaming",
      "Developer documentation",
      "Community testing program",
    ],
  },
  {
    phase: "Phase 5",
    title: "Mainnet Launch",
    status: "upcoming",
    items: [
      "Base mainnet deployment",
      "TypeScript SDK",
      "React hooks (@molt/vrf-react)",
      "Foundry & Hardhat plugins",
      "Production monitoring dashboard",
    ],
  },
];

const CODE_EXAMPLE = `// Request randomness in your contract
import {VRFConsumer} from "@molt/vrf/VRFConsumer.sol";

contract Lottery is VRFConsumer {
    function pickWinner() external {
        // Request random number, pay ~0.001 ETH
        requestRandomness();
    }

    function fulfillRandomness(uint256 randomness) internal override {
        // Called automatically with your random value
        uint256 winnerIndex = randomness % participants.length;
        winner = participants[winnerIndex];
    }
}`;

export default function VRFPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Molt
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="text-xs">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse" />
                In Development
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Native On-Chain
              <br />
              <span className="text-primary">Randomness</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              Stop paying Chainlink VRF fees. Get verifiable random numbers on-chain
              for a fraction of the cost. Built on Base L2.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://x.com/MoltProto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Follow for Updates
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
            Why Molt VRF?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
              <Card key={i} className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Code Example */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
            Simple Integration
          </h2>
          <Card className="bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <span className="text-xs text-muted-foreground font-mono">Lottery.sol</span>
              <Badge variant="outline" className="text-xs">Solidity</Badge>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-foreground/90">
                {CODE_EXAMPLE}
              </code>
            </pre>
          </Card>
        </motion.div>
      </div>

      {/* Comparison */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
            Molt VRF vs Chainlink VRF
          </h2>
          <Card className="bg-card border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Feature</th>
                  <th className="text-center text-xs font-medium text-primary p-4">Molt VRF</th>
                  <th className="text-center text-xs font-medium text-muted-foreground p-4">Chainlink VRF</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border">
                  <td className="p-4 text-foreground">Cost per request</td>
                  <td className="p-4 text-center text-primary font-medium">~0.001 ETH</td>
                  <td className="p-4 text-center text-muted-foreground">0.1+ LINK (~$1.50)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-foreground">Subscription required</td>
                  <td className="p-4 text-center text-primary font-medium">No</td>
                  <td className="p-4 text-center text-muted-foreground">Yes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-foreground">Token needed</td>
                  <td className="p-4 text-center text-primary font-medium">ETH only</td>
                  <td className="p-4 text-center text-muted-foreground">LINK token</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-foreground">Response time</td>
                  <td className="p-4 text-center text-primary font-medium">~4 seconds</td>
                  <td className="p-4 text-center text-muted-foreground">~60 seconds</td>
                </tr>
                <tr>
                  <td className="p-4 text-foreground">Setup complexity</td>
                  <td className="p-4 text-center text-primary font-medium">1 function</td>
                  <td className="p-4 text-center text-muted-foreground">Subscription + funding</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </motion.div>
      </div>

      {/* Roadmap */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
            Development Roadmap
          </h2>
          <div className="space-y-4">
            {ROADMAP.map((phase, i) => (
              <Card key={i} className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${phase.status === 'in-progress' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      {i < ROADMAP.length - 1 && <div className="w-0.5 h-full bg-border mt-1 min-h-[80px]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground font-mono">{phase.phase}</span>
                        <h3 className="font-medium text-foreground">{phase.title}</h3>
                        {phase.status === 'in-progress' && (
                          <Badge variant="outline" className="text-xs border-primary text-primary">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <ul className="space-y-1.5">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-1">-</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Want to help build this?</h2>
              <p className="text-muted-foreground mb-6">
                Join the Molt community. Contribute ideas, earn points, shape the protocol.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  View Leaderboard
                </Link>
                <a
                  href="https://x.com/MoltProto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Follow @MoltProto
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-8 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Molt Protocol</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/oracle" className="hover:text-foreground transition-colors">AI Oracle</Link>
            <a href="https://x.com/MoltProto" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
