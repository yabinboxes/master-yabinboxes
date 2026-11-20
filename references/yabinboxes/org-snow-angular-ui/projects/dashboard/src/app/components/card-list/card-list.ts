import { CommonModule } from '@angular/common';
import { Component, computed, /* effect, inject, signal */ input, output } from '@angular/core';
import { Card } from '../card/card';
import { SourceDeployment } from '../../interfaces/model/source-deployment.interface';
// import { TabsApiTab } from '../../interfaces/api/api-tabs.interface';
// import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
// import { HandleTabs } from '../../services/handlers/handle-tabs';

@Component({
  selector: 'snow-card-list',
  imports: [CommonModule, Card, /* LucideAngularModule */],
  templateUrl: './card-list.html',
})
export class CardList {
  deployments = input.required<SourceDeployment[]>();
  cardSelected = output<SourceDeployment>();
  cardRemoved = output<SourceDeployment>();

  onCardTitleClick(card: SourceDeployment): void {
    this.cardSelected.emit(card);
  }

  onCardRemoved(card: SourceDeployment): void {
    this.cardRemoved.emit(card);
  }

  // TABS DISABLED — private tabsHandler = inject(HandleTabs);

  // readonly tabs = this.tabsHandler.tabs;
  // readonly tabsLoading = this.tabsHandler.tabsLoading;
  // readonly tabsError = this.tabsHandler.tabsError;
  // readonly activeTabId = signal<number>(0);
  // readonly defaultTabId = 0;
  // readonly editingTabId = signal<number | null>(null);
  // readonly editingTabName = signal<string>('');
  // readonly editIcon = Pencil;
  // readonly deleteIcon = Trash2;
  // readonly isDeleteDialogOpen = signal(false);
  // readonly deleteTabId = signal<number | null>(null);

  readonly filteredDeployments = computed(() => {
    // TABS DISABLED — previously filtered by activeTabId:
    // const activeTab = this.activeTabId();
    // return this.deployments().filter((item) => item.tabId === activeTab);
    return this.deployments();
  });

  // constructor() {
  //   // Keep active tab valid whenever the tabs list changes.
  //   effect(() => {
  //     const tabs = this.tabs();
  //     console.log('Tabs updated:', tabs);
  //     if (!tabs.some((tab) => tab.tabId === this.activeTabId())) {
  //       this.activeTabId.set(tabs[0]?.tabId);
  //     }
  //   });
  // }

  // setActiveTab(id: number): void {
  //   this.activeTabId.set(id);
  // }

  // async addTab(): Promise<void> {
  //   const nextName = `Tab ${this.tabs().length + 1}`;
  //   try {
  //     const createdTab = await this.tabsHandler.addTab(nextName);
  //     this.activeTabId.set(createdTab?.tabId ?? `tab-${Date.now()}`);
  //   } catch (error) {
  //     console.error('Failed to create tab:', error);
  //   }
  // }

  // async removeTab(id: number, event?: Event): Promise<void> {
  //   event?.stopPropagation();
  //   if (id === this.defaultTabId) return;
  //   const current = this.tabs();
  //   if (current.length <= 1) return;
  //   const remaining = current.filter((t) => t.tabId !== id);
  //   try {
  //     await this.tabsHandler.removeTab(id);
  //     if (this.activeTabId() === id) {
  //       this.activeTabId.set(remaining[0]?.tabId ?? this.defaultTabId);
  //     }
  //   } catch (error) {
  //     console.error('Failed to delete tab:', error);
  //   }
  // }

  // canRemoveTab(id: number): boolean {
  //   return id !== this.defaultTabId && this.tabs().length > 1;
  // }

  // startEditTab(tab: TabsApiTab, event: Event): void {
  //   event.stopPropagation();
  //   this.editingTabId.set(tab.tabId);
  //   this.editingTabName.set(tab.tabName);
  // }

  // onEditTabName(event: Event): void {
  //   const target = event.target as HTMLInputElement;
  //   this.editingTabName.set(target.value);
  // }

  // async saveEditTab(event?: Event): Promise<void> {
  //   event?.stopPropagation();
  //   const tabId = this.editingTabId();
  //   if (!tabId) return;
  //   const nextName = this.editingTabName().trim();
  //   if (!nextName) {
  //     this.cancelEditTab();
  //     return;
  //   }
  //   try {
  //     await this.tabsHandler.updateTab(tabId, nextName);
  //     this.editingTabId.set(null);
  //   } catch (error) {
  //     console.error('Failed to update tab:', error);
  //   }
  // }

  // cancelEditTab(event?: Event): void {
  //   event?.stopPropagation();
  //   this.editingTabId.set(null);
  // }

  // confirmDeleteTab(tab: TabsApiTab, event: Event): void {
  //   event.stopPropagation();
  //   this.deleteTabId.set(tab.tabId);
  //   this.isDeleteDialogOpen.set(true);
  // }

  // cancelDeleteTab(): void {
  //   this.isDeleteDialogOpen.set(false);
  //   this.deleteTabId.set(null);
  // }

  // proceedDeleteTab(): void {
  //   const tabId = this.deleteTabId();
  //   if (!tabId) {
  //     this.cancelDeleteTab();
  //     return;
  //   }
  //   this.removeTab(tabId);
  //   this.cancelDeleteTab();
  // }
}
