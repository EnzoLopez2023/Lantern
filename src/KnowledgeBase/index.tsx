import { pageShellSx } from '../theme/controls';
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useGuideTTS } from './useGuideTTS';
import { assertGuideRegistryConsistency } from './guideSearchRegistry';
import GuideTTSControls from './GuideTTSControls';
import { Box, Card, CardActionArea, Chip, CircularProgress, InputBase, Stack, Typography, Button } from '@mui/material';
import {
  PhoneIphone as PhoneIcon,
  Cloud as CloudIcon,
  Computer as ComputerIcon,
  AutoAwesome as AiIcon,
  Terminal as TerminalIcon,
  Build as BuildIcon,
  SportsEsports as GameIcon,
  Hub as HubIcon,
  RocketLaunch as RocketIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Code as ReactIcon,
  DataObject as TypeScriptIcon,
  ElectricBolt as ViteIcon,
  Api as ExpressIcon,
  Memory as NodeIcon,
  Storage as SqliteIcon,
  PeopleAlt as PerUserIcon,
  AccountCircle as EntraIcon,
  Login as MsalIcon,
  VpnKey as JwtIcon,
  WebAsset as NextIcon,
  Cookie as MsalNodeIcon,
  CompareArrows as CrossAppIcon,
  TheaterComedy as PlexIcon,
  Widgets as ShadcnIcon,
  ScatterPlot as PgvectorIcon,
  SmartToy as FoundryIcon,
  Sync as WorkerIcon,
  Edit as TipTapIcon,
  ImageSearch as OcrIcon,
  Air as TailwindIcon,
  Brush as MuiIcon,
  Animation as FramerIcon,
  Insights as RechartsIcon,
  Psychology as AzureOpenAIIcon,
  Polyline as EmbeddingsIcon,
  Receipt as CostTrackingIcon,
  UploadFile as UploadsIcon,
  Lock as KeyVaultIcon,
  Layers as DockerfileIcon,
  Security as AppSecurityIcon,
  Smartphone as WKWebViewIcon,
  MenuBook as PlaybookIcon,
  PhotoLibrary as PhotoLibIcon,
  VideogameAsset as GamepadIcon,
  LaptopMac as XcodeIcon,
  IntegrationInstructions as SwiftUIIcon,
  Calculate as TipCalcIcon,
  Checklist as TodoIcon,
  AccountTree as GodotIcon,
  GridView as BlockBlastIcon,
  Dns as LMStudioIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { tokensFor } from '../theme/tokens';
import { getSearchIndex, searchAll, type GuideIndex, type SearchHit } from './searchIndex';
import PageHero from '../components/PageHero';

const IosGuide = lazy(() => import('./IosGuide'));
const AzureGuide = lazy(() => import('./AzureGuide'));
const VmMigrationGuide = lazy(() => import('./VmMigrationGuide'));
const AiFeaturesGuide = lazy(() => import('./AiFeaturesGuide'));
const ClaudeCodeGuide = lazy(() => import('./ClaudeCodeGuide'));
const ClosetToCloudGuide = lazy(() => import('./ClosetToCloudGuide'));
const WebGameDevGuide = lazy(() => import('./WebGameDevGuide'));
const GitHubMasteryGuide = lazy(() => import('./GitHubMasteryGuide'));
const AzureDevOpsGuide = lazy(() => import('./AzureDevOpsGuide'));
const ReactPatternsGuide = lazy(() => import('./ReactPatternsGuide'));
const TypeScriptStrictGuide = lazy(() => import('./TypeScriptStrictGuide'));
const ViteBuildGuide = lazy(() => import('./ViteBuildGuide'));
const Express5Guide = lazy(() => import('./Express5Guide'));
const NodeRuntimeGuide = lazy(() => import('./NodeRuntimeGuide'));
const SQLiteGuide = lazy(() => import('./SQLiteGuide'));
const PerUserSQLiteGuide = lazy(() => import('./PerUserSQLiteGuide'));
const EntraIdGuide = lazy(() => import('./EntraIdGuide'));
const MsalReactGuide = lazy(() => import('./MsalReactGuide'));
const JwtValidationGuide = lazy(() => import('./JwtValidationGuide'));
const NextJsAppRouterGuide = lazy(() => import('./NextJsAppRouterGuide'));
const MsalNodeGuide = lazy(() => import('./MsalNodeGuide'));
const CrossAppAuthGuide = lazy(() => import('./CrossAppAuthGuide'));
const PlexIntegrationGuide = lazy(() => import('./PlexIntegrationGuide'));
const ShadcnRadixGuide = lazy(() => import('./ShadcnRadixGuide'));
const PostgresPgvectorGuide = lazy(() => import('./PostgresPgvectorGuide'));
const AzureAiFoundryGuide = lazy(() => import('./AzureAiFoundryGuide'));
const GraphileWorkerGuide = lazy(() => import('./GraphileWorkerGuide'));
const TipTapGuide = lazy(() => import('./TipTapGuide'));
const OcrAzureVisionGuide = lazy(() => import('./OcrAzureVisionGuide'));
const TailwindGuide = lazy(() => import('./TailwindGuide'));
const MuiEmotionGuide = lazy(() => import('./MuiEmotionGuide'));
const FramerMotionGuide = lazy(() => import('./FramerMotionGuide'));
const RechartsMermaidGuide = lazy(() => import('./RechartsMermaidGuide'));
const AzureOpenAIGuide = lazy(() => import('./AzureOpenAIGuide'));
const VectorEmbeddingsGuide = lazy(() => import('./VectorEmbeddingsGuide'));
const AiCostTrackingGuide = lazy(() => import('./AiCostTrackingGuide'));
const FileUploadsGuide = lazy(() => import('./FileUploadsGuide'));
const KeyVaultGuide = lazy(() => import('./KeyVaultGuide'));
const DockerfileGuide = lazy(() => import('./DockerfileGuide'));
const AppSecurityGuide = lazy(() => import('./AppSecurityGuide'));
const WKWebViewGuide = lazy(() => import('./WKWebViewGuide'));
const IosPlaybookGuide = lazy(() => import('./iOSPlaybookGuide'));
const PhotoHandlingGuide = lazy(() => import('./PhotoHandlingGuide'));
const PhaserGameGuide = lazy(() => import('./PhaserGameGuide'));
const XcodeBeginnersGuide = lazy(() => import('./XcodeBeginnersGuide'));
const SwiftUIFundamentalsGuide = lazy(() => import('./SwiftUIFundamentalsGuide'));
const FirstAppTipGuide = lazy(() => import('./FirstAppTipGuide'));
const FirstAppTodoGuide = lazy(() => import('./FirstAppTodoGuide'));
const GodotBeginnersGuide = lazy(() => import('./GodotBeginnersGuide'));
const BlockBlastCloneGuide = lazy(() => import('./BlockBlastCloneGuide'));
const LMStudioGuide = lazy(() => import('./LMStudioGuide'));

export type GuideId =
  | 'ios'
  | 'azure'
  | 'vm'
  | 'ai-features'
  | 'claude-code'
  | 'closet-to-cloud'
  | 'web-game-dev'
  | 'github-mastery'
  | 'azure-devops'
  | 'react-patterns'
  | 'typescript-strict'
  | 'vite-build'
  | 'express-5'
  | 'node-runtime'
  | 'sqlite'
  | 'per-user-sqlite'
  | 'entra-id'
  | 'msal-react'
  | 'jwt-validation'
  | 'nextjs-app-router'
  | 'msal-node'
  | 'cross-app-auth'
  | 'plex-integration'
  | 'shadcn-radix'
  | 'postgres-pgvector'
  | 'azure-ai-foundry'
  | 'graphile-worker'
  | 'tiptap'
  | 'ocr-azure-vision'
  | 'tailwind'
  | 'mui-emotion'
  | 'framer-motion'
  | 'recharts-mermaid'
  | 'azure-openai'
  | 'vector-embeddings'
  | 'ai-cost-tracking'
  | 'file-uploads'
  | 'key-vault'
  | 'dockerfile'
  | 'app-security'
  | 'wkwebview'
  | 'ios-playbook'
  | 'photo-handling'
  | 'phaser-game'
  | 'xcode-beginners'
  | 'swiftui-fundamentals'
  | 'first-app-tip'
  | 'first-app-todo'
  | 'godot-beginners'
  | 'block-blast-clone'
  | 'lmstudio';

interface GuideMeta {
  id: GuideId;
  title: string;
  blurb: string;
  tags: string[];
  icon: React.ReactNode;
  accent: { light: string; dark: string };
}

const GUIDES: GuideMeta[] = [
  {
    id: 'ios',
    title: 'iOS App Store Guide',
    blurb: 'From local repo to the App Store — WKWebView bundled approach, React Native + SwiftUI paths, TestFlight, and Apple signing demystified.',
    tags: ['iOS', 'WKWebView', 'TestFlight', 'App Store'],
    icon: <PhoneIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#5C2A4A', dark: '#C77AA0' },
  },
  {
    id: 'wkwebview',
    title: 'WKWebView Integration Guide',
    blurb: 'Wrap a Vite React app in a native iOS shell — bundled dist/, custom URL scheme, Microsoft SSO via MSAL.js, Safari DevTools debugging. Written from the real Cairn deployment.',
    tags: ['WKWebView', 'iOS', 'MSAL', 'cairn://'],
    icon: <WKWebViewIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#2A4A5C', dark: '#5BAEC7' },
  },
  {
    id: 'ios-playbook',
    title: 'iOS WebApp Deployment Playbook',
    blurb: 'Generic reusable playbook — any Vite React app to the App Store. Three-folder workflow, Xcode setup, Azure AD manifest, PrivacyInfo.xcprivacy, archive and submit. 8 phases end to end.',
    tags: ['iOS', 'WKWebView', 'App Store', 'PrivacyInfo'],
    icon: <PlaybookIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#4A2A5C', dark: '#9B7CB6' },
  },
  {
    id: 'xcode-beginners',
    title: 'Xcode for Beginners',
    blurb: "Never opened Xcode? Start here. Install it, sign in with an Apple ID, create your first project, and tour every panel — Navigator, Editor, Canvas, Inspectors, Simulator, and the debugger. Pure IDE basics, no migrating your apps.",
    tags: ['Xcode', 'Beginner', 'Mac', 'Simulator'],
    icon: <XcodeIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#1D4ED8', dark: '#60A5FA' },
  },
  {
    id: 'swiftui-fundamentals',
    title: 'SwiftUI Fundamentals',
    blurb: "A from-zero Swift-language primer (var/let, types, optionals, structs, closures) then the core of SwiftUI — views, modifiers, stacks, @State + bindings, controls, lists, and navigation. Type the snippets and watch the live Canvas.",
    tags: ['SwiftUI', 'Swift', 'Beginner', '@State'],
    icon: <SwiftUIIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#D9542B', dark: '#F2865E' },
  },
  {
    id: 'first-app-tip',
    title: 'Build Your First App: Tip Calculator',
    blurb: "A complete single-screen app, step by step. Bill field, tip-percent picker, split-the-bill stepper, and live currency-formatted results — using @State, bindings, computed properties, and Form layout. ~40 lines, ~30 minutes.",
    tags: ['SwiftUI', 'Beginner', 'Project', '@State'],
    icon: <TipCalcIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0E8A5F', dark: '#5BC47E' },
  },
  {
    id: 'first-app-todo',
    title: 'Build a To-Do List App',
    blurb: "Your second app: a Codable data model, a dynamic List, a slide-up add sheet, tap-to-complete and swipe-to-delete, and saving tasks with @AppStorage so they survive relaunch. Lists, sheets, and persistence in one build.",
    tags: ['SwiftUI', 'Beginner', 'List', '@AppStorage'],
    icon: <TodoIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#7C3AED', dark: '#A78BFA' },
  },
  {
    id: 'godot-beginners',
    title: 'Godot 4 for Beginners',
    blurb: "Zero to a shipped iOS game. Install Godot on a Mac, learn GDScript, nodes & scenes, signals, touch input, and saving — then the full Apple Developer → Xcode → TestFlight pipeline. Written for total beginners new to game dev and to Mac.",
    tags: ['Godot 4', 'GDScript', 'iOS', 'TestFlight'],
    icon: <GodotIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#478CBF', dark: '#6FB7E8' },
  },
  {
    id: 'block-blast-clone',
    title: 'Build a Block Blast Clone',
    blurb: "A complete, step-by-step 2D puzzle build in Godot 4 — the 8×8 grid, draggable polyomino pieces with a snap-and-ghost preview, line clears, combo scoring, juice, high-score saving, and shipping to TestFlight. Every script shown in full.",
    tags: ['Godot 4', 'Game', '2D', 'TestFlight'],
    icon: <BlockBlastIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#4F46E5', dark: '#818CF8' },
  },
  {
    id: 'azure',
    title: 'Azure Hosting Guide',
    blurb: 'App Service, ACR, Postgres/SQL/Cosmos, GitHub Actions CI/CD, and a clean migration path off a home PC.',
    tags: ['Azure', 'App Service', 'Bicep', 'CI/CD'],
    icon: <CloudIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#2563eb', dark: '#4f9eff' },
  },
  {
    id: 'vm',
    title: 'Home → VM Migration',
    blurb: 'Move the home stack to a fresh Win11 VM — IIS + ARR + Docker + Certify. Parallel-run cutover, instant rollback.',
    tags: ['Hyper-V', 'IIS', 'Docker', 'Certify'],
    icon: <ComputerIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#15803d', dark: '#6fdc8c' },
  },
  {
    id: 'ai-features',
    title: 'AI Features in Your Apps',
    blurb: 'Anthropic SDK patterns — prompt caching, tool use, streaming, evals, cost engineering. Concrete recipes for workshop/shopkeep/glp1.',
    tags: ['Anthropic SDK', 'Caching', 'Tool use', 'Evals'],
    icon: <AiIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#7c4ea0', dark: '#9b7cb6' },
  },
  {
    id: 'claude-code',
    title: 'Claude Code Power User',
    blurb: 'Settings, hooks, skills, subagents, MCP, memory, plan mode — turn Claude Code from helpful assistant into force-multiplier dev environment.',
    tags: ['Hooks', 'Skills', 'Subagents', 'MCP'],
    icon: <TerminalIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#a8542e', dark: '#cc7b5c' },
  },
  {
    id: 'closet-to-cloud',
    title: 'Closet to Cloud',
    blurb: 'The complete migration knowledge base — 6 personal apps moved from the home PC (Docker / IIS / PM2) to Azure App Service for Linux. 18 RCAs, lessons, cheat sheet, $18/mo.',
    tags: ['Migration', 'App Service', 'Kudu', 'SQLite WAL'],
    icon: <BuildIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0e7490', dark: '#22b8cf' },
  },
  {
    id: 'web-game-dev',
    title: 'Building Web Games',
    blurb: 'Tech-stack guide: Vanilla, Pixi, Phaser, Three.js, Godot, Bevy. Mobile/touch input, audio, save state, WebGPU. 2D + 3D, hobbyist to commercial.',
    tags: ['Phaser', 'PixiJS', 'Three.js', 'WebGPU'],
    icon: <GameIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#d97706', dark: '#f59e0b' },
  },
  {
    id: 'github-mastery',
    title: 'GitHub Mastery',
    blurb: 'From direct-to-main to mastery. Branches, PRs, rulesets, webhooks, Copilot, Actions, OIDC, Dependabot. Every section has UI + CLI walkthroughs.',
    tags: ['Branches', 'Actions', 'Rulesets', 'Copilot'],
    icon: <HubIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#475569', dark: '#94a3b8' },
  },
  {
    id: 'azure-devops',
    title: 'Azure DevOps End-to-End',
    blurb: 'Comprehensive learning reference for all five services — Boards, Repos, Pipelines, Artifacts, Test Plans. Not a click tour: what every concept means, why it exists, when to use it.',
    tags: ['Boards', 'Repos', 'Pipelines', 'OIDC'],
    icon: <RocketIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0078d4', dark: '#5fb4f5' },
  },
  {
    id: 'react-patterns',
    title: 'React 19 in Production',
    blurb: 'Patterns from 8 shipping apps — view state machines, lazy chunks, AnimatePresence, the synchronous-OID MSAL race-fix, Server Components, and concurrent React.',
    tags: ['Hooks', 'lazy()', 'State machines', 'Server Components'],
    icon: <ReactIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0891b2', dark: '#22d3ee' },
  },
  {
    id: 'typescript-strict',
    title: 'TypeScript Strict Mode',
    blurb: 'From relaxed to airtight — tsconfig knob by knob, discriminated unions, narrowing, generics, branded types, and the strictness ladder across the fleet.',
    tags: ['strict', 'Discriminated unions', 'satisfies', 'tsconfig'],
    icon: <TypeScriptIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#1e40af', dark: '#60a5fa' },
  },
  {
    id: 'vite-build',
    title: 'Vite Build System',
    blurb: 'Dev server, /api proxy, VITE_ env vars, manualChunks, Docker build-args, CI propagation, Vite 8 + Rolldown. Every step from save → npm run dev → az acr build → live container.',
    tags: ['Vite', 'manualChunks', 'Docker build-args', 'az acr build'],
    icon: <ViteIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#9333ea', dark: '#c084fc' },
  },
  {
    id: 'express-5',
    title: 'Express 5 Patterns',
    blurb: 'Single-file server.js, router-per-domain, jose/jsonwebtoken auth, permission middleware, SSE streaming, the SPA-fallback rules every Express 5 app gets wrong once.',
    tags: ['Express 5', 'Middleware', 'JWT auth', 'SSE'],
    icon: <ExpressIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#16a34a', dark: '#4ade80' },
  },
  {
    id: 'node-runtime',
    title: 'Node.js 22 / 24',
    blurb: 'ESM, native modules on Alpine, multer + file-type safe uploads, undici dispatchers for self-signed TLS, express-rate-limit per OID, env validation, SIGTERM cleanup.',
    tags: ['ESM', 'native modules', 'undici', 'multer'],
    icon: <NodeIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#3c873a', dark: '#68a063' },
  },
  {
    id: 'sqlite',
    title: 'SQLite + better-sqlite3',
    blurb: 'WAL + FK, prepared statements, idempotent schema, no-framework migrations, transactions, BLOB-vs-disk, triggers, FK CASCADE, online backup with 14-day rolling.',
    tags: ['SQLite', 'WAL', 'Prepared statements', 'Triggers'],
    icon: <SqliteIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0369a1', dark: '#38bdf8' },
  },
  {
    id: 'per-user-sqlite',
    title: 'Per-User SQLite',
    blurb: 'File path = trust boundary. GUID-validated OID, getDb(oid) resolver with LRU cache, withUserDb middleware, seed-on-first-open, legacy-to-per-user migration.',
    tags: ['Multi-tenant', 'OID validation', 'LRU cache', 'isolation'],
    icon: <PerUserIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#be185d', dark: '#f472b6' },
  },
  {
    id: 'entra-id',
    title: 'Entra ID Deep Dive',
    blurb: 'Tenants, app registrations, redirect URIs, ID vs access tokens, scopes, Expose an API, OIDC federated credentials — every Entra primitive the fleet uses.',
    tags: ['Entra ID', 'App reg', 'OIDC', 'Tokens'],
    icon: <EntraIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#dc2626', dark: '#f87171' },
  },
  {
    id: 'msal-react',
    title: 'MSAL React',
    blurb: 'Bootstrap before render, useMsal hooks, AuthGuard patterns, popup vs redirect, token acquisition with refresh, API client with Bearer, the synchronous-OID race-fix.',
    tags: ['MSAL', 'AuthGuard', 'acquireTokenSilent', 'Bearer'],
    icon: <MsalIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#7c2d12', dark: '#fb923c' },
  },
  {
    id: 'jwt-validation',
    title: 'JWT Validation',
    blurb: 'Server-side token verification with jose + jsonwebtoken. JWKS, v1/v2 issuers, multi-audience matching, claim extraction, the requireAuth middleware, public-before-auth ordering.',
    tags: ['jose', 'JWKS', 'multi-audience', 'requireAuth'],
    icon: <JwtIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#365314', dark: '#a3e635' },
  },
  {
    id: 'nextjs-app-router',
    title: 'Next.js 16 App Router',
    blurb: 'PulseWire deep dive — Server vs Client Components, proxy.ts (was middleware.ts), Route Handlers, the lazy DB Proxy, instrumentation.ts boot hook, dual-process launch, standalone output.',
    tags: ['Next.js', 'RSC', 'proxy.ts', 'instrumentation'],
    icon: <NextIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#000000', dark: '#ffffff' },
  },
  {
    id: 'msal-node',
    title: 'MSAL Node + OIDC',
    blurb: 'PulseWire deep dive — Confidential Client Application, OIDC Auth Code + PKCE flow, /auth/login + /auth/callback routes, HS256 session JWT in __Host- cookie, full server-side OIDC.',
    tags: ['MSAL Node', 'OIDC', 'PKCE', '__Host- cookie'],
    icon: <MsalNodeIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#a16207', dark: '#fbbf24' },
  },
  {
    id: 'cross-app-auth',
    title: 'Cross-App Authentication',
    blurb: 'Workshop ↔ Tabloom — two app regs, one user. Expose an API, request the custom scope, acquire access token (not ID), validate audience, CORS for sibling origins, build-arg propagation.',
    tags: ['access_as_user', 'audience', 'CORS', 'sibling app'],
    icon: <CrossAppIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0e7490', dark: '#22d3ee' },
  },
  {
    id: 'plex-integration',
    title: 'Plex Integration',
    blurb: "Hearth's biggest feature — undici TLS-bypass, plexJSON/plexFetch helpers, same-file collapse, resolution-aware grouping, 3D detection, quality scoring, six-step delete guards, immutable audit log.",
    tags: ['Plex', 'undici', 'duplicate detection', 'audit log'],
    icon: <PlexIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#ca8a04', dark: '#facc15' },
  },
  {
    id: 'shadcn-radix',
    title: 'shadcn + Radix + cva',
    blurb: "PulseWire's UI stack — copy-not-install components, Radix headless primitives, cva variant system, Tailwind v4 with @theme CSS vars, the cn() utility, comparison vs MUI.",
    tags: ['shadcn/ui', 'Radix', 'cva', 'Tailwind v4'],
    icon: <ShadcnIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#737373', dark: '#d4d4d4' },
  },
  {
    id: 'postgres-pgvector',
    title: 'Postgres + pgvector',
    blurb: 'Azure Flexible Server, Drizzle ORM, vector columns at 1536 dims, IVFFlat indexes for cosine similarity, GIN expression indexes for FTS, the migration workflow.',
    tags: ['Postgres', 'pgvector', 'Drizzle', 'cosine'],
    icon: <PgvectorIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#1e40af', dark: '#3b82f6' },
  },
  {
    id: 'azure-ai-foundry',
    title: 'Azure AI Foundry',
    blurb: 'Cost-gated production AI — OpenAI-compatible Foundry endpoint, per-token pricing table, $50 monthly pause threshold, withAiCallLog instrumentation, AiPausedError discipline, daily rollups, SendGrid alerts.',
    tags: ['Foundry', 'cost cap', 'withAiCallLog', 'AiPausedError'],
    icon: <FoundryIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#9333ea', dark: '#c084fc' },
  },
  {
    id: 'graphile-worker',
    title: 'graphile-worker',
    blurb: "PulseWire's Postgres-backed job queue — task registry, addJob with jobKey idempotency, fan-out chains, exponential backoff retries, crontab schedules, esbuild bundling, the dual-process launcher.",
    tags: ['graphile-worker', 'Postgres', 'crontab', 'idempotent'],
    icon: <WorkerIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#15803d', dark: '#4ade80' },
  },
  {
    id: 'tiptap',
    title: 'TipTap Editor',
    blurb: "Tabloom's rich-text engine — ProseMirror underneath, StarterKit + 14 extensions, slash menu via Suggestion, BubbleMenu toolbar, React node views (Callout, Figure), 500ms save debounce, ~350KB lazy chunk.",
    tags: ['TipTap', 'ProseMirror', 'Suggestion', 'NodeView'],
    icon: <TipTapIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#7c2d12', dark: '#fb923c' },
  },
  {
    id: 'ocr-azure-vision',
    title: 'OCR with Azure Vision',
    blurb: "Tabloom's media OCR — Read API v3.2 async pattern (submit + poll operation-location), fire-and-forget from upload, three-state machine (indexing/indexed/failed), 4s frontend polling, graceful disabled mode.",
    tags: ['Azure CV', 'OCR', 'async', 'fire-and-forget'],
    icon: <OcrIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0369a1', dark: '#7dd3fc' },
  },
  {
    id: 'tailwind',
    title: 'Tailwind CSS',
    blurb: "Utility-first styling across the fleet — v3 with config files (GLP1, Cairn, Workshop, Tabloom, ShopKeep) and v4 with @theme inline (PulseWire, Puzzlebox). The cn() utility, mental model, performance, migration playbook.",
    tags: ['Tailwind v3', 'Tailwind v4', '@theme', 'cn()'],
    icon: <TailwindIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0284c7', dark: '#38bdf8' },
  },
  {
    id: 'mui-emotion',
    title: 'MUI + Emotion',
    blurb: "Hearth's UI library — MUI 7 with Emotion CSS-in-JS underneath. createTheme + ThemeProvider, the sx prop, useC() theme hook, Box/Stack/Grid primitives, tree-shakable icons, dark mode, ShopKeep's selective MUI pattern.",
    tags: ['MUI 7', 'Emotion', 'sx prop', 'ThemeProvider'],
    icon: <MuiIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#1976d2', dark: '#64b5f6' },
  },
  {
    id: 'framer-motion',
    title: 'Framer Motion',
    blurb: "Animation engine for GLP1 / Cairn / PulseWire — motion.* + four props, AnimatePresence + exit, Variants for parent-orchestrated stagger, useReducedMotion, layoutId magic-move, GLP1's cinematic IntroAnimation.",
    tags: ['framer-motion', 'AnimatePresence', 'Variants', 'reduced motion'],
    icon: <FramerIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#9333ea', dark: '#c084fc' },
  },
  {
    id: 'recharts-mermaid',
    title: 'Recharts + Mermaid',
    blurb: "Data viz across the fleet — Recharts composition model, six core chart types, ShopKeep Reports deep dive (15+ charts), GLP1 glucose line chart, Mermaid diagram-as-code, Hearth's MermaidDiagram component.",
    tags: ['Recharts', 'Mermaid', 'ResponsiveContainer', 'diagram-as-code'],
    icon: <RechartsIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0891b2', dark: '#22d3ee' },
  },
  {
    id: 'azure-openai',
    title: 'Azure OpenAI Service',
    blurb: "Hearth's chat backbone — direct REST (no SDK), deployment-name URL pattern, the api-key header, SSE streaming, the 2KB IIS buffer-padding hack, request abort + reader cancel, comparison vs Foundry + Anthropic.",
    tags: ['Azure OpenAI', 'SSE', 'api-key header', 'deployments'],
    icon: <AzureOpenAIIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0078d4', dark: '#5fb4f5' },
  },
  {
    id: 'vector-embeddings',
    title: 'Vector Embeddings + Semantic Search',
    blurb: "Tabloom + PulseWire deep dive — Voyage AI (1024-D, document/query input types), Azure AI Foundry embeddings (1536-D), SQLite BLOB vs pgvector storage, cosine = dot product, hash-based re-embed skip, the Tabloom embed worker.",
    tags: ['Voyage AI', 'pgvector', 'cosine similarity', 'embed worker'],
    icon: <EmbeddingsIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#7c3aed', dark: '#a78bfa' },
  },
  {
    id: 'ai-cost-tracking',
    title: 'AI Cost Tracking + Audit Trails',
    blurb: "Three logging tiers across the fleet — ShopKeep activity_log, Tabloom ai_calls, PulseWire's full ai_call_log + daily_ai_cost_rollup. withAiCallLog wrapper, per-token pricing table, MTD computation with timezone, 60s pause cache, AiPausedError, SendGrid alert with per-month idempotency.",
    tags: ['withAiCallLog', 'AiPausedError', 'MTD', 'cost cap'],
    icon: <CostTrackingIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#059669', dark: '#34d399' },
  },
  {
    id: 'lmstudio',
    title: 'LM Studio',
    blurb: 'Run AI models locally on your Mac — zero API cost, 100% private. Installation, app navigation, downloading and deploying models, the OpenAI-compatible local server, and wiring it into your Node.js / React app.',
    tags: ['LM Studio', 'Local AI', 'GGUF', 'OpenAI-compatible'],
    icon: <LMStudioIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#166534', dark: '#4ade80' },
  },
  {
    id: 'file-uploads',
    title: 'File Uploads + Media Handling',
    blurb: "Tabloom + ShopKeep deep dive — multer + disk vs base64 + BLOB, MIME prefix filter + magic-byte sniffing with file-type, auth gate + delete-on-reject, /data persistent storage on App Service, query-string OID auth for img tags, streaming downloads, fire-and-forget OCR.",
    tags: ['multer', 'file-type', 'createReadStream', '/data mount'],
    icon: <UploadsIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0e7490', dark: '#22d3ee' },
  },
  {
    id: 'key-vault',
    title: 'Azure Key Vault Patterns',
    blurb: "Bicep provisioning (RBAC mode, soft delete 90d, purge protection), @Microsoft.KeyVault(SecretUri=...) references in App Service, system-assigned managed identity scoped to one vault, the underscore→hyphen secret-name rule, DefaultAzureCredential SDK path, rotation + versioning, lab to migrate one secret.",
    tags: ['Key Vault', 'RBAC', 'managed identity', 'SecretUri'],
    icon: <KeyVaultIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#a16207', dark: '#fbbf24' },
  },
  {
    id: 'dockerfile',
    title: 'Multi-Stage Dockerfile Patterns',
    blurb: "Five fleet Dockerfiles: deps → builder → runner on node:22-alpine. apk add python3 make g++ for better-sqlite3, npm ci vs npm install, VITE_* build args, BUILD_SHA tracking for App Service silent-rollback detection, PulseWire's pnpm + non-root user, .dockerignore discipline, VOLUME mounts.",
    tags: ['multi-stage', 'alpine', 'npm ci', 'BUILD_SHA'],
    icon: <DockerfileIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#1e40af', dark: '#60a5fa' },
  },
  {
    id: 'app-security',
    title: 'Application Security Hardening',
    blurb: "The fleet's honest baseline: JWT + JWKS, trust proxy 1, generous CORS, generous size limits, manual input validation, no helmet, no rate limiting. The nine concerns, OWASP top-10 against the fleet, when each layer matters, and the recipe to add helmet / Zod / express-rate-limit / Pino redaction.",
    tags: ['trust proxy', 'helmet', 'Zod', 'rate limit'],
    icon: <AppSecurityIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#7c2d12', dark: '#fb923c' },
  },
  {
    id: 'photo-handling',
    title: 'Image & Photo Handling',
    blurb: "SecretPhoto's read-only NAS viewer — react-photo-album justified galleries, yet-another-react-lightbox with zoom, sharp/libvips thumbnails, the SQLite dimensions cache, EXIF orientation, streaming, and respond-then-prewarm.",
    tags: ['react-photo-album', 'lightbox', 'sharp', 'thumbnails'],
    icon: <PhotoLibIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#0d9488', dark: '#2dd4bf' },
  },
  {
    id: 'phaser-game',
    title: 'Phaser 4 Game Architecture',
    blurb: "sovereign-tactics deep dive — Phaser 4.1 + TS 6, the pure-TS deterministic sim core, seeded RNG that serializes with saves, the command/event boundary, simplex-noise map gen, the render bridge, and testing the core with vitest + Playwright.",
    tags: ['Phaser 4', 'deterministic', 'simplex-noise', 'vitest'],
    icon: <GamepadIcon sx={{ fontSize: 36 }} />,
    accent: { light: '#6d28d9', dark: '#a78bfa' },
  },
];

assertGuideRegistryConsistency(GUIDES.map(guide => guide.id));

interface KnowledgeBaseProps {
  guideId?: string;
  onGuideChange?: (guideId: GuideId | null) => void;
}

export default function KnowledgeBase({ guideId, onGuideChange }: KnowledgeBaseProps = {}) {
  const { mode, palette } = useThemeMode();
  const isDark = mode === 'dark';
  const initialGuide = GUIDES.some(guide => guide.id === guideId) ? guideId as GuideId : null;
  const [active, setActive] = useState<GuideId | null>(initialGuide);
  const tts = useGuideTTS(active);

  const [searchQuery, setSearchQuery] = useState('');
  const [index, setIndex] = useState<GuideIndex[] | null>(null);
  const [indexing, setIndexing] = useState(false);
  const [pendingHash, setPendingHash] = useState<string | null>(null);

  useEffect(() => {
    setActive(GUIDES.some(guide => guide.id === guideId) ? guideId as GuideId : null);
  }, [guideId]);

  const selectGuide = (next: GuideId | null) => {
    setActive(next);
    onGuideChange?.(next);
  };

  // Hub chrome from the tokens in force, so the palette pinned to Knowledge
  // Base reaches it. The individual guides keep their own local ramps.
  // Named `tk`, not `t`: the tag chips below map over a `t` of their own.
  const tk = tokensFor(isDark, palette);
  const ACCENT = isDark ? tk.rustLight : tk.rustDark;
  const TEXT_PRI = tk.ink;
  const TEXT_SEC = tk.muted;
  const BORDER = tk.line;
  const CARD_BG = tk.paper;
  const SURFACE = tk.surface;

  // Kick off indexing on first search interaction; cache the result for the session.
  const ensureIndex = () => {
    if (index || indexing) return;
    setIndexing(true);
    getSearchIndex()
      .then(setIndex)
      .finally(() => setIndexing(false));
  };

  const results = useMemo(() => {
    if (!index) return [];
    return searchAll(index, searchQuery);
  }, [index, searchQuery]);

  // After a result is clicked and the guide page renders, scroll to the requested section.
  useEffect(() => {
    if (!active || !pendingHash) return;
    let cancelled = false;
    const tryScroll = (attemptsLeft: number) => {
      if (cancelled) return;
      const el = document.getElementById(pendingHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setPendingHash(null);
        return;
      }
      if (attemptsLeft > 0) requestAnimationFrame(() => tryScroll(attemptsLeft - 1));
    };
    requestAnimationFrame(() => tryScroll(20));
    return () => {
      cancelled = true;
    };
  }, [active, pendingHash]);

  const openResult = (hit: SearchHit) => {
    setPendingHash(hit.sectionId);
    selectGuide(hit.guideId as GuideId);
  };

  if (active) {
    const meta = GUIDES.find(g => g.id === active);
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            px: 3,
            py: 1.25,
            backgroundColor: SURFACE,
            borderBottom: `1px solid ${BORDER}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Button
            onClick={() => selectGuide(null)}
            startIcon={<ArrowBackIcon />}
            size="small"
            sx={{ color: ACCENT, textTransform: 'none', fontWeight: 600 }}
          >
            Knowledge Base
          </Button>
          <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem' }}>/</Typography>
          <Typography sx={{ color: TEXT_PRI, fontSize: '0.9rem', fontWeight: 600 }}>
            {meta?.title}
          </Typography>
          <GuideTTSControls tts={tts} />
        </Box>
        <Box sx={{ flex: 1 }} className={isDark ? 'kb-guide-host dark' : 'kb-guide-host'}>
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
                <CircularProgress size={32} thickness={3} sx={{ color: ACCENT }} />
                <Typography sx={{ color: TEXT_SEC }}>Loading guide…</Typography>
              </Box>
            }
          >
            {active === 'ios' && <IosGuide />}
            {active === 'azure' && <AzureGuide />}
            {active === 'vm' && <VmMigrationGuide />}
            {active === 'ai-features' && <AiFeaturesGuide />}
            {active === 'claude-code' && <ClaudeCodeGuide />}
            {active === 'closet-to-cloud' && <ClosetToCloudGuide />}
            {active === 'web-game-dev' && <WebGameDevGuide />}
            {active === 'github-mastery' && <GitHubMasteryGuide />}
            {active === 'azure-devops' && <AzureDevOpsGuide />}
            {active === 'react-patterns' && <ReactPatternsGuide />}
            {active === 'typescript-strict' && <TypeScriptStrictGuide />}
            {active === 'vite-build' && <ViteBuildGuide />}
            {active === 'express-5' && <Express5Guide />}
            {active === 'node-runtime' && <NodeRuntimeGuide />}
            {active === 'sqlite' && <SQLiteGuide />}
            {active === 'per-user-sqlite' && <PerUserSQLiteGuide />}
            {active === 'entra-id' && <EntraIdGuide />}
            {active === 'msal-react' && <MsalReactGuide />}
            {active === 'jwt-validation' && <JwtValidationGuide />}
            {active === 'nextjs-app-router' && <NextJsAppRouterGuide />}
            {active === 'msal-node' && <MsalNodeGuide />}
            {active === 'cross-app-auth' && <CrossAppAuthGuide />}
            {active === 'plex-integration' && <PlexIntegrationGuide />}
            {active === 'shadcn-radix' && <ShadcnRadixGuide />}
            {active === 'postgres-pgvector' && <PostgresPgvectorGuide />}
            {active === 'azure-ai-foundry' && <AzureAiFoundryGuide />}
            {active === 'graphile-worker' && <GraphileWorkerGuide />}
            {active === 'tiptap' && <TipTapGuide />}
            {active === 'ocr-azure-vision' && <OcrAzureVisionGuide />}
            {active === 'tailwind' && <TailwindGuide />}
            {active === 'mui-emotion' && <MuiEmotionGuide />}
            {active === 'framer-motion' && <FramerMotionGuide />}
            {active === 'recharts-mermaid' && <RechartsMermaidGuide />}
            {active === 'azure-openai' && <AzureOpenAIGuide />}
            {active === 'vector-embeddings' && <VectorEmbeddingsGuide />}
            {active === 'ai-cost-tracking' && <AiCostTrackingGuide />}
            {active === 'file-uploads' && <FileUploadsGuide />}
            {active === 'key-vault' && <KeyVaultGuide />}
            {active === 'dockerfile' && <DockerfileGuide />}
            {active === 'app-security' && <AppSecurityGuide />}
            {active === 'wkwebview' && <WKWebViewGuide />}
            {active === 'ios-playbook' && <IosPlaybookGuide />}
            {active === 'photo-handling' && <PhotoHandlingGuide />}
            {active === 'phaser-game' && <PhaserGameGuide />}
            {active === 'xcode-beginners' && <XcodeBeginnersGuide />}
            {active === 'swiftui-fundamentals' && <SwiftUIFundamentalsGuide />}
            {active === 'first-app-tip' && <FirstAppTipGuide />}
            {active === 'first-app-todo' && <FirstAppTodoGuide />}
            {active === 'godot-beginners' && <GodotBeginnersGuide />}
            {active === 'block-blast-clone' && <BlockBlastCloneGuide />}
            {active === 'lmstudio' && <LMStudioGuide />}
          </Suspense>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={pageShellSx()}>
      <PageHero
        eyebrow="Knowledge base"
        title="Long-form guides"
        accentPhrase="guides"
        subtitle="Deploying, hosting, and migrating the apps in this repo. Each one is interactive — wizards save progress in your browser, code blocks copy with one click."
      />

      {/* Search bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.25,
          mb: searchQuery ? 2 : 4,
          borderRadius: 2,
          border: `1px solid ${BORDER}`,
          backgroundColor: CARD_BG,
          maxWidth: 720,
          transition: 'border-color 0.15s, box-shadow 0.15s',
          '&:focus-within': {
            borderColor: ACCENT,
            boxShadow: isDark ? `0 0 0 3px ${ACCENT}33` : `0 0 0 3px ${ACCENT}22`,
          },
        }}
      >
        <SearchIcon sx={{ color: TEXT_SEC, fontSize: 20 }} />
        <InputBase
          fullWidth
          placeholder={indexing ? 'Building search index…' : 'Search all guides — sections and content'}
          value={searchQuery}
          onFocus={ensureIndex}
          onChange={e => {
            setSearchQuery(e.target.value);
            ensureIndex();
          }}
          sx={{ fontSize: '0.95rem', color: TEXT_PRI }}
        />
        {indexing && <CircularProgress size={16} thickness={4} sx={{ color: ACCENT }} />}
        {searchQuery && !indexing && (
          <Button
            onClick={() => setSearchQuery('')}
            size="small"
            startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
            sx={{ color: TEXT_SEC, textTransform: 'none', minWidth: 0, px: 1 }}
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Search results */}
      {searchQuery && (
        <Box sx={{ mb: 4, maxWidth: 720 }}>
          {!index && !indexing && (
            <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem' }}>Start typing to search…</Typography>
          )}
          {index && (
            <>
              <Typography sx={{ color: TEXT_SEC, fontSize: '0.8rem', mb: 1.5 }}>
                {results.length === 0
                  ? `No results for "${searchQuery}"`
                  : `${results.length} result${results.length === 1 ? '' : 's'} for "${searchQuery}"`}
              </Typography>
              <Stack spacing={1}>
                {results.map(hit => {
                  const guide = GUIDES.find(g => g.id === hit.guideId);
                  const accent = guide ? (isDark ? guide.accent.dark : guide.accent.light) : ACCENT;
                  return (
                    <Box
                      key={`${hit.guideId}-${hit.sectionId}`}
                      onClick={() => openResult(hit)}
                      sx={{
                        cursor: 'pointer',
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${BORDER}`,
                        backgroundColor: CARD_BG,
                        transition: 'border-color 0.15s, transform 0.1s',
                        '&:hover': { borderColor: accent, transform: 'translateY(-1px)' },
                      }}
                    >
                      <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
                        <Box
                          sx={{
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 1,
                            backgroundColor: isDark ? `${accent}22` : `${accent}14`,
                            color: accent,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {hit.guideTitle}
                        </Box>
                        <Typography sx={{ color: TEXT_PRI, fontWeight: 600, fontSize: '0.92rem' }}>
                          {hit.sectionTitle}
                        </Typography>
                      </Stack>
                      <Typography sx={{ color: TEXT_SEC, fontSize: '0.82rem', lineHeight: 1.5 }}>
                        {hit.snippet}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </>
          )}
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}
      >
        {GUIDES.map(g => {
          const accent = isDark ? g.accent.dark : g.accent.light;
          return (
            <Card
              key={g.id}
              sx={{
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 2,
                boxShadow: 'none',
                transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
                '&:hover': {
                  borderColor: accent,
                  transform: 'translateY(-2px)',
                  boxShadow: isDark
                    ? `0 8px 24px rgba(0,0,0,0.4)`
                    : `0 8px 24px rgba(160, 82, 45, 0.12)`,
                },
              }}
            >
              <CardActionArea
                onClick={() => selectGuide(g.id)}
                sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: isDark
                      ? `${accent}22`
                      : `${accent}14`,
                    color: accent,
                    mb: 2,
                  }}
                >
                  {g.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--hearth-heading)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    color: TEXT_PRI,
                    mb: 0.75,
                    lineHeight: 1.2,
                  }}
                >
                  {g.title}
                </Typography>
                <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem', lineHeight: 1.55, mb: 2 }}>
                  {g.blurb}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 'auto' }}>
                  {g.tags.map(t => (
                    <Chip
                      key={t}
                      label={t}
                      size="small"
                      sx={{
                        fontSize: '0.68rem',
                        height: 22,
                        backgroundColor: SURFACE,
                        color: TEXT_SEC,
                        border: `1px solid ${BORDER}`,
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                  ))}
                </Box>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
