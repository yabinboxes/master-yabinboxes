import { Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirstTimeSetup, SelfHostedApi, SelfHostedRecord } from '../../services/actions-api/self-hosted.api';
import { normalizeBaseUrl, normalizeRedirectUri, RuntimeConfig, SnowAuthProvider } from '../../services/runtime-config';

@Component({
  selector: 'app-settings-first-time-configs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings-first-time-configs.html',
})
export default class SettingsFirstTimeConfigs implements OnInit {
  private runtimeConfig = inject(RuntimeConfig);
  private selfHostedApi = inject(SelfHostedApi);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private pendingTimeouts = new Set<ReturnType<typeof setTimeout>>();

  gitlabSaved = signal(false);
  gitlabError = signal<string | null>(null);
  githubSaved = signal(false);
  githubError = signal<string | null>(null);
  usesGithub = signal(this.runtimeConfig.authProvider === 'github');
  usesGitlab = signal(this.runtimeConfig.authProvider !== 'github');
  authProviderSaved = signal(false);
  authProviderError = signal<string | null>(null);
  isFinishing = signal(false);
  finishError = signal<string | null>(null);

  readonly gitlabForm = this.fb.nonNullable.group({
    baseUrl: [this.runtimeConfig.gitlab.baseUrl, Validators.required],
    clientId: [this.runtimeConfig.gitlab.clientId],
    redirectUri: [this.runtimeConfig.gitlab.redirectUri],
  });
  readonly githubForm = this.fb.nonNullable.group({
    baseUrl: [this.runtimeConfig.github.baseUrl, Validators.required],
    clientId: [this.runtimeConfig.github.clientId],
    redirectUri: [this.runtimeConfig.github.redirectUri],
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.clearPendingTimeouts());
  }

  ngOnInit(): void {
    this.selfHostedApi.getRecord().subscribe({
      next: (row) => {
        if (row.firstTimeFlag === 0) {
          void this.router.navigateByUrl('/login');
          return;
        }
        try {
          this.showRecord(row);
        } catch (error) {
          this.finishError.set(error instanceof Error ? error.message : 'Could not load the saved configuration.');
        }
      },
      // The server may not reach baseUrl; only the browser treats a failure as backend unavailable.
      error: () => {
        if (isPlatformBrowser(this.platformId)) {
          void this.router.navigateByUrl('/backend-unavailable');
        }
      },
    });
  }

  private scheduleClear(callback: () => void, delayMs: number): void {
    const timeoutId = setTimeout(() => {
      this.pendingTimeouts.delete(timeoutId);
      callback();
    }, delayMs);
    this.pendingTimeouts.add(timeoutId);
  }

  private clearPendingTimeouts(): void {
    for (const timeoutId of this.pendingTimeouts) {
      clearTimeout(timeoutId);
    }
    this.pendingTimeouts.clear();
  }

  selectAuthProvider(provider: SnowAuthProvider, event: Event): void {
    event.preventDefault();
    if (this.runtimeConfig.authProvider === provider) {
      return;
    }
    const value = provider === 'github' ? this.githubForm.getRawValue() : this.gitlabForm.getRawValue();
    this.authProviderError.set(null);
    this.persist(provider, value, () => {
      this.authProviderSaved.set(true);
      this.scheduleClear(() => this.authProviderSaved.set(false), 3000);
    }, (message) => this.authProviderError.set(message));
  }

  saveGitlab(): void {
    this.gitlabSaved.set(false);
    this.gitlabError.set(null);
    this.persist('gitlab', this.gitlabForm.getRawValue(), () => {
      this.gitlabSaved.set(true);
      this.scheduleClear(() => this.gitlabSaved.set(false), 3000);
    }, (message) => this.gitlabError.set(message));
  }

  gitlabUnchanged(): boolean {
    return this.providerUnchanged(this.gitlabForm.getRawValue(), this.runtimeConfig.gitlab);
  }

  saveGithub(): void {
    this.githubSaved.set(false);
    this.githubError.set(null);
    this.persist('github', this.githubForm.getRawValue(), () => {
      this.githubSaved.set(true);
      this.scheduleClear(() => this.githubSaved.set(false), 3000);
    }, (message) => this.githubError.set(message));
  }

  githubUnchanged(): boolean {
    return this.providerUnchanged(this.githubForm.getRawValue(), this.runtimeConfig.github);
  }

  finish(): void {
    this.finishError.set(null);
    const provider = this.usesGithub() ? this.githubForm.getRawValue() : this.gitlabForm.getRawValue();
    if (!provider.baseUrl.trim()) {
      this.finishError.set(this.usesGithub() ? 'GitHub base URL is required.' : 'GitLab base URL is required.');
      return;
    }

    const body: FirstTimeSetup = {
      auth: this.usesGithub() ? 'github' : 'gitlab',
      baseUrl: provider.baseUrl.trim(),
      clientId: provider.clientId.trim(),
      redirectUri: provider.redirectUri.trim(),
      hostBaseUrl: this.runtimeConfig.api.baseUrl,
    };

    try {
      normalizeBaseUrl(body.baseUrl);
      normalizeRedirectUri(body.redirectUri);
    } catch (error) {
      this.finishError.set(error instanceof Error ? error.message : 'Enter a valid configuration.');
      return;
    }

    this.isFinishing.set(true);
    this.selfHostedApi.finishFirstTime(body).subscribe({
      next: () => {
        this.runtimeConfig.applyPersistedSetup(body);
        this.isFinishing.set(false);
        void this.router.navigateByUrl('/');
      },
      error: (error: Error) => {
        this.isFinishing.set(false);
        this.finishError.set(error?.message || 'Could not save the first-time configuration.');
      },
    });
  }

  private showRecord(record: SelfHostedRecord): void {
    this.runtimeConfig.applyPersistedSetup(record);
    const provider = record.auth === 'github' ? 'github' : 'gitlab';
    const current = provider === 'github' ? this.runtimeConfig.github : this.runtimeConfig.gitlab;
    const value = {
      baseUrl: current.baseUrl,
      clientId: current.clientId,
      redirectUri: current.redirectUri,
    };
    if (provider === 'github') {
      this.githubForm.setValue(value);
    } else {
      this.gitlabForm.setValue(value);
    }
    this.usesGithub.set(provider === 'github');
    this.usesGitlab.set(provider === 'gitlab');
  }

  private persist(
    provider: SnowAuthProvider,
    value: { baseUrl: string; clientId: string; redirectUri: string },
    onSaved: () => void,
    onError: (message: string) => void,
  ): void {
    if (!value.baseUrl.trim()) {
      onError(provider === 'github' ? 'GitHub base URL is required.' : 'GitLab base URL is required.');
      return;
    }
    try {
      normalizeBaseUrl(value.baseUrl);
      normalizeRedirectUri(value.redirectUri);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Enter a valid configuration.');
      return;
    }

    this.selfHostedApi.updateRecord({
      auth: provider,
      baseUrl: value.baseUrl.trim(),
      clientId: value.clientId.trim(),
      redirectUri: value.redirectUri.trim(),
    }).subscribe({
      next: (row) => {
        this.showRecord(row);
        onSaved();
      },
      error: () => onError('Could not save the configuration.'),
    });
  }

  private providerUnchanged(
    value: { baseUrl: string; clientId: string; redirectUri: string },
    current: { baseUrl: string; clientId: string; redirectUri: string },
  ): boolean {
    return value.baseUrl.trim().replace(/\/+$/, '') === current.baseUrl
      && value.clientId.trim() === current.clientId
      && value.redirectUri.trim() === current.redirectUri;
  }
}
