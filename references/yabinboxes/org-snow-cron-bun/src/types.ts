export const DEFAULT_SNOW_HOST_URL = "http://snow-monkeys.com:8080";
export const MAX_HEALTH_FAILURES = 10;

export interface QueueRecord {
  snowName: string;
  healthUrl: string;
  snowHostUrl: string;
}

export interface QueueUpsertRequest {
  snowName: string;
  healthUrl: string;
  snowHostUrl?: string;
  actorId: string;
  gitType: string;
}

export interface LivenessProbeRecord extends QueueRecord {
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LivenessProbeProfile {
  id: number;
  snowName: string | null;
  actorId: string;
  gitType: string;
  records: LivenessProbeRecord[];
  total: number;
}

export interface FailedLivenessProbeRecord extends QueueRecord {
  failureCount: number;
  lastError: string;
  failedAt: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DeletedLivenessProbeRecord extends QueueRecord {
  failureCount: number;
  deletedAt: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DashboardPayload {
  repository: string;
  response: string;
  status: string;
}
