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
  actor?: string;
  actorId?: string;
  license?: string;
  org?: string;
  gitType?: string;
}

export interface APISnowDeploymentResponse {
  snowDeploymentId: string | number;
  snowType: string;
  snowName: string;
  gitType?: string;
  actor?: string;
  actorId?: string;
  tabId?: number;
  tabName?: string;
  healthCheckUrl: string;
  healthCheckTime: string;
  livenessType?: string;
  livenessStatus?: string;
  livenessResponse?: string;
  provider: string;
  repositoryOwner: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  environment?: string;
  url: string;
  repository: string;
  urlPath: string;
  port: string;
  image: string;
  registry: string;
  notes: string;
  description?: string;
  color: string;
  email?: string;
  terraformOutput?: string;
  terraformVars?: string;
  dockerOutput?: string;
  dockerVars?: string;
};
