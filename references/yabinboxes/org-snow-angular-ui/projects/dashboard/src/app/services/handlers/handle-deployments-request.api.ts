import { effect, inject, Injectable, signal } from '@angular/core';
import { SourceDeployment } from '../../interfaces/model/source-deployment.interface';
import { APIPersistentSnowDeployment, APISnowDeploymentResponse, PublishSnowDeploymentPayload } from '../../interfaces/api/api-deployment.interface';
import { lastValueFrom } from 'rxjs';
import { SourceDeploymentMapper } from '../../mapper/source-deployment.mapper';
import { TypesForm } from '../../interfaces/model/filters.interface';
import { FirebaseAuth } from '../auth/firebase-auth';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
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
  private searchQuery = signal<string>('');
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
  private authService = inject(FirebaseAuth);
  private profilesService = inject(HandleProfiles);
  private deploymentsApi = inject(DeploymentsActionsApi);
  private router = inject(Router);

  private deploymentsQuery = injectQuery(() => ({
    queryKey: ['snow-deployments', this.actorId(), this.gitType(), 'ALL'],
    queryFn: () => {
      const actorId = this.actorId();
      if (actorId == null) {
        return Promise.resolve([] as APISnowDeploymentResponse[]);
      }

      return Promise.all([
        lastValueFrom(this.deploymentsApi.fetchSnowDeployments(actorId, 'ALL', this.gitType())),
        lastValueFrom(this.deploymentsApi.fetchPersistentSnowDeployments()).catch(() => [] as APIPersistentSnowDeployment[])
      ]).then(([profileRows, persistentRows]) =>
        HandleDeploymentsRequest.overlayPersistentFields(profileRows, persistentRows)
      );
    },
    enabled: this.actorId() != null
  }));

  private publishSnowDeploymentMutation = injectMutation(() => ({
    mutationFn: (payload: PublishSnowDeploymentPayload) =>
      lastValueFrom(
        this.deploymentsApi.publishSnowDeployment(payload)
      )
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

    // Derive visible deployments from filters + search query.
    effect(() => {
      const filters = this.filters();
      const query = this.searchQuery().trim().toLowerCase();
      const allDeployments = this.allSourceDeployments();
      const base = this.applyFiltersToDeployments(allDeployments, filters);
      const filtered = query
        ? base.filter((item) =>
            item.sourceName.toLowerCase().includes(query)
          )
        : base;
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
    const actorId = currentUser ? this.authService.getGithubActorId(currentUser) : null;

    if (actorId == null) {
      console.error('GitHub actor id not available. User must be authenticated via GitHub.');
      this.sourceDeploymentLoading.set(false);
      return;
    }

    this.actorId.set(actorId);
    this.gitType.set(this.profilesService.profile?.gitType || 'github');
    this.sourceDeploymentLoading.set(true);
    this.deploymentsQuery.refetch();
  }

  loadPersistentDeployments() {
    this.sourceDeploymentLoading.set(true);
    lastValueFrom(this.deploymentsApi.fetchPersistentSnowDeployments())
      .then((rows: APIPersistentSnowDeployment[]) => {
        const mappedDeployments = SourceDeploymentMapper.mapAPIPersistentSnowDeploymentToSourceDeploymentMapper(rows);
        this.allSourceDeployments.set(mappedDeployments);
        this.sourceDeploymentLoading.set(false);
      })
      .catch((error) => {
        console.error('Error loading persistent deployments:', error);
        this.sourceDeploymentLoading.set(false);
      });
  }

  searchSourceDeployments(query: string) {
    this.searchQuery.set(query);
  }

  async removeSourceDeployment(deployment: SourceDeployment): Promise<void> {
    const currentUser = this.authService.currentUser();
    const actorId =
      this.actorId() ??
      (currentUser ? this.authService.getGithubActorId(currentUser) : null);
    const gitType =
      this.gitType() || this.profilesService.profile?.gitType || 'github';
    const repository = deployment.repository || deployment.sourceCodeRepository;

    if (actorId == null) {
      throw new Error('GitHub actor id is required to delete a deployment.');
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

  /**
   * Profile deployments (`/get-snow-deployments`) can omit terraformVars that
   * `/get-snow-deployments-persistent` already stored. Copy the persistent JSON
   * onto the matching repository + name before the panel renders.
   */
  private static overlayPersistentFields(
    profileRows: APISnowDeploymentResponse[],
    persistentRows: APIPersistentSnowDeployment[]
  ): APISnowDeploymentResponse[] {
    const latestByKey = new Map<string, APIPersistentSnowDeployment>();
    for (const row of persistentRows) {
      const key = `${row.repository || ''}\n${row.snowName || ''}`.toLowerCase();
      const current = latestByKey.get(key);
      if (!current || Number(row.snowDeploymentId) >= Number(current.snowDeploymentId)) {
        latestByKey.set(key, row);
      }
    }

    return profileRows.map((row) => {
      const persistent = latestByKey.get(`${row.repository || ''}\n${row.snowName || ''}`.toLowerCase());
      if (!persistent) return row;
      return {
        ...row,
        terraformOutput: row.terraformOutput || persistent.terraformOutput,
        terraformVars: row.terraformVars || persistent.terraformVars,
        dockerOutput: row.dockerOutput || persistent.dockerOutput,
        dockerVars: row.dockerVars || persistent.dockerVars
      };
    });
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

  /** @deprecated Import screen. Not routed. */
  publishSnowDeployment(payload: PublishSnowDeploymentPayload) {
    return this.publishSnowDeploymentMutation.mutateAsync(payload);
  }
}
