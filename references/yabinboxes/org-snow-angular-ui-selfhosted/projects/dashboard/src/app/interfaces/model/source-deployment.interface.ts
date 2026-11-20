export type SourceType = 'application' | 'service' | 'cluster' | 'resource';
export type ProviderType = 'digitalocean' | 'cloudflare' | 'civo' | 'azure' | 'aws' | '';
export type CardColor = '' | 'blue' | 'green' | 'red' | 'yellow' | 'orange';

export interface SourceDeployment {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  tabId: number;
  healthCheckUrl: string;
  healthCheckTime: string;
  livenessType: string | 'deployable' | 'not-deployable' | 'unknown';
  livenessStatus: string | 'active' | 'inactive' | 'not-deployable' | 'unknown';
  repository: string;
  sourceCodeRepository: string;
  providers: string;
  iacExtra: string;
  updatedDate: string;
  createdDate: string;
  owner: string;
  url: string;
  description: string;
  color: string;
  terraformOutput: string;
  terraformVars: string;
  dockerOutput: string;
  dockerVars: string;
}
