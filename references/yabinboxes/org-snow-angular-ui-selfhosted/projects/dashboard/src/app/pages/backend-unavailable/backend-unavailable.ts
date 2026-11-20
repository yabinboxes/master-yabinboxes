import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SelfHostedApi } from '../../services/actions-api/self-hosted.api';

@Component({
  selector: 'app-backend-unavailable',
  imports: [],
  templateUrl: './backend-unavailable.html',
})
export default class BackendUnavailable {
  private selfHostedApi = inject(SelfHostedApi);
  private router = inject(Router);

  isRetrying = signal(false);
  retryFailed = signal(false);

  tryAgain(): void {
    this.isRetrying.set(true);
    this.retryFailed.set(false);
    this.selfHostedApi.getFirstTimeFlag().subscribe({
      next: (row) => {
        this.isRetrying.set(false);
        void this.router.navigateByUrl(row.firstTimeFlag === 1 ? '/settings-first-time-configs' : '/login');
      },
      error: () => {
        this.isRetrying.set(false);
        this.retryFailed.set(true);
      },
    });
  }
}
