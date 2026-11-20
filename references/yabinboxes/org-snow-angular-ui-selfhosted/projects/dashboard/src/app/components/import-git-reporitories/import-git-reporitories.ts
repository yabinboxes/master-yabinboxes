import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DashboardAuth } from '../../services/auth/dashboard-auth';
import { lastValueFrom } from 'rxjs';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { GithubActionsApi } from '../../services/actions-api/github-actions.api';
import { GithubRepo } from '../../interfaces/model/api-github.interface';
import { HandleTabs } from '../../services/handlers/handle-tabs';
import { LucideAngularModule, CircleCheck } from 'lucide-angular';

/**
 * @deprecated Import screen. Not routed.
 * Publishing repositories from this screen is deprecated and is not implemented.
 */
@Component({
  selector: 'app-import-git-reporitoies',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './import-git-reporitories.html'
})
export class ImportGitReporitoies {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(DashboardAuth);
  private readonly githubApi = inject(GithubActionsApi);
  private readonly tabsHandler = inject(HandleTabs);
  private readonly queryClient = injectQueryClient();

  constructor() {
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
    const token = formToken || undefined;
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
    return user?.username || user?.displayName || '';
  }
}
