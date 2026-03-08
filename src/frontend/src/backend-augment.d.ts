// Augments the config module so createActorWithConfig returns a type
// that includes the internal access-control initializer method.
// This satisfies the call in useActor.ts without modifying protected files.
import type { backendInterface } from "./backend";

type BackendWithInit = backendInterface & {
  _initializeAccessControlWithSecret(secret: string): Promise<void>;
};

declare module "./config" {
  function createActorWithConfig(options?: {
    agentOptions?: Record<string, unknown>;
  }): Promise<BackendWithInit>;
}
