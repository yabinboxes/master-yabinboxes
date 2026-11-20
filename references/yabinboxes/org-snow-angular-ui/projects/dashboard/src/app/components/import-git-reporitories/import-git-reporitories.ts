import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FirebaseAuth } from '../../services/auth/firebase-auth';
import {
  HandleDeploymentsRequest,
} from '../../services/handlers/handle-deployments-request.api';
import { lastValueFrom } from 'rxjs';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { GithubActionsApi } from '../../services/actions-api/github-actions.api';
import { GithubRepo } from '../../interfaces/model/api-github.interface';
import { PublishSnowDeploymentPayload } from '../../interfaces/api/api-deployment.interface';
import { Router } from '@angular/router';
import { HandleTabs } from '../../services/handlers/handle-tabs';
import { LucideAngularModule, CircleCheck } from 'lucide-angular';

/** @deprecated Import screen. Not routed. */
@Component({
  selector: 'app-import-git-reporitoies',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './import-git-reporitories.html'
})
export class ImportGitReporitoies {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(FirebaseAuth);
  private readonly deploymentsApi = inject(HandleDeploymentsRequest);
  private readonly githubApi = inject(GithubActionsApi);
  private readonly tabsHandler = inject(HandleTabs);
  private readonly queryClient = injectQueryClient();
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private redirectTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.redirectTimeout) {
        clearTimeout(this.redirectTimeout);
      }
    });

    // Pre-select the first tab reactively once tabs are available.
    effect(() => {
      const tabs = this.tabs();
      if (!this.importForm.get('tabId')?.value && tabs.length) {
        this.importForm.patchValue({ tabId: tabs[0].tabId });
      }
    });
  }

  importForm: FormGroup = this.fb.group({
    token: [''],
    registry: ['github'],
    tabId: [1]
  });

  repos = signal<GithubRepo[]>([]);
  selectedRepoIds = signal<Set<number>>(new Set());
  selectedSnowTypes = signal<Map<number, 'APPLICATION' | 'SERVICE' | 'CLUSTER'>>(new Map());
  selectedDeployableStatus = signal<Map<number, 'active' | 'not-deployable'>>(new Map());
  isLoading = signal(false);
  isPublishing = signal(false);
  isRedirecting = signal(false);
  errorMessage = signal<string | null>(null);
  hasImported = signal(false);

  readonly tabs = this.tabsHandler.tabs;

  readonly activeIcon = CircleCheck;
  allSelected = computed(() => {
    const repos = this.repos();
    if (!repos.length) return false;
    const selected = this.selectedRepoIds();
    return repos.every((repo) => selected.has(repo.id));
  });

  async loadRepos() {
    const registry = this.importForm.get('registry')?.value;
    if (registry && registry !== 'github') {
      this.errorMessage.set('Only GitHub is supported for import right now.');
      this.repos.set([]);
      return;
    }

    this.hasImported.set(true);
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formToken = this.importForm.get('token')?.value?.trim();
    const token = formToken || this.authService.githubAccessToken();
    const username = this.getGithubUsername();

    if (!token && !username) {
      this.repos.set([]);
      this.errorMessage.set('GitHub username not available.');
      this.isLoading.set(false);
      return;
    }

    const request = this.githubApi.fetchRepos({
      token: token ?? undefined,
      username,
      perPage: 100,
      sort: 'updated',
      visibility: 'all'
    });

    try {
      const repos = await this.queryClient.fetchQuery({
        queryKey: ['github-repos', token || 'public', username || 'unknown'],
        queryFn: () => lastValueFrom(request),
        staleTime: 5 * 60 * 1000
      });
      this.repos.set(repos);
      this.selectedRepoIds.set(new Set());
      this.selectedSnowTypes.set(this.initialSnowTypesFromRepos(repos));
      this.selectedDeployableStatus.set(this.initialDeployableStatusFromRepos(repos));
    } catch (error: any) {
      console.error('Failed to load GitHub repositories:', error);
      this.errorMessage.set(
        error?.message || 'Failed to load GitHub repositories.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleAll(checked: boolean) {
    if (!checked) {
      this.selectedRepoIds.set(new Set());
      return;
    }

    const allIds = new Set(this.repos().map((repo) => repo.id));
    this.selectedRepoIds.set(allIds);
  }

  toggleRepo(repoId: number, checked: boolean) {
    const next = new Set(this.selectedRepoIds());
    if (checked) {
      next.add(repoId);
    } else {
      next.delete(repoId);
    }
    this.selectedRepoIds.set(next);
  }

  setSnowType(repoId: number, value: string) {
    const next = new Map(this.selectedSnowTypes());
    const normalized = value.toUpperCase();
    if (normalized === 'SERVICE' || normalized === 'CLUSTER' || normalized === 'APPLICATION') {
      next.set(repoId, normalized);
    } else {
      next.set(repoId, 'APPLICATION');
    }
    this.selectedSnowTypes.set(next);
  }

  getSnowType(repoId: number): 'APPLICATION' | 'SERVICE' | 'CLUSTER' {
    return this.selectedSnowTypes().get(repoId) || 'APPLICATION';
  }

  setDeployableStatus(repoId: number, value: string) {
    const next = new Map(this.selectedDeployableStatus());
    if (value === 'not-deployable') {
      next.set(repoId, 'not-deployable');
    } else {
      next.set(repoId, 'active');
    }
    this.selectedDeployableStatus.set(next);
  }

  getDeployableStatus(repoId: number): 'active' | 'not-deployable' {
    return this.selectedDeployableStatus().get(repoId) || 'active';
  }

  /** @deprecated Import screen. Not routed. */
  async publishSelectedRepos() {
    const selectedIds = this.selectedRepoIds();
    if (!selectedIds.size) return;

    const currentUser = this.authService.currentUser();
    const email = currentUser?.email || '';
    const actor = currentUser?.displayName || email || 'unknown';

    const selectedRepos = this.repos().filter((repo) =>
      selectedIds.has(repo.id)
    );

    const payloads = selectedRepos.map((repo) =>
      this.buildPublishPayload(repo, { email, actor })
    );

    this.isPublishing.set(true);
    this.errorMessage.set(null);

    try {
      await Promise.all(
        payloads.map((payload) => this.deploymentsApi.publishSnowDeployment(payload))
      );
      this.selectedRepoIds.set(new Set());
      this.isPublishing.set(false);
      this.isRedirecting.set(true);

      const target = this.router.url.startsWith('/dashboard-test') ? '/dashboard-test' : '/dashboard';
      this.redirectTimeout = setTimeout(() => {
        this.redirectTimeout = undefined;
        this.router.navigate([target]);
      }, 2500);
    } catch (error: any) {
      console.error('Failed to publish repositories:', error);
      this.isPublishing.set(false);
      this.errorMessage.set(
        error?.message || 'Failed to publish selected repositories.'
      );
    }
  }

  private initialSnowTypesFromRepos(
    repos: GithubRepo[]
  ): Map<number, 'APPLICATION' | 'SERVICE' | 'CLUSTER'> {
    const map = new Map<number, 'APPLICATION' | 'SERVICE' | 'CLUSTER'>();
    for (const repo of repos) {
      const snowType =
        repo.language?.toUpperCase() === 'HCL' ? 'APPLICATION' : 'SERVICE';
      map.set(repo.id, snowType);
    }
    return map;
  }

  private initialDeployableStatusFromRepos(
    repos: GithubRepo[]
  ): Map<number, 'active' | 'not-deployable'> {
    const map = new Map<number, 'active' | 'not-deployable'>();
    for (const repo of repos) {
      map.set(repo.id, 'active');
    }
    return map;
  }

  private getGithubUsername(): string {
    const user = this.authService.currentUser();
    const screenName = (
      user as { reloadUserInfo?: { screenName?: string } } | null
    )?.reloadUserInfo?.screenName;
    return screenName || user?.displayName || '';
  }

  private buildPublishPayload(
    repo: GithubRepo,
    identity: { email: string; actor: string }
  ): PublishSnowDeploymentPayload {
    const [owner] = repo.full_name.split('/');
    const snowType = this.getSnowType(repo.id);
    const livenessType = this.getDeployableStatus(repo.id);
    const selectedTabId = this.importForm.get('tabId')?.value || '';
    const selectedRegistry = this.importForm.get('registry')?.value || '';
    const selectedTabName =
      this.tabs().find((tab) => tab.tabId === selectedTabId)?.tabName || '';

    console.log('Building payload for repo:', {
      snowName: repo.name,
      repositoryOwner: owner,
      repository: repo.full_name,
      snowType,
      livenessType,
      selectedTabId,
      selectedTabName,
      selectedRegistry
    });

    return {
      tabName: selectedTabName,
      tabId: parseInt(selectedTabId),
      snowToken: '',                                         // attribute populated at notify or publish
      actor: identity.actor,
      email: identity.email,
      sha: '',
      snowType,
      snowName: repo.name,
      provider: '',
      repositoryOwner: owner || '',
      url: '',
      repository: repo.full_name || '',
      urlPath: '',
      port: '',
      image: '',
      registry: selectedRegistry,
      status: '',
      payload: '',
      notes: '',
      processed: 0,
      extras: '',
      description: repo.description || '',
      healthCheckUrl: '',
      healthCheckTime: '',
      livenessType, //'deployable' | 'not-deployable' | 'unknown'
      livenessStatus: 'unknown'
    };
  }
}
