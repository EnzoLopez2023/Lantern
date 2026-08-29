import type { ComponentType } from 'react';

export interface GuideSearchRegistration {
  id: string;
  title: string;
  load: () => Promise<{ default: ComponentType }>;
}

export const GUIDE_SEARCH_REGISTRY: GuideSearchRegistration[] = [
  { id: 'ios', title: 'iOS App Store Guide', load: () => import('./IosGuide') },
  { id: 'azure', title: 'Azure Hosting Guide', load: () => import('./AzureGuide') },
  { id: 'vm', title: 'Home → VM Migration', load: () => import('./VmMigrationGuide') },
  { id: 'ai-features', title: 'AI Features in Your Apps', load: () => import('./AiFeaturesGuide') },
  { id: 'claude-code', title: 'Claude Code Power User', load: () => import('./ClaudeCodeGuide') },
  { id: 'closet-to-cloud', title: 'Closet to Cloud', load: () => import('./ClosetToCloudGuide') },
  { id: 'web-game-dev', title: 'Building Web Games', load: () => import('./WebGameDevGuide') },
  { id: 'github-mastery', title: 'GitHub Mastery', load: () => import('./GitHubMasteryGuide') },
  { id: 'azure-devops', title: 'Azure DevOps End-to-End', load: () => import('./AzureDevOpsGuide') },
  { id: 'react-patterns', title: 'React 19 in Production', load: () => import('./ReactPatternsGuide') },
  { id: 'typescript-strict', title: 'TypeScript Strict Mode', load: () => import('./TypeScriptStrictGuide') },
  { id: 'vite-build', title: 'Vite Build System', load: () => import('./ViteBuildGuide') },
  { id: 'express-5', title: 'Express 5 Patterns', load: () => import('./Express5Guide') },
  { id: 'node-runtime', title: 'Node.js 22 / 24', load: () => import('./NodeRuntimeGuide') },
  { id: 'sqlite', title: 'SQLite + better-sqlite3', load: () => import('./SQLiteGuide') },
  { id: 'per-user-sqlite', title: 'Per-User SQLite', load: () => import('./PerUserSQLiteGuide') },
  { id: 'entra-id', title: 'Entra ID Deep Dive', load: () => import('./EntraIdGuide') },
  { id: 'msal-react', title: 'MSAL React', load: () => import('./MsalReactGuide') },
  { id: 'jwt-validation', title: 'JWT Validation', load: () => import('./JwtValidationGuide') },
  { id: 'nextjs-app-router', title: 'Next.js 16 App Router', load: () => import('./NextJsAppRouterGuide') },
  { id: 'msal-node', title: 'MSAL Node + OIDC', load: () => import('./MsalNodeGuide') },
  { id: 'cross-app-auth', title: 'Cross-App Authentication', load: () => import('./CrossAppAuthGuide') },
  { id: 'plex-integration', title: 'Plex Integration', load: () => import('./PlexIntegrationGuide') },
  { id: 'shadcn-radix', title: 'shadcn + Radix + cva', load: () => import('./ShadcnRadixGuide') },
  { id: 'postgres-pgvector', title: 'Postgres + pgvector', load: () => import('./PostgresPgvectorGuide') },
  { id: 'azure-ai-foundry', title: 'Azure AI Foundry', load: () => import('./AzureAiFoundryGuide') },
  { id: 'graphile-worker', title: 'graphile-worker', load: () => import('./GraphileWorkerGuide') },
  { id: 'tiptap', title: 'TipTap Editor', load: () => import('./TipTapGuide') },
  { id: 'ocr-azure-vision', title: 'OCR with Azure Vision', load: () => import('./OcrAzureVisionGuide') },
  { id: 'tailwind', title: 'Tailwind CSS', load: () => import('./TailwindGuide') },
  { id: 'mui-emotion', title: 'MUI + Emotion', load: () => import('./MuiEmotionGuide') },
  { id: 'framer-motion', title: 'Framer Motion', load: () => import('./FramerMotionGuide') },
  { id: 'recharts-mermaid', title: 'Recharts + Mermaid', load: () => import('./RechartsMermaidGuide') },
  { id: 'azure-openai', title: 'Azure OpenAI Service', load: () => import('./AzureOpenAIGuide') },
  { id: 'vector-embeddings', title: 'Vector Embeddings', load: () => import('./VectorEmbeddingsGuide') },
  { id: 'ai-cost-tracking', title: 'AI Cost Tracking', load: () => import('./AiCostTrackingGuide') },
  { id: 'file-uploads', title: 'File Uploads', load: () => import('./FileUploadsGuide') },
  { id: 'key-vault', title: 'Azure Key Vault Patterns', load: () => import('./KeyVaultGuide') },
  { id: 'dockerfile', title: 'Multi-Stage Dockerfile', load: () => import('./DockerfileGuide') },
  { id: 'app-security', title: 'Application Security', load: () => import('./AppSecurityGuide') },
  { id: 'wkwebview', title: 'WKWebView Integration Guide', load: () => import('./WKWebViewGuide') },
  { id: 'ios-playbook', title: 'iOS WebApp Deployment Playbook', load: () => import('./iOSPlaybookGuide') },
  { id: 'photo-handling', title: 'Image & Photo Handling', load: () => import('./PhotoHandlingGuide') },
  { id: 'phaser-game', title: 'Phaser 4 Game Architecture', load: () => import('./PhaserGameGuide') },
  { id: 'xcode-beginners', title: 'Xcode for Beginners', load: () => import('./XcodeBeginnersGuide') },
  { id: 'swiftui-fundamentals', title: 'SwiftUI Fundamentals', load: () => import('./SwiftUIFundamentalsGuide') },
  { id: 'first-app-tip', title: 'Build Your First App: Tip Calculator', load: () => import('./FirstAppTipGuide') },
  { id: 'first-app-todo', title: 'Build a To-Do List App', load: () => import('./FirstAppTodoGuide') },
  { id: 'godot-beginners', title: 'Godot 4 for Beginners', load: () => import('./GodotBeginnersGuide') },
  { id: 'block-blast-clone', title: 'Build a Block Blast Clone', load: () => import('./BlockBlastCloneGuide') },
  { id: 'lmstudio', title: 'LM Studio', load: () => import('./LMStudioGuide') },
];

export const GUIDE_SEARCH_IDS = GUIDE_SEARCH_REGISTRY.map(guide => guide.id);

export const assertGuideRegistryConsistency = (
  registeredIds: string[],
  searchIds = GUIDE_SEARCH_IDS,
): void => {
  const registered = [...registeredIds].sort();
  const searchable = [...searchIds].sort();
  if (
    registered.length !== searchable.length
    || registered.some((id, index) => id !== searchable[index])
  ) {
    throw new Error('Knowledge Base guide registry and search registry are inconsistent.');
  }
};
