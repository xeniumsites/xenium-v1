// deno-lint-ignore-file no-explicit-any
import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible@2.0.47";

export const createLovableAiGatewayProvider = (lovableApiKey: string) =>
  createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  } as any);
