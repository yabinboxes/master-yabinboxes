import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TabsApiTab } from '../../interfaces/api/api-tabs.interface';
import { RuntimeConfig } from '../runtime-config';

@Injectable({
  providedIn: 'root',
})
export class TabsActionsApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(RuntimeConfig);
  private get baseUrl(): string {
    return this.config.url('tabs');
  }

  getTabs(): Observable<TabsApiTab[]> {
    return this.http.get<TabsApiTab[]>(this.baseUrl);
  }

  createTab(tabName: string): Observable<TabsApiTab> {
    return this.http.post<TabsApiTab>(this.baseUrl, { tabName });
  }

  updateTab(tabId: number, tabName: string): Observable<TabsApiTab> {
    return this.http.put<TabsApiTab>(`${this.baseUrl}/${tabId}`, { tabName });
  }

  deleteTab(tabId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tabId}`);
  }
}
