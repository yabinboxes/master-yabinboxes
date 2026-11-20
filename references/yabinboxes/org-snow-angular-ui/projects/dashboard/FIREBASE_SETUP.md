# Firebase GitHub Authentication Setup Guide

## ✅ Integration Complete

Firebase Authentication with GitHub login has been integrated into your application. Follow these steps to complete the setup.

## Step 1: Install Firebase Packages

Install Firebase and Angular Fire packages:

```bash
npm install firebase @angular/fire --legacy-peer-deps
```

If you encounter permission errors, try:
```bash
rm -rf node_modules
npm install firebase @angular/fire --legacy-peer-deps
```

## Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard
4. Enable **Authentication** in the Firebase Console:
   - Go to **Authentication** → **Sign-in method**
   - Click on **GitHub** provider
   - Enable it and add your GitHub OAuth App credentials:
     - **Client ID**: Your GitHub OAuth App Client ID
     - **Client Secret**: Your GitHub OAuth App Client Secret
   - Add authorized domains (e.g., `localhost`)

The dashboard requests GitHub scopes `repo` and `read:org` so Sync Git can list **private** and **internal** org repos. After changing scopes, users must **sign out and sign in with GitHub again** so GitHub issues a new token.

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on the **Web** icon (`</>`) to add a web app
4. Register your app (you can skip hosting setup for now)
5. Copy the Firebase configuration object

## Step 4: Configure GitHub OAuth App

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **"New OAuth App"** or edit existing
3. Set:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:4200`
   - **Authorization callback URL**: 
     - For Firebase: `https://YOUR-PROJECT-ID.firebaseapp.com/__/auth/handler`
     - Or use: `http://localhost:4200` (Firebase will handle the redirect)
4. Copy the **Client ID** and generate a **Client Secret**

## Step 5: Update Environment Configuration

Update `projects/dashboard/src/environments/environment.ts` with your Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-project-id.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project-id.appspot.com',
    messagingSenderId: 'your-messaging-sender-id',
    appId: 'your-app-id'
  }
};
```

## Step 6: Configure Firebase Authentication

In Firebase Console → Authentication → Sign-in method:

1. Enable **GitHub** provider
2. Enter your GitHub OAuth App:
   - **Client ID**: From GitHub OAuth App
   - **Client Secret**: From GitHub OAuth App
3. Save the configuration

## Step 7: Test the Integration

1. Start the development server:
   ```bash
   npm run start
   # or
   npx ng serve
   ```

2. Navigate to `http://:4200/login`

3. Click **"Continue with GitHub"** to test the authentication flow

## What Was Integrated

### Files Created/Modified:

1. **Environment Configuration**
   - `projects/dashboard/src/environments/environment.ts` - Firebase configuration

2. **Application Configuration**
   - `projects/dashboard/src/app/app.config.ts` - Firebase providers setup

3. **Firebase Auth Service**
   - `projects/dashboard/src/app/services/firebase-auth.service.ts` - Authentication service with GitHub sign-in

4. **Updated Login Page**
   - `projects/dashboard/src/app/pages/login/login.ts` - Firebase GitHub authentication
   - `projects/dashboard/src/app/pages/login/login.html` - GitHub login button

5. **Updated Navigation**
   - `projects/dashboard/src/app/shared/navbar/navbar.ts` - Firebase auth integration
   - `projects/dashboard/src/app/shared/navbar/navbar.html` - User profile display

## Features

✅ **GitHub OAuth Login** - Sign in with GitHub account  
✅ **User Profile Display** - Show authenticated user info in navbar  
✅ **Logout Functionality** - Sign out from Firebase  
✅ **Auth State Management** - Reactive signals for auth state  
✅ **Error Handling** - Graceful error messages  
✅ **Loading States** - Loading indicators during authentication  

## Next Steps

### Add Route Protection

Create an auth guard to protect routes:

```typescript
// projects/dashboard/src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(FirebaseAuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
```

Then use it in your routes:

```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () => import('./pages/dashboard/dashboard')
}
```

### Add Email/Password Authentication (Optional)

To add email/password authentication, update the `FirebaseAuthService`:

```typescript
signInWithEmailAndPassword(email: string, password: string): Observable<User> {
  return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
    map((result) => result.user)
  );
}

createUserWithEmailAndPassword(email: string, password: string): Observable<User> {
  return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
    map((result) => result.user)
  );
}
```

## Troubleshooting

### Package Installation Issues
- Use `--legacy-peer-deps` flag due to Angular 21 compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Firebase Configuration Errors
- Ensure all Firebase config values are correct
- Check that Authentication is enabled in Firebase Console
- Verify GitHub provider is enabled and configured

### GitHub OAuth Issues
- Ensure callback URL matches Firebase auth domain
- Check that GitHub OAuth App credentials are correct
- Verify authorized domains in Firebase include `localhost`

### Authentication Popup Blocked
- Check browser popup blocker settings
- Ensure Firebase domain is in allowed list
- Try using redirect method instead of popup

## Security Best Practices

1. **Environment Variables**: Never commit Firebase config with real credentials to version control
2. **Firebase Rules**: Set up proper Firestore Security Rules if using Firestore
3. **HTTPS**: Use HTTPS in production (Firebase requires it)
4. **Authorized Domains**: Configure authorized domains in Firebase Console

## Support

For more information, visit:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Angular Fire Documentation](https://github.com/angular/angularfire)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps)
