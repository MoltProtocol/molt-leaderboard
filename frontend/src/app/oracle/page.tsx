"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const FEATURES = [
  {
    title: "Decentralized",
    description: "No single point of failure. Distributed nodes run AI inference.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: "Verifiable",
    description: "ZK proofs ensure every AI response is computed correctly.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Open Source",
    description: "Run any open-source model. Llama, Mistral, and more.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Incentivized",
    description: "Node operators stake tokens and earn fees for honest work.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const ARCHITECTURE = [
  {
    layer: "Smart Contracts",
    description: "On-chain request/response coordination",
    items: ["OracleCoordinator.sol", "NodeRegistry.sol", "StakingPool.sol", "DisputeResolver.sol"],
  },
  {
    layer: "Node Network",
    description: "Distributed inference nodes",
    items: ["Rust node client", "Model runtime (llama.cpp)", "ZK proof generation", "P2P gossip layer"],
  },
  {
    layer: "Verification",
    description: "Cryptographic proof system",
    items: ["RISC Zero zkVM", "Optimistic verification", "1hr challenge window", "Slashing for fraud"],
  },
  {
    layer: "SDK & Tools",
    description: "Developer integration",
    items: ["TypeScript SDK", "React hooks", "Solidity interfaces", "REST API gateway"],
  },
];

const ROADMAP = [
  {
    phase: "Phase 1",
    title: "Architecture Design",
    status: "in-progress",
    items: [
      "Optimistic oracle with 1hr challenge window",
      "Node staking: 1000 MOLT minimum, 0.1% per verified request",
      "Slashing mechanism: 50% for provably wrong responses",
      "RISC Zero zkVM for ZK proof generation",
      "Starting with Llama 3.1 8B quantized (feasible for commodity hardware)",
      "Evaluating Optimism vs Arbitrum vs Base for settlement",
    ],
  },
  {
    phase: "Phase 2",
    title: "GitHub Repo & MVP",
    status: "upcoming",
    items: [
      "Public monorepo: /contracts, /node, /sdk",
      "Basic text completion oracle",
      "Single-model support (Llama 3.1 8B)",
      "Local development environment",
      "Integration test suite",
    ],
  },
  {
    phase: "Phase 3",
    title: "Testnet Node Network",
    status: "upcoming",
    items: [
      "Recruit 10-20 CT node operators",
      "Testnet staking with mock tokens",
      "Real inference requests from demo dApps",
      "Node operator documentation",
      "Performance benchmarking",
    ],
  },
  {
    phase: "Phase 4",
    title: "DAO Governance",
    status: "upcoming",
    items: [
      "Governor contract deployment",
      "Model whitelist voting",
      "Fee parameter governance",
      "Treasury allocation proposals",
      "Snapshot integration for signaling",
    ],
  },
  {
    phase: "Phase 5",
    title: "Model Plugin System",
    status: "upcoming",
    items: [
      "Standardized ModelAdapter interface",
      "Community model proposals via governance",
      "Plugin registry with semantic versioning",
      "Model performance benchmarks",
      "Automated compatibility testing",
    ],
  },
  {
    phase: "Phase 6",
    title: "Mainnet Launch",
    status: "upcoming",
    items: [
      "Production deployment",
      "Node incentive program",
      "Documentation portal",
      "Enterprise API tier",
      "Ecosystem grants program",
    ],
  },
];

const CODE_EXAMPLE = `// Request AI inference in your contract
import {AIConsumer} from "@molt/oracle/AIConsumer.sol";

contract SmartAssistant is AIConsumer {
    function analyzeData(string calldata prompt) external {
        // Request AI inference from the network
        requestInference(
            "llama-3.1-8b",  // model
            prompt,          // input
            100              // max tokens
        );
    }

    function fulfillInference(
        bytes32 requestId,
        string memory response
    ) internal override {
        // Verified AI response delivered on-chain
        emit AnalysisComplete(requestId, response);
    }
}`;

const ECONOMICS = [
  { label: "Minimum Stake", value: "1,000 MOLT", description: "Required to run a node" },
  { label: "Node Reward", value: "0.1%", description: "Per verified request" },
  { label: "Slash Amount", value: "50%", description: "For provably wrong responses" },
  { label: "Challenge Window", value: "1 hour", description: "For dispute submission" },
];

export default function OraclePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
              Decentralized
              <br />
              <span className="text-primary">AI Oracle</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              Bring AI inference on-chain. Open-source models, verifiable computation,
              and cryptographic proofs. No centralized API keys.
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
            Why Molt Oracle?
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

      {/* Architecture */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
            System Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARCHITECTURE.map((layer, i) => (
              <Card key={i} className="bg-card border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="font-medium text-foreground">{layer.layer}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{layer.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item, j) => (
                      <span
                        key={j}
                        className="text-xs bg-muted px-2 py-1 rounded font-mono text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Economics */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
            Token Economics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ECONOMICS.map((item, i) => (
              <Card key={i} className="bg-card border border-border">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold font-mono text-primary mb-1">{item.value}</p>
                  <p className="text-xs font-medium text-foreground mb-0.5">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
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
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
            Simple Integration
          </h2>
          <Card className="bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <span className="text-xs text-muted-foreground font-mono">SmartAssistant.sol</span>
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

      {/* How it Works */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
            How It Works
          </h2>
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Request", desc: "dApp submits inference request on-chain with payment" },
                  { step: "2", title: "Compute", desc: "Node picks up request, runs inference locally" },
                  { step: "3", title: "Prove", desc: "Node generates ZK proof of correct execution" },
                  { step: "4", title: "Deliver", desc: "Response + proof submitted, callback triggered" },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-mono font-bold flex items-center justify-center mx-auto mb-3">
                      {item.step}
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Roadmap */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
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

      {/* Node Operator CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Run a Node</h2>
                  <p className="text-muted-foreground mb-4">
                    Earn MOLT by running AI inference for the network. Stake tokens,
                    process requests, get rewarded.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      GPU with 8GB+ VRAM
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      1,000 MOLT stake minimum
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Earn 0.1% per verified request
                    </li>
                  </ul>
                  <a
                    href="https://x.com/MoltProto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Join waitlist for testnet
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Build with Molt Oracle</h2>
                  <p className="text-muted-foreground mb-4">
                    Integrate AI into your smart contracts. Verified responses,
                    on-chain callbacks, simple SDK.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Text generation & analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Classification & extraction
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Custom model plugins
                    </li>
                  </ul>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Contribute ideas for points
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
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
            <Link href="/vrf" className="hover:text-foreground transition-colors">VRF</Link>
            <a href="https://x.com/MoltProto" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
