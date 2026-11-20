import { LicenseType } from '../model/license.interface';

export interface UpdateLicenseRequest {
  email?: string;
  license: LicenseType;
}

export interface PipelineSnowTokenResponse {
  token?: string;
  /** Some backends may return alternate keys; see extractPipelineToken. */
  Token?: string;
  snowToken?: string;
  pipelineSnowToken?: string;
  pipelineToken?: string;
}


export interface PipelineSnowTokenIdentity {
  actorId: number;
  gitType: string;
}

export interface GetProfileRequest {
  email: string;
  actorId?: string;
  actor?: string;
  gitType?: string;
}
