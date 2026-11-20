import { computed, inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { TabsApiTab } from '../../interfaces/api/api-tabs.interface';
import { TabsActionsApi } from '../actions-api/tabs-actions.api';

@Injectable({
  providedIn: 'root',
})
export class HandleTabs {
  private readonly tabsApi = inject(TabsActionsApi);

  private readonly tabsQuery = injectQuery(() => ({
    queryKey: ['tabs'],
    queryFn: () => lastValueFrom(this.tabsApi.getTabs()),
  }));

  readonly tabs = computed<TabsApiTab[]>(() => {
    const data = this.tabsQuery.data();
    return Array.isArray(data) && data.length ? data : [];
  });

  /** Loading state for tabs query (use in templates: tabsLoading()). */
  readonly tabsLoading = computed(() => this.tabsQuery.isPending());
  /** Error from tabs query (use in templates: tabsError()). */
  readonly tabsError = computed(() => this.tabsQuery.error());

  async addTab(tabName: string): Promise<TabsApiTab> {
    const result = await lastValueFrom(this.tabsApi.createTab(tabName));
    await this.tabsQuery.refetch();
    return result;
  }

  async removeTab(tabId: number): Promise<void> {
    await lastValueFrom(this.tabsApi.deleteTab(tabId));
    await this.tabsQuery.refetch();
  }

  async updateTab(tabId: number, tabName: string): Promise<TabsApiTab> {
    const result = await lastValueFrom(this.tabsApi.updateTab(tabId, tabName));
    await this.tabsQuery.refetch();
    return result;
  }
}
