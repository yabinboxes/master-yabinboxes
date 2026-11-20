import { Component, computed, ElementRef, input, output, viewChild } from '@angular/core';
import { LucideAngularModule, Github, Gitlab, AppWindow, Container, Boxes, ExternalLink, CircleCheck, CircleAlert, X } from 'lucide-angular';
import { SourceDeployment } from '../../interfaces/model/source-deployment.interface';
import { TruncatePipe } from '../../shared/truncate/truncate-pipe';
import { LowerCasePipe, NgClass } from '@angular/common';

@Component({
  selector: 'snow-card',
  imports: [LucideAngularModule, TruncatePipe, LowerCasePipe, NgClass],
  templateUrl: './card.html'
})
export class Card {
  itemCard = input.required<SourceDeployment>();
  modalId = input.required<number>();
  titleClick = output<SourceDeployment>();
  removed = output<SourceDeployment>();

  // # 1
  value = computed(() => this.itemCard());

  // COLOR PICKER MOVED TO sources.ts — readonly color = Paintbrush;
  readonly github = Github;
  readonly gitlab = Gitlab;
  readonly app = AppWindow;         // application
  readonly container = Container;   // service
  readonly kluster = Boxes;         // kluster
  readonly link = ExternalLink;     // external link
  readonly circleCheck = CircleCheck;
  readonly circleAlert = CircleAlert;
  readonly closeIcon = X;
  private readonly confirmDialog = viewChild.required<ElementRef<HTMLDialogElement>>('confirmDialog');

  constructor() {

    /*afterNextRender(() => {
      const intervalMs = Number(this.value().healthCheckTime ?? 30000);
      console.log('Setting up liveness check with interval:', intervalMs);
      interval(intervalMs)
        .pipe(
          switchMap(() =>
            this.http.get('/liveness-test', { responseType: 'text' }).pipe(
              catchError(() => of('unknown'))
            )
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((result: string) => {
          const normalized = result.trim().toLowerCase();
          if (normalized === 'active' || normalized === 'not-deployable') {
            this.liveness.set(normalized);
          }
        });
    });*/
  }
// # 1
//cardTitle = computed(() => this.itemCard.sourceName);


onTitleClick(): void {
  this.titleClick.emit(this.value());
}

onRemove(event: Event): void {
  event.stopPropagation();
  this.confirmDialog().nativeElement.showModal();
}

confirmRemove(): void {
  this.confirmDialog().nativeElement.close();
  this.removed.emit(this.value());
}

cancelRemove(): void {
  this.confirmDialog().nativeElement.close();
}

openModal(id: number) {
  console.log('Opening modal with id:', id);
  const dialog = document.getElementById(`modal_${id}`) as HTMLDialogElement | null;
  if (dialog) dialog.showModal();
}

// COLOR PICKER MOVED TO sources.ts
// toggleColorPalette(event: Event) { ... }
// selectColor(color: CardColor, event: Event) { ... }


// LIVENESS MOVED TO sources.ts
// toggleLivenessDropdown(event: Event) {
//   event.stopPropagation();
//   this.showLivenessDropdown.update(v => !v);
// }

// selectLivenessType(type: string, event: Event) {
//   event.stopPropagation();
//   this.liveness.set(type);
//   this.showLivenessDropdown.set(false);
//   const sourceId = this.value().sourceId;
//   if (sourceId) {
//     this.updateLivenessMutation.mutate({ sourceId, livenessType: type });
//   }
// }

// COLOR PICKER + LIVENESS MOVED TO sources.ts — HostListener no longer needed here
// @HostListener('document:click', ['$event'])
// onDocumentClick(event: Event) { ... }

// COLOR PICKER MOVED TO sources.ts — getColorClass() and getIconColorClass() removed

formatShortDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If date parsing fails, try to parse as ISO string or return original
      return dateString;
    }

    // Format as short date: MM/DD/YYYY or DD/MM/YYYY depending on locale
    // Using US format: MM/DD/YYYY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (error) {
    return dateString;
  }
}

  private normalizeHealthCheckUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `http://${trimmed}`;
}

}
