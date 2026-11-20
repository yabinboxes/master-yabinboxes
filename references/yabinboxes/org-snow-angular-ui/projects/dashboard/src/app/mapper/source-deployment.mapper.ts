import { APIPersistentSnowDeployment, APISnowDeploymentResponse } from "../interfaces/api/api-deployment.interface";
import { CardColor, ProviderType, SourceDeployment, SourceType } from "../interfaces/model/source-deployment.interface";

export class SourceDeploymentMapper {
  private static readonly DEFAULT_TAB_ID = 'default';
  private static normalizeSourceType(value?: string | null): SourceType {
    const normalized = (value || '').toLowerCase();
    if (normalized === 'service' || normalized === 'services') return 'service';
    if (normalized === 'cluster' || normalized === 'kluster') return 'cluster';
    if (normalized === 'resource' || normalized === 'resources') return 'resource';
    return 'application';
  }

  private static normalizeProvider(value?: string | null): ProviderType {
    const normalized = (value || '').toLowerCase();
    if (
      normalized === 'digitalocean' ||
      normalized === 'cloudflare' ||
      normalized === 'civo' ||
      normalized === 'azure' ||
      normalized === 'aws'
    ) {
      return normalized as ProviderType;
    }
    return '';
  }

  /** Pretty-print JSON from the API. Objects, JSON strings, and snake_case keys all become text. */
  static asJsonText(value: unknown): string {
    if (value == null) return '';
    const text = typeof value === 'string' ? value.trim() : JSON.stringify(value);
    if (!text || text === '{}' || text === '[]' || text === 'null') return '';
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }

  private static readJson(item: object, camelKey: string, snakeKey: string): string {
    const record = item as unknown as Record<string, unknown>;
    const value = record[camelKey] ?? record[snakeKey];
    return SourceDeploymentMapper.asJsonText(value);
  }

  private static normalizeColor(value?: string | null): CardColor {
    const normalized = (value || '').toLowerCase();
    if (
      normalized === 'blue' ||
      normalized === 'green' ||
      normalized === 'red' ||
      normalized === 'yellow' ||
      normalized === 'orange'
    ) {
      return normalized as CardColor;
    }
    return '';
  }

  static toSourceMapper(item: APISnowDeploymentResponse): SourceDeployment {
    const normalizedProvider = SourceDeploymentMapper.normalizeProvider(item.provider);
    const normalizedSourceType = SourceDeploymentMapper.normalizeSourceType(item.snowType);
    const normalizedColor = SourceDeploymentMapper.normalizeColor(item.color);

    return {
      sourceId: item.snowDeploymentId,
      sourceName: item.snowName,
      sourceType: normalizedSourceType,
      tabId: item.tabId || 0,
      healthCheckUrl: item.healthCheckUrl || '',
      healthCheckTime: item.healthCheckTime || '50000',
      livenessType: item.livenessType || '',
      livenessStatus: item.livenessStatus || 'unknown',
      repository: item.repository || item.repositoryOwner || '',
      sourceCodeRepository: item.repositoryOwner,
      providers: normalizedProvider,
      iacExtra: normalizedProvider,
      updatedDate: item.createdAt,
      createdDate: item.createdAt,
      owner: item.repositoryOwner || '',
      url: item.url,
      description: item.notes || '',
      color: normalizedColor,
      terraformOutput: SourceDeploymentMapper.readJson(item, 'terraformOutput', 'terraform_output'),
      terraformVars: SourceDeploymentMapper.readJson(item, 'terraformVars', 'terraform_vars'),
      dockerOutput: SourceDeploymentMapper.readJson(item, 'dockerOutput', 'docker_output'),
      dockerVars: SourceDeploymentMapper.readJson(item, 'dockerVars', 'docker_vars')
    };
  }

  static mapAPISnowDeploymentResponseToSourceDeploymentMapper(items: APISnowDeploymentResponse[]): SourceDeployment[] {
    if (!items || items.length === 0) {
      return [];
    }
    return items.map((item) => SourceDeploymentMapper.toSourceMapper(item));
  }

  static toPersistentSourceMapper(item: APIPersistentSnowDeployment): SourceDeployment {
    const normalizedProvider = SourceDeploymentMapper.normalizeProvider(item.provider);
    const normalizedSourceType = SourceDeploymentMapper.normalizeSourceType(item.snowType);

    return {
      sourceId: String(item.snowDeploymentId ?? ''),
      sourceName: item.snowName,
      sourceType: normalizedSourceType,
      tabId: item.tabId || 0,
      healthCheckUrl: item.healthCheckUrl || '',
      healthCheckTime: item.healthCheckTime || '50000',
      livenessType: item.livenessType || '',
      livenessStatus: item.livenessStatus || 'unknown',
      repository: item.repository || item.repositoryOwner || '',
      sourceCodeRepository: item.repositoryOwner || '',
      providers: normalizedProvider,
      iacExtra: normalizedProvider,
      updatedDate: '',
      createdDate: '',
      owner: item.repositoryOwner || '',
      url: item.url || '',
      description: item.description || item.notes || '',
      color: '',
      terraformOutput: SourceDeploymentMapper.readJson(item, 'terraformOutput', 'terraform_output'),
      terraformVars: SourceDeploymentMapper.readJson(item, 'terraformVars', 'terraform_vars'),
      dockerOutput: SourceDeploymentMapper.readJson(item, 'dockerOutput', 'docker_output'),
      dockerVars: SourceDeploymentMapper.readJson(item, 'dockerVars', 'docker_vars')
    };
  }

  static mapAPIPersistentSnowDeploymentToSourceDeploymentMapper(items: APIPersistentSnowDeployment[]): SourceDeployment[] {
    if (!items || items.length === 0) {
      return [];
    }
    return items.map((item) => SourceDeploymentMapper.toPersistentSourceMapper(item));
  }
}