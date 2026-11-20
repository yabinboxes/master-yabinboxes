# Quick Reference Guide

**Project:** Snow Angular UI (`snow-angular-ui`)

A quick reference for common tasks and code snippets in the Snow Angular UI project.

## Table of Contents

- [Common Code Snippets](#common-code-snippets)
- [Service Usage](#service-usage)
- [Component Patterns](#component-patterns)
- [API Calls](#api-calls)
- [Routing](#routing)
- [Styling](#styling)

---

## Common Code Snippets

### Inject a Service

```typescript
import { inject } from '@angular/core';

export class MyComponent {
  private service = inject(MyService);
}
```

### Use Signals

```typescript
import { signal, computed } from '@angular/core';

export class MyComponent {
  private data = signal<string>('initial');
  readonly dataSignal = this.data.asReadonly();
  
  readonly computedValue = computed(() => {
    return this.data().toUpperCase();
  });
  
  updateData(value: string): void {
    this.data.set(value);
  }
}
```

### Make HTTP Request

```typescript
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class MyComponent {
  private http = inject(HttpClient);
  
  loadData(): void {
    this.http.get<DataType>('/api/endpoint').subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error)
    });
  }
}
```

### Use Router

```typescript
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export class MyComponent {
  private router = inject(Router);
  
  navigate(): void {
    this.router.navigate(['/path']);
  }
}
```

---

## Service Usage

### FirebaseAuth

```typescript
// Sign in
authService.signInWithGitHub().subscribe({
  next: (user) => console.log('Signed in:', user),
  error: (error) => console.error('Error:', error)
});

// Check authentication
if (authService.isAuthenticated()) {
  const user = authService.currentUser();
}

// Sign out
authService.signOut().subscribe();
```

### HandleProfiles

```typescript
// Get profile
const profile = profilesService.profile;

// Set license
profilesService.license = 'individual';

// Get token
const token = profilesService.pipelineSnowToken;

// Regenerate token
profilesService.regenerateToken({ actorId, gitType: 'github' }).subscribe({
  next: (response) => {
    if (response.token) {
      profilesService.pipelineSnowToken = response.token;
    }
  }
});
```

### HandleDeploymentsRequest

```typescript
// Load deployments
deploymentsService.loadSourceDeployments().subscribe();

// Search
deploymentsService.searchSourceDeployments('query').subscribe();

// Update filters
deploymentsService.setFilters(newFilters);

// Apply filters
deploymentsService.applyFilters(newFilters);

// Access deployments
const deployments = deploymentsService.sourceDeployments();
```

### NotificationDeployment (WebSocket)

```typescript
// Connect
notificationService.connect('ws://snow-monkeys.com:8080/ws');

// Listen to messages
notificationService.getMessages().subscribe(message => {
  const data = JSON.parse(message);
  // Handle message
});

// Listen to errors
notificationService.getErrors().subscribe(error => {
  console.error('WebSocket error:', error);
});

// Disconnect
notificationService.disconnect();
```

---

## Component Patterns

### Basic Component

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.html'
})
export class MyComponent {
  // Component logic
}
```

### Component with Signals

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [],
  templateUrl: './my-component.html'
})
export class MyComponent {
  private count = signal(0);
  readonly countSignal = this.count.asReadonly();
  
  increment(): void {
    this.count.update(value => value + 1);
  }
}
```

### Component with Router

```typescript
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-component.html'
})
export class MyComponent {
  private router = inject(Router);
  
  navigate(): void {
    this.router.navigate(['/path']);
  }
}
```

---

## API Calls

### Get Profile

```typescript
profilesApi.getProfile(userEmail, { actorId, actor, gitType: 'github' }).subscribe({
  next: (response) => console.log('Profile:', response),
  error: (error) => console.error('Error:', error)
});
```

### Load Deployments

```typescript
// Uses actorId + gitType — GET /get-snow-deployments?actorId={actorId}&gitType={gitType}&type=ALL
deploymentsService.loadSourceDeployments();
```

### Update License

```typescript
profilesApi.updateLicense('individual', userEmail).subscribe({
  next: (response) => console.log('Updated:', response),
  error: (error) => console.error('Error:', error)
});
```

### Get Pipeline Token

```typescript
profilesApi.getPipelineSnowToken({ actorId, gitType: 'github' }).subscribe({
  next: (response) => {
    if (response.token) {
      // Use token
    }
  }
});
```

### Regenerate Token

```typescript
profilesApi.regeneratePipelineSnowToken({ actorId, gitType: 'github' }).subscribe({
  next: (response) => {
    if (response.token) {
      profilesService.pipelineSnowToken = response.token;
    }
  }
});
```

---

## Routing

### Define Route

```typescript
// app.routes.ts
{
  path: 'my-route',
  loadComponent: () => import('./pages/my-page/my-page'),
  canActivate: [authGuard] // Optional
}
```

### Navigate Programmatically

```typescript
this.router.navigate(['/path']);
this.router.navigate(['/path'], { queryParams: { id: '123' } });
```

### Use RouterLink in Template

```html
<a routerLink="/path">Link</a>
<a [routerLink]="['/path', id]">Link with param</a>
```

---

## Styling

### DaisyUI Classes

```html
<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>

<!-- Cards -->
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">Content</div>
</div>

<!-- Alerts -->
<div class="alert alert-info">Info</div>
<div class="alert alert-success">Success</div>
<div class="alert alert-error">Error</div>

<!-- Badges -->
<span class="badge badge-primary">Badge</span>
```

### Tailwind Utilities

```html
<!-- Layout -->
<div class="flex items-center justify-between">
<div class="grid grid-cols-3 gap-4">

<!-- Spacing -->
<div class="p-4 m-2">
<div class="space-y-4">

<!-- Colors (DaisyUI theme) -->
<div class="bg-base-100 text-base-content">
<div class="text-primary">Primary text</div>
```

### Conditional Classes

```html
<button [class.btn-success]="isSuccess()">Button</button>
<div [ngClass]="{'active': isActive()}">Content</div>
```

---

## Environment Configuration

### Access Environment

```typescript
import { environment } from '../../environments/environment';

const apiUrl = `${environment.api.baseUrl}${environment.api.endpoints.profile}`;
```

### Check Production

```typescript
if (environment.production) {
  // Production code
}
```

---

## Common Utilities

### Date Formatting

```typescript
// In component
formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// In template
{{ date | date:'shortDate' }}
```

### Copy to Clipboard

```typescript
copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied!');
  }).catch(err => {
    console.error('Failed:', err);
  });
}
```

### Scroll to Element

```typescript
scrollToElement(id: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
```

---

## Error Handling Pattern

```typescript
this.service.method().subscribe({
  next: (data) => {
    // Handle success
    this.successSignal.set(true);
  },
  error: (error) => {
    // Handle error
    this.errorSignal.set(error.message || 'An error occurred');
    console.error('Error:', error);
  }
});
```

---

## Form Handling

### Reactive Form

```typescript
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export class MyComponent {
  private fb = inject(FormBuilder);
  
  myForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  onSubmit(): void {
    if (this.myForm.valid) {
      const value = this.myForm.value;
      // Handle form submission
    }
  }
}
```

### Template Form Binding

```html
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <input formControlName="name" />
  <input formControlName="email" />
  <button type="submit" [disabled]="myForm.invalid">Submit</button>
</form>
```

---

## Quick Links

- [Full Documentation](README.md)
- [Services Documentation](SERVICES.md)
- [Components Documentation](COMPONENTS.md)
- [API Documentation](API.md)
- [Development Guide](DEVELOPMENT.md)
- [Architecture Overview](ARCHITECTURE.md)
