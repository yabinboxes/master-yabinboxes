import { effect, inject, Injectable, signal } from '@angular/core';
import { SourceDeployment } from '../../interfaces/model/source-deployment.interface';
import { APISnowDeploymentResponse } from '../../interfaces/api/api-deployment.interface';
import { lastValueFrom } from 'rxjs';
import { SourceDeploymentMapper } from '../../mapper/source-deployment.mapper';
import { TypesForm } from '../../interfaces/model/filters.interface';
import { DashboardAuth } from '../auth/dashboard-auth';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DeploymentsActionsApi } from '../actions-api/deployments-actions.api';
import { HandleProfiles } from './handle-profiles';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HandleDeploymentsRequest {
  // Public reactive state consumed by dashboard UI.
  sourceDeployments = signal<SourceDeployment[]>([]);
  // Unfiltered cache; filters + search are derived from this.
  private allSourceDeployments = signal<SourceDeployment[]>([]);
  readonly allSourceDeploymentsSignal = this.allSourceDeployments.asReadonly();
  sourceDeploymentLoading = signal(true);
  private actorId = signal<number | null>(null);
  private gitType = signal<string>('github');
  private static readonly repositoryFilterStorageKey = 'snow.sources.repositoryFilter';
  private searchQuery = signal<string>('');
  private repositoryQuery = signal<string>(HandleDeploymentsRequest.readRepositoryFilter());
  filters = signal<TypesForm>({
    applications: true,
    services: true,
    cluster: true,
    resources: true,
    civo: true,
    digitalocean: true,
    cloudflare: true,
    azure: true,
    aws: true,
    nocolor: true,
    blue: true,
    green: true,
    red: true,
    yellow: true,
    orange: true
  });
  private authService = inject(DashboardAuth);
  private profilesService = inject(HandleProfiles);
  private deploymentsApi = inject(DeploymentsActionsApi);
  private router = inject(Router);

  private deploymentsQuery = injectQuery(() => ({
    queryKey: ['snow-deployments'],
    queryFn: () => lastValueFrom(this.deploymentsApi.fetchSnowDeployments()),
    enabled: this.actorId() != null
  }));

  constructor() {
    // Keep loading state in sync with query status.
    effect(() => {
      this.sourceDeploymentLoading.set(this.deploymentsQuery.isFetching());
    });

    // Map API responses into the unfiltered cache.
    effect(() => {
      const resp = this.deploymentsQuery.data();
      if (!resp) return;

      const mappedDeployments = SourceDeploymentMapper.mapAPISnowDeploymentResponseToSourceDeploymentMapper(resp);
      this.allSourceDeployments.set(mappedDeployments);
    });

    effect(() => {
      const error = this.deploymentsQuery.error();
      if (error) {
        console.error('Error loading deployments:', error);
      }
    });

    // Derive visible deployments from filters, name search, and repository filter.
    effect(() => {
      const filters = this.filters();
      const query = this.searchQuery().trim().toLowerCase();
      const repositoryQuery = this.repositoryQuery().trim().toLowerCase();
      const allDeployments = this.allSourceDeployments();
      const base = this.applyFiltersToDeployments(allDeployments, filters);
      const filtered = base.filter((item) => {
        const matchesName = !query || item.sourceName.toLowerCase().includes(query);
        const repository = `${item.repository ?? ''} ${item.sourceCodeRepository ?? ''}`.toLowerCase();
        const matchesRepository = !repositoryQuery || repository.includes(repositoryQuery);
        return matchesName && matchesRepository;
      });
      this.sourceDeployments.set(filtered);

      // Deprecated: import screen is not routed. Do not redirect here when the list is empty.
      // if (!this.sourceDeploymentLoading() && allDeployments.length === 0) {
      //   const base = this.router.url.startsWith('/dashboard-test') ? '/dashboard-test' : '/dashboard';
      //   this.router.navigate([`${base}/import`]);
      // }
    });
  }

  setSourceDeployments(resource: APISnowDeploymentResponse[]) {
    const mappedDeployments = SourceDeploymentMapper.mapAPISnowDeploymentResponseToSourceDeploymentMapper(resource);
    this.allSourceDeployments.set(mappedDeployments);
    this.sourceDeploymentLoading.set(false);
  }

  setFilters(filters: TypesForm) {
    this.filters.set(filters);
  }

  loadSourceDeployments() {
    const currentUser = this.authService.currentUser();
    const actorId = currentUser ? this.authService.getActorId(currentUser) : null;

    if (actorId == null) {
      console.error('User id is not available. Sign in before loading deployments.');
      this.sourceDeploymentLoading.set(false);
      return;
    }

    this.actorId.set(actorId);
    this.gitType.set(this.profilesService.profile?.gitType || 'gitlab');
    this.sourceDeploymentLoading.set(true);
    this.deploymentsQuery.refetch();
  }

  searchSourceDeployments(query: string) {
    this.searchQuery.set(query);
  }

  currentRepositoryFilter(): string {
    return this.repositoryQuery();
  }

  filterSourceDeploymentsByRepository(query: string) {
    this.repositoryQuery.set(query);
    HandleDeploymentsRequest.writeRepositoryFilter(query);
  }

  private static readRepositoryFilter(): string {
    try {
      return localStorage.getItem(HandleDeploymentsRequest.repositoryFilterStorageKey) ?? '';
    } catch {
      return '';
    }
  }

  private static writeRepositoryFilter(query: string): void {
    try {
      localStorage.setItem(HandleDeploymentsRequest.repositoryFilterStorageKey, query);
    } catch {
      // Storage can be unavailable in private mode or when the quota is full.
    }
  }

  patchSourceDeployment(sourceId: string, patch: Partial<SourceDeployment>): void {
    this.allSourceDeployments.update((items) =>
      items.map((item) => (item.sourceId === sourceId ? { ...item, ...patch } : item))
    );
  }

  async removeSourceDeployment(deployment: SourceDeployment): Promise<void> {
    const currentUser = this.authService.currentUser();
    const actorId =
      this.actorId() ??
      (currentUser ? this.authService.getActorId(currentUser) : null);
    const gitType =
      this.gitType() || this.profilesService.profile?.gitType || 'gitlab';
    const repository = deployment.repository || deployment.sourceCodeRepository;

    if (actorId == null) {
      throw new Error('Actor id is required to delete a deployment.');
    }
    if (!repository) {
      throw new Error('Repository is required to delete a deployment.');
    }

    await lastValueFrom(
      this.deploymentsApi.deleteSnowDeployment({
        repository,
        actorId,
        gitType,
      })
    );

    this.allSourceDeployments.update((items) =>
      items.filter((item) => item.sourceId !== deployment.sourceId)
    );
  }

  private applyFiltersToDeployments(deployments: SourceDeployment[], types: TypesForm): SourceDeployment[] {
    return deployments.filter((item: SourceDeployment) => {
      // Check source type filter
      const matchesSourceType =
        (types.cluster && item.sourceType === 'cluster') ||
        (types.resources && item.sourceType === 'resource') ||
        (types.applications && item.sourceType === 'application') ||
        (types.services && item.sourceType === 'service');
      
      // Check provider filter
      const matchesProvider =
        item.providers === '' ||
        (types.azure && item.providers === 'azure') ||
        (types.aws && item.providers === 'aws') ||
        (types.digitalocean && item.providers === 'digitalocean') ||
        (types.cloudflare && item.providers === 'cloudflare') ||
        (types.civo && item.providers === 'civo');
      
      // Check color filter
      // If item has no color, include it (show items without color assignment)
      // If item has a color, check if that color filter is enabled
      const matchesColor = 
        (types.nocolor && item.color === '') ||
        (types.blue && item.color === 'blue') ||
        (types.green && item.color === 'green') ||
        (types.red && item.color === 'red') ||
        (types.yellow && item.color === 'yellow') ||
        (types.orange && item.color === 'orange');
      
      return matchesSourceType && matchesProvider && matchesColor;
    });
  }

  applyFilters(types: TypesForm) {
    
    this.filters.set(types);

    this.sourceDeploymentLoading.set(false);

    
  }
}
