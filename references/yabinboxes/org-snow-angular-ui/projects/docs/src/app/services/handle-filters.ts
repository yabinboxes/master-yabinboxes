import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { initialFilterState } from '../data/filters-content-list';
import { TypesForm } from '../interfaces/filters.interface';



@Injectable({
  providedIn: 'root',
})
export class HandleFilters {

  //sourceDeployments = signal<SourceDeployment[]>([]);
  countBooleanFilter = signal(6);
  sourceDeploymentLoading = signal(true);
  filters = signal<TypesForm>(initialFilterState());
  

  constructor() {
    // this.loadSourceDeployments();
  }

  

  setFilters(filters: TypesForm) {
    this.filters.set(filters);
  }



  
  
}
