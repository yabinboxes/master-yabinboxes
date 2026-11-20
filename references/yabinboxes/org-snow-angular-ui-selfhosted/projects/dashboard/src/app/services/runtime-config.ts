import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { dashboardConfig } from '../../../../../config';

export interface SnowApiConfig {
  baseUrl: string;
  endpoints: {
    profile: string;
    profileLicense: string;
    profileToken: string;
    snowDeployments: string;
    tabs: string;
  };
}

export interface SnowGitlabConfig {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  scopes: string;
}

export type SnowGithubConfig = SnowGitlabConfig;

export type SnowAuthProvider = 'gitlab' | 'github';

export interface SnowRuntimeConfig {
  api: SnowApiConfig;
  gitlab: SnowGitlabConfig;
  github: SnowGithubConfig;
  authProvider: SnowAuthProvider;
}

declare global {
  var snowConfig: SnowRuntimeConfig | undefined;
}

const gitlabStorageKey = 'snow.config.gitlab';
const githubStorageKey = 'snow.config.github';
const authProviderStorageKey = 'snow.config.authProvider';

interface StoredGitlabSettings {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
}

export function readRuntimeConfig(): SnowRuntimeConfig {
  const config = globalThis.snowConfig;
  if (!config) {
    throw new Error('snowConfig is not mounted. Load config.ts before starting the application.');
  }
  return config;
}

export function mountRuntimeConfig(config: SnowRuntimeConfig): SnowRuntimeConfig {
  globalThis.snowConfig = config;
  return config;
}

export function loadRuntimeConfig(bootstrapBaseUrl?: string): SnowRuntimeConfig {
  const source = structuredClone(dashboardConfig);
  source.api.baseUrl = resolveBaseUrl(bootstrapBaseUrl);
  const config = assertRuntimeConfig(source);
  applyStoredGitlab(config.gitlab);
  applyStoredProvider(config.github, githubStorageKey);
  const storedProvider = readStoredAuthProvider();
  if (storedProvider) {
    config.authProvider = storedProvider;
  }
  return mountRuntimeConfig(config);
}

export function assertRuntimeConfig(value: unknown): SnowRuntimeConfig {
  if (!value || typeof value !== 'object') {
    throw new Error('config.ts must export an object');
  }

  const record = value as Record<string, unknown>;
  const api = record['api'];
  if (!api || typeof api !== 'object') {
    throw new Error('config.ts is missing api');
  }

  const apiRecord = api as Record<string, unknown>;
  const endpoints = apiRecord['endpoints'];
  if (!endpoints || typeof endpoints !== 'object') {
    throw new Error('config.ts is missing api.endpoints');
  }

  const endpointRecord = endpoints as Record<string, unknown>;
  const gitlab = readProviderConfig(record['gitlab'], {
    baseUrl: 'https://gitlab.com',
    scopes: 'read_user',
  });
  const github = readProviderConfig(record['github'], {
    baseUrl: 'https://github.com',
    scopes: 'read:user user:email',
  });
  return {
    authProvider: readAuthProvider(record['authProvider']),
    gitlab,
    github,
    api: {
      baseUrl: requireString(apiRecord['baseUrl'], 'api.baseUrl'),
      endpoints: {
        profile: requireString(endpointRecord['profile'], 'api.endpoints.profile'),
        profileLicense: requireString(endpointRecord['profileLicense'], 'api.endpoints.profileLicense'),
        profileToken: requireString(endpointRecord['profileToken'], 'api.endpoints.profileToken'),
        snowDeployments: requireString(endpointRecord['snowDeployments'], 'api.endpoints.snowDeployments'),
        tabs: requireString(endpointRecord['tabs'], 'api.endpoints.tabs'),
      },
    },
  };
}

function readProviderConfig(
  value: unknown,
  defaults: { baseUrl: string; scopes: string },
): SnowGitlabConfig {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const baseUrl = typeof record['baseUrl'] === 'string' && record['baseUrl'].trim()
    ? normalizeBaseUrl(record['baseUrl'])
    : defaults.baseUrl;
  return {
    baseUrl,
    clientId: typeof record['clientId'] === 'string' ? record['clientId'].trim() : '',
    redirectUri: typeof record['redirectUri'] === 'string' ? record['redirectUri'].trim() : '',
    scopes: typeof record['scopes'] === 'string' && record['scopes'].trim()
      ? record['scopes'].trim()
      : defaults.scopes,
  };
}

function requireString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`config.ts is missing ${path}`);
  }
  return value;
}

export function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Enter a valid http or https URL.');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Enter a valid http or https URL.');
  }
  return trimmed;
}

function resolveBaseUrl(bootstrapBaseUrl: string | undefined): string {
  if (bootstrapBaseUrl?.trim()) {
    try {
      return normalizeBaseUrl(bootstrapBaseUrl);
    } catch {
      // Fall back to environment.ts when the docker-compose baseUrl is not a valid URL.
    }
  }
  return environment.api.baseUrl;
}

function readStoredProvider(storageKey: string): StoredGitlabSettings | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredGitlabSettings>;
    if (!value || typeof value !== 'object') return null;
    return {
      baseUrl: typeof value.baseUrl === 'string' ? value.baseUrl : '',
      clientId: typeof value.clientId === 'string' ? value.clientId : '',
      redirectUri: typeof value.redirectUri === 'string' ? value.redirectUri : '',
    };
  } catch {
    return null;
  }
}

function applyStoredGitlab(gitlab: SnowGitlabConfig): void {
  applyStoredProvider(gitlab, gitlabStorageKey);
}

function applyStoredProvider(provider: SnowGitlabConfig, storageKey: string): void {
  const stored = readStoredProvider(storageKey);
  if (!stored) return;
  if (stored.baseUrl) {
    try {
      provider.baseUrl = normalizeBaseUrl(stored.baseUrl);
    } catch {
      // Keep the baseUrl from config.ts when the saved value is no longer valid.
    }
  }
  provider.clientId = stored.clientId.trim();
  provider.redirectUri = stored.redirectUri.trim();
}

function readAuthProvider(value: unknown): SnowAuthProvider {
  return value === 'github' ? 'github' : 'gitlab';
}

function readStoredAuthProvider(): SnowAuthProvider | null {
  try {
    const value = localStorage.getItem(authProviderStorageKey);
    if (value === 'github' || value === 'gitlab') return value;
    return null;
  } catch {
    return null;
  }
}

function storeAuthProvider(provider: SnowAuthProvider): void {
  try {
    localStorage.setItem(authProviderStorageKey, provider);
  } catch {
    // Storage can be unavailable in private mode or when the quota is full.
  }
}

function storeGitlab(settings: StoredGitlabSettings): void {
  storeProvider(gitlabStorageKey, settings);
}

function storeProvider(storageKey: string, settings: StoredGitlabSettings): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable in private mode or when the quota is full.
  }
}

export function normalizeRedirectUri(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Enter a valid http or https redirect URI.');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Enter a valid http or https redirect URI.');
  }
  return trimmed;
}

@Injectable({
  providedIn: 'root',
})
export class RuntimeConfig {
  readonly api: SnowApiConfig;
  readonly gitlab: SnowGitlabConfig;
  readonly github: SnowGithubConfig;
  authProvider: SnowAuthProvider;

  constructor() {
    const config = readRuntimeConfig();
    this.api = config.api;
    this.gitlab = config.gitlab;
    this.github = config.github;
    this.authProvider = config.authProvider;
  }

  gitlabRedirectUri(): string {
    return this.gitlab.redirectUri || `${location.origin}/login`;
  }

  githubRedirectUri(): string {
    return this.github.redirectUri || `${location.origin}/login`;
  }

  url(endpoint: keyof SnowApiConfig['endpoints']): string {
    return `${this.api.baseUrl}${this.api.endpoints[endpoint]}`;
  }

  applyPersistedSetup(record: {
    auth: string;
    baseUrl: string;
    clientId: string;
    redirectUri: string;
  }): SnowAuthProvider {
    const provider: SnowAuthProvider = record.auth === 'github' ? 'github' : 'gitlab';
    const settings = {
      baseUrl: record.baseUrl,
      clientId: record.clientId ?? '',
      redirectUri: record.redirectUri ?? '',
    };
    if (provider === 'github') {
      this.updateGithub(settings);
    } else {
      this.updateGitlab(settings);
    }
    return this.updateAuthProvider(provider);
  }

  updateAuthProvider(provider: SnowAuthProvider): SnowAuthProvider {
    const next: SnowAuthProvider = provider === 'github' ? 'github' : 'gitlab';
    this.authProvider = next;
    readRuntimeConfig().authProvider = next;
    storeAuthProvider(next);
    return next;
  }

  updateGitlab(settings: StoredGitlabSettings): SnowGitlabConfig {
    const baseUrl = normalizeBaseUrl(settings.baseUrl);
    const clientId = settings.clientId.trim();
    const redirectUri = normalizeRedirectUri(settings.redirectUri);
    const next = { baseUrl, clientId, redirectUri };
    this.gitlab.baseUrl = baseUrl;
    this.gitlab.clientId = clientId;
    this.gitlab.redirectUri = redirectUri;
    const mounted = readRuntimeConfig().gitlab;
    mounted.baseUrl = baseUrl;
    mounted.clientId = clientId;
    mounted.redirectUri = redirectUri;
    storeGitlab(next);
    return { ...this.gitlab };
  }

  updateGithub(settings: StoredGitlabSettings): SnowGithubConfig {
    const baseUrl = normalizeBaseUrl(settings.baseUrl);
    const clientId = settings.clientId.trim();
    const redirectUri = normalizeRedirectUri(settings.redirectUri);
    const next = { baseUrl, clientId, redirectUri };
    this.github.baseUrl = baseUrl;
    this.github.clientId = clientId;
    this.github.redirectUri = redirectUri;
    const mounted = readRuntimeConfig().github;
    mounted.baseUrl = baseUrl;
    mounted.clientId = clientId;
    mounted.redirectUri = redirectUri;
    storeProvider(githubStorageKey, next);
    return { ...this.github };
  }
}
