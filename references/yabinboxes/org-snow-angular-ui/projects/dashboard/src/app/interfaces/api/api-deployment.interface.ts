export interface APIDeploymentResponse {
  deploymentId: number;
  repository: string;
  profileToken: string;
  status: string;
  repositoryInfo: string;
  createdAt: Date;
}

export interface APIRepositoryInfoResponse {
  sha: string;
  host: string;
  actor: string;
  status: string;
  hostPath: string;
  metadata: string;
  repository: string;
}

export interface APIProfileResponse {
  email: string;
  license?: string;
  org?: string;
  gitType?: string;
}

export interface APIPersistentSnowDeployment {
  snowDeploymentId: number | string;
  snowType: string;
  snowName: string;
  tabId?: number;
  healthCheckUrl?: string;
  healthCheckTime?: string;
  livenessType?: string;
  livenessStatus?: string;
  provider?: string;
  repositoryOwner?: string;
  repository?: string;
  status?: string;
  url?: string;
  urlPath?: string;
  port?: string;
  image?: string;
  registry?: string;
  notes?: string;
  description?: string;
  terraformOutput?: string;
  terraformVars?: string;
  dockerOutput?: string;
  dockerVars?: string;
}

export interface APISnowDeploymentResponse {
  snowDeploymentId: string;
  snowType: string;
  snowName: string;
  tabId?: number;
  tabName?: string;
  healthCheckUrl: string;
  healthCheckTime: string;
  livenessType?: 'deployable' | 'not-deployable' | 'unknown';
  livenessStatus?: 'active' | 'inactive' | 'not-deployable' | 'unknown';
  provider: string;
  repositoryOwner: string;
  createdAt: string;
  status: string;
  url: string;
  repository: string;
  urlPath: string;
  port: string;
  image: string;
  registry: string;
  notes: string;
  color: string;
  terraformOutput?: string;
  terraformVars?: string;
  dockerOutput?: string;
  dockerVars?: string;
}

/** @deprecated Import screen. Not routed. */
export type PublishSnowDeploymentPayload = {
  tabName: string;
  tabId: number;
  snowToken: string;
  actor: string;
  email: string;
  sha: string;
  snowType: 'APPLICATION' | 'SERVICE' | 'CLUSTER';
  snowName: string;
  provider: string;
  repositoryOwner: string;
  url: string;
  repository: string;
  urlPath: string;
  port: string;
  image: string;
  registry: string;
  status: string;
  payload: string;
  notes: string;
  processed: number;
  extras: string;
  description: string;
  healthCheckUrl: string;
  healthCheckTime: string;
  livenessType: string;   // 'deployable' | 'not-deployable' | 'unknown'
  livenessStatus: string; // 'active' | 'inactive' | 'not-deployable' | 'unknown'
};
