import { Component, effect, inject, OnDestroy, signal, HostListener } from '@angular/core';
import { HandleDeploymentsRequest } from '../../../services/handlers/handle-deployments-request.api';
import { CardList } from '../../../components/card-list/card-list';
import { CardColor, SourceDeployment } from '../../../interfaces/model/source-deployment.interface';
import { Router, RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NotificationDeployment } from '../../../services/notifications/notification-deployment.websocket';
import { Filters } from '../../../components/filters/filters';
import { FirebaseAuth } from '../../../services/auth/firebase-auth';
import { LucideAngularModule, CircleAlert, ExternalLink, CircleCheck, Paintbrush } from 'lucide-angular';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { DeploymentsActionsApi } from '../../../services/actions-api/deployments-actions.api';

@Component({
  selector: 'snow-sources-history',
  imports: [CardList, ReactiveFormsModule, Filters, LucideAngularModule],
  templateUrl: './sources-history.html'
})
export default class SourcesHistory implements OnDestroy {

  private fb = inject(FormBuilder);
  sources = inject(HandleDeploymentsRequest);
  webSocketSources = inject(NotificationDeployment);
  private router = inject(Router);
  protected authService = inject(FirebaseAuth);
  private deploymentsApi = inject(DeploymentsActionsApi);

  readonly circleAlertIcon = CircleAlert;
  readonly circleCheckIcon = CircleCheck;
  readonly linkIcon = ExternalLink;
  readonly paintbrushIcon = Paintbrush;

  searchForm: FormGroup = this.fb.group({
    search: ['']
  });

  selectedDeployment = signal<SourceDeployment | null>(null);
  urlCopied = signal(false);
  showLivenessDropdown = signal(false);
  showColorPalette = signal(false);
  selectedColor = signal<CardColor>('');
  readonly colors: CardColor[] = ['', 'blue', 'green', 'red', 'yellow', 'orange'];
  private hasLoaded = signal(false);
  private copyUrlTimeout: ReturnType<typeof setTimeout> | null = null;

  private updateColorMutation = injectMutation(() => ({
    mutationFn: (payload: { sourceId: string; color: CardColor }) =>
      lastValueFrom(this.deploymentsApi.updateDeploymentColor(payload.sourceId, payload.color)),
    onSuccess: (response) => console.log('Color updated:', response),
    onError: (error) => console.error('Color update failed:', error),
  }));

  private updateLivenessMutation = injectMutation(() => ({
    mutationFn: (payload: { sourceId: string; livenessType: string }) =>
      lastValueFrom(this.deploymentsApi.updateDeploymentLivenessType(payload.sourceId, payload.livenessType)),
    onSuccess: (response) => console.log('Liveness updated:', response),
    onError: (error) => console.error('Liveness update failed:', error),
  }));

  constructor() {
    effect(() => {
      if (this.hasLoaded()) return;
      if (this.authService.isLoading()) return;
      const user = this.authService.currentUser();
      if (!user || this.authService.getGithubActorId(user) == null) return;
      this.hasLoaded.set(true);
      this.sources.loadPersistentDeployments();
    });

    // Show first card by default. Replace the open card when its record is refreshed
    // so terraformVars from a later response appear in the panel.
    effect(() => {
      const deployments = this.sources.sourceDeployments();
      const selected = this.selectedDeployment();
      if (deployments.length === 0) return;
      if (!selected) {
        this.selectedDeployment.set(deployments[0]);
        return;
      }
      const fresh = deployments.find((item) => item.sourceId === selected.sourceId);
      if (
        fresh &&
        (fresh.terraformVars !== selected.terraformVars ||
          fresh.terraformOutput !== selected.terraformOutput ||
          fresh.dockerVars !== selected.dockerVars ||
          fresh.dockerOutput !== selected.dockerOutput)
      ) {
        this.selectedDeployment.set({
          ...fresh,
          color: selected.color,
          livenessStatus: selected.livenessStatus
        });
      }
    });

    // Sync color picker with selected deployment's color
    effect(() => {
      const color = (this.selectedDeployment()?.color ?? '') as CardColor;
      this.selectedColor.set(this.colors.includes(color) ? color : '');
    });
  }
  
  ngOnInit() {
    console.log("render sources -> sources.ts");
    /*this.sources.loadSourceDeployments();
    console.log("resources -> ", this.sources.sourceDeployments());

    if(!this.sources.sourceDeployments() || this.sources.sourceDeployments().length === 0) {
      this.router.navigate(['/dashboard/import']);
    }

    this.webSocketSources.connect('ws://localhost:3000');
    this.webSocketSources.getMessages().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((message) => {
      try {
        const jsonMessage = JSON.parse(message);
        console.log('WebSocket message received (JSON):', jsonMessage);
        this.sources.setSourceDeployments(jsonMessage.data);
      } catch (error) {
        console.log('WebSocket message received (raw):', message);
        console.error('Failed to parse message as JSON:', error);
      }
    });*/
    
  }

  ngOnDestroy() {
    if (this.copyUrlTimeout) {
      clearTimeout(this.copyUrlTimeout);
    }
    this.webSocketSources.disconnect();
  }

  send() {
    this.webSocketSources.sendMessage('Hello from Angular WebSocket client!');
  }

  onCardSelected(card: SourceDeployment): void {
    this.selectedDeployment.set(card);
    this.urlCopied.set(false);
  }

  async onCardRemoved(card: SourceDeployment): Promise<void> {
    try {
      await this.sources.removeSourceDeployment(card);
      if (this.selectedDeployment()?.sourceId === card.sourceId) {
        this.selectedDeployment.set(null);
      }
    } catch (error) {
      console.error('Failed to delete deployment:', error);
    }
  }

  async copyApplicationUrl(): Promise<void> {
    const url = this.selectedDeployment()?.url;
    if (!url) return;

    await navigator.clipboard.writeText(url);
    this.urlCopied.set(true);
    if (this.copyUrlTimeout) {
      clearTimeout(this.copyUrlTimeout);
    }
    this.copyUrlTimeout = setTimeout(() => {
      this.urlCopied.set(false);
      this.copyUrlTimeout = null;
    }, 2000);
  }

  toggleColorPalette(event: Event): void {
    event.stopPropagation();
    this.showColorPalette.update(v => !v);
  }

  selectColor(color: CardColor, event: Event): void {
    event.stopPropagation();
    this.selectedColor.set(color);
    this.showColorPalette.set(false);
    const deployment = this.selectedDeployment();
    if (!deployment?.sourceId) return;
    this.selectedDeployment.set({ ...deployment, color });
    this.updateColorMutation.mutate({ sourceId: deployment.sourceId, color });
  }

  getColorClass(color: CardColor): string {
    const map: Record<string, string> = {
      blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500',
      yellow: 'bg-yellow-500', orange: 'bg-orange-500',
    };
    return map[color] ?? 'bg-base-300';
  }

  getIconColorClass(): string {
    const map: Record<string, string> = {
      blue: 'text-blue-500', green: 'text-green-500', red: 'text-red-500',
      yellow: 'text-yellow-500', orange: 'text-orange-500',
    };
    return map[this.selectedColor()] ?? 'text-base-content opacity-70';
  }

  toggleLivenessDropdown(event: Event): void {
    event.stopPropagation();
    this.showLivenessDropdown.update(v => !v);
  }

  selectLivenessType(type: string, event: Event): void {
    event.stopPropagation();
    this.showLivenessDropdown.set(false);
    const deployment = this.selectedDeployment();
    if (!deployment) return;
    this.selectedDeployment.set({ ...deployment, livenessStatus: type });
    this.updateLivenessMutation.mutate({ sourceId: deployment.sourceId, livenessType: type });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.showLivenessDropdown() && !target.closest('.liveness-dropdown-container')) {
      this.showLivenessDropdown.set(false);
    }
    if (this.showColorPalette() && !target.closest('.color-palette-container')) {
      this.showColorPalette.set(false);
    }
  }

  onSearch(query: string) {
    this.sources.searchSourceDeployments(query);
  }

  onSubmit() {
    console.log('Search submitted:', this.searchForm.value.search);
    this.sources.searchSourceDeployments(this.searchForm.value.search);
  }

}
