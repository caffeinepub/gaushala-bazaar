// Stub backend module — frontend-only app, no canister deployed

export class ExternalBlob {
  private bytes: Uint8Array;
  onProgress?: (progress: number) => void;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  static fromURL(_url: string): ExternalBlob {
    return new ExternalBlob(new Uint8Array());
  }

  async getBytes(): Promise<Uint8Array> {
    return this.bytes;
  }
}

// biome-ignore lint/complexity/noBannedTypes: stub interface required by generated config.ts
export type backendInterface = {};

export interface CreateActorOptions {
  agentOptions?: Record<string, unknown>;
}

export function createActor(
  _canisterId: string,
  _uploadFile?: unknown,
  _downloadFile?: unknown,
  _options?: CreateActorOptions,
): backendInterface {
  return {};
}
