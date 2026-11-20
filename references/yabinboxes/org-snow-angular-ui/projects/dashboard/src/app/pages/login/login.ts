import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseAuth } from '../../services/auth/firebase-auth';
import { HandleProfiles } from '../../services/handlers/handle-profiles';
import { UserProfile } from '../../interfaces/model/user-profile.interface';

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
  private authService = inject(FirebaseAuth);
  private profilesService = inject(HandleProfiles);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit() {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([returnUrl]);
    }
  }

  signInWithGitHub() {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.signInWithGitHub().subscribe({
      next: (user) => {
        console.log('GitHub sign-in successful:', user);
        
        const actorId = this.authService.getGithubActorId(user);
        const actor = this.authService.getGithubActor(user);
        console.log('GitHub actorId:', actorId);
        console.log('GitHub actor:', actor);

        // Set profile in profile service
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          providerId: user.providerData[0]?.providerId || 'unknown',
          gitType: 'github',
          actorId,
          actor,
        };
        this.profilesService.profile = userProfile;
        console.log('Profile set in profile service:', userProfile);

        this.isLoading = false;
        // Redirect to returnUrl or home — dashboard loads profile once via profileQuery
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: (error: any) => {
        console.error('GitHub sign-in error:', error);
        this.errorMessage = error?.message || 'Failed to sign in with GitHub';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login attempt:', { email });
      // TODO: Implement email/password authentication with Firebase if needed
      // For now, navigate to dashboard
      this.router.navigate(['/']);
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
