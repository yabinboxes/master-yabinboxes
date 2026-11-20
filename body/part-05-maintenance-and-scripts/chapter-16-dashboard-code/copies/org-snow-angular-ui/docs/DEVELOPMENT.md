# Development Guide

**Project:** Snow Angular UI (`snow-angular-ui`)

This guide provides detailed information for developers working on the Snow Angular UI project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 10 or higher (comes with Node.js)
- **Angular CLI**: Version 21 or higher
  ```bash
  npm install -g @angular/cli
  ```

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd snow-angular-ui
   npm install --legacy-peer-deps
   ```

2. **Configure Environment**
   - Copy environment template (if exists)
   - Update Firebase configuration
   - Update API base URL if needed

3. **Start Development Server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Access Application**
   - Open `http://localhost:4200` in browser

---

## Development Workflow

### Project Structure

The project is a multi-project Angular workspace:

```
snow-angular-ui/
├── projects/
│   ├── dashboard/        # Main application
│   ├── docs/            # Documentation site
│   └── snow-filters/    # Library
```

### Working with Components

#### Creating a New Component

```bash
# Generate component
ng generate component projects/dashboard/src/app/components/my-component

# Or manually create:
# - my-component.ts
# - my-component.html
# - my-component.css (optional)
```

#### Component Template

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.html',
  styleUrl: './my-component.css'
})
export class MyComponent {
  // Component logic
}
```

### Working with Services

#### Creating a New Service

```bash
ng generate service projects/dashboard/src/app/services/my-service
```

#### Service Template

```typescript
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private readonly data = signal<DataType>(initialValue);
  
  readonly dataSignal = this.data.asReadonly();
  
  updateData(value: DataType): void {
    this.data.set(value);
  }
}
```

### Working with Routes

Routes are defined in `app.routes.ts`:

```typescript
export const routes: Routes = [
  {
    path: 'my-route',
    loadComponent: () => import('./pages/my-page/my-page'),
    canActivate: [authGuard] // Optional
  }
];
```

---

## Code Style

### TypeScript

- **Use strict mode**: Always enabled
- **Interfaces over types**: Prefer interfaces for object shapes
- **Explicit types**: Avoid `any`, use proper types
- **Readonly**: Mark immutable properties as `readonly`

### Angular Patterns

#### Signals

Use signals for reactive state:

```typescript
// ✅ Good
private data = signal<DataType>(initialValue);
readonly dataSignal = this.data.asReadonly();

// ❌ Avoid
private data: DataType = initialValue;
```

#### Dependency Injection

Use `inject()` function:

```typescript
// ✅ Good
private service = inject(MyService);

// ❌ Avoid (in constructor)
constructor(private service: MyService) {}
```

#### Standalone Components

All components should be standalone:

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, ...],
  // ...
})
```

### Naming Conventions

- **Components**: PascalCase (e.g., `MyComponent`)
- **Services**: PascalCase with descriptive names (e.g., `HandleProfiles`)
- **Files**: kebab-case (e.g., `my-component.ts`)
- **Variables**: camelCase (e.g., `myVariable`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)

### Code Organization

```
component/
├── component.ts         # Component logic
├── component.html       # Template
├── component.css        # Styles (optional)
└── component.spec.ts    # Tests (optional)
```

---

## Testing

### Running Tests

```bash
# Run all tests
ng test

# Run tests for specific project
ng test dashboard

# Run with coverage
ng test --code-coverage
```

### Writing Tests

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## Common Tasks

### Adding a New Page

1. **Create component files**
   ```bash
   ng generate component projects/dashboard/src/app/pages/my-page
   ```

2. **Add route**
   ```typescript
   // app.routes.ts
   {
     path: 'my-page',
     loadComponent: () => import('./pages/my-page/my-page')
   }
   ```

3. **Add navigation link** (if needed)
   ```html
   <!-- navbar.html -->
   <a routerLink="/my-page">My Page</a>
   ```

### Adding a New API Endpoint

1. **Update environment** (if new endpoint)
   ```typescript
   // environment.ts
   api: {
     endpoints: {
       newEndpoint: '/new-endpoint'
     }
   }
   ```

2. **Add method to API service**
   ```typescript
   // handle-profiles.api.ts
   newMethod(param: string): Observable<ResponseType> {
     const url = `${this.baseUrl}${environment.api.endpoints.newEndpoint}`;
     return this.http.get<ResponseType>(url).pipe(
       catchError(this.handleError.bind(this))
     );
   }
   ```

### Adding a New Filter

1. **Update interface**
   ```typescript
   // filters.interface.ts
   export interface TypesForm {
     // ... existing filters
     newFilter: boolean;
   }
   ```

2. **Update filter component**
   ```typescript
   // filters.ts
   typesForm = this.fb.group({
     // ... existing controls
     newFilter: [true]
   });
   ```

3. **Update filter logic**
   ```typescript
   // handle-deployments-request.ts
   private applyFiltersToDeployments(...) {
     return deployments.filter(item => {
       // ... existing filters
       const matchesNewFilter = types.newFilter && item.newProperty;
       return matchesSourceType && matchesProvider && matchesNewFilter;
     });
   }
   ```

---

## Troubleshooting

### Common Issues

#### 1. Dependency Conflicts

**Problem**: `npm install` fails with peer dependency conflicts

**Solution**:
```bash
npm install --legacy-peer-deps
```

#### 2. Port Already in Use

**Problem**: Port 4200 is already in use

**Solution**:
```bash
ng serve --port 4201
```

#### 3. Build Errors

**Problem**: TypeScript compilation errors

**Solution**:
- Check TypeScript version compatibility
- Ensure all imports are correct
- Run `ng build --configuration development` for detailed errors

#### 4. Firebase Auth Not Working

**Problem**: GitHub sign-in fails

**Solution**:
- Verify Firebase configuration
- Check GitHub OAuth app settings
- Ensure callback URL is correct
- See [Firebase Setup Guide](projects/dashboard/FIREBASE_SETUP.md)

#### 5. API Calls Failing

**Problem**: CORS errors or 404s

**Solution**:
- Verify backend API is running
- Check API base URL in environment
- Verify CORS configuration on backend
- Check browser console for detailed errors

### Debugging Tips

1. **Use Browser DevTools**
   - Console for errors
   - Network tab for API calls
   - Application tab for storage

2. **Angular DevTools**
   - Install Angular DevTools browser extension
   - Inspect component tree
   - View signal values

3. **Console Logging**
   ```typescript
   console.log('Debug:', variable);
   console.error('Error:', error);
   ```

4. **Breakpoints**
   - Use VS Code debugger
   - Set breakpoints in TypeScript files
   - Inspect variables and call stack

---

## Best Practices

### Performance

- Use `OnPush` change detection when possible
- Lazy load routes
- Use signals for reactive updates
- Avoid unnecessary subscriptions

### Security

- Never commit API keys or secrets
- Use environment variables for configuration
- Validate user input
- Sanitize data before display

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

### Code Quality

- Write self-documenting code
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Follow SOLID principles

---

## Resources

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [RxJS Documentation](https://rxjs.dev)
