import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardAuth } from '../../services/auth/dashboard-auth';
import { GithubAuth } from '../../services/auth/github-auth';
import { GitlabAuth } from '../../services/auth/gitlab-auth';
import { HandleProfiles } from '../../services/handlers/handle-profiles';
import { RuntimeConfig } from '../../services/runtime-config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(DashboardAuth);
  private gitlabAuth = inject(GitlabAuth);
  private githubAuth = inject(GithubAuth);
  private profilesService = inject(HandleProfiles);
  private runtimeConfig = inject(RuntimeConfig);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.errorMessage = this.authService.signInError();
    if (this.authService.isAuthenticated()) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.authService.consumeStoredReturnUrl();
      const profile = this.authService.getCurrentUserProfile();
      if (profile) {
        this.profilesService.profile = profile;
      }
      this.router.navigateByUrl(returnUrl);
    }
  }

  usesGitlab(): boolean {
    return this.runtimeConfig.authProvider !== 'github';
  }

  signInWithGitHub(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.githubAuth.signInWithGitHub(returnUrl).subscribe({
      error: (error: Error) => {
        this.errorMessage = error?.message || 'Failed to sign in with GitHub';
        this.isLoading = false;
      }
    });
  }

  signInWithGitlab() {
    this.isLoading = true;
    this.errorMessage = null;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.gitlabAuth.signInWithGitlab(returnUrl).subscribe({
      error: (error: Error) => {
        this.errorMessage = error?.message || 'Failed to sign in with GitLab';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email } = this.loginForm.value;
      console.log('Login attempt:', { email });
      this.errorMessage = this.usesGitlab()
        ? 'Email and password sign-in is not enabled. Continue with GitLab.'
        : 'Email and password sign-in is not enabled. Continue with GitHub.';
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
