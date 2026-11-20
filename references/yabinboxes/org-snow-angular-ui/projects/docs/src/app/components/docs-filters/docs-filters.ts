import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { filters } from '../../data/filters-content-list';
import { FilterDefinition } from '../../interfaces/filters.interface';
import { HandleFilters } from '../../services/handle-filters';

@Component({
  selector: 'docs-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './docs-filters.html'
})
export class DocsFilters {
  sources = inject(HandleFilters);

  private fb = inject(FormBuilder);

  readonly filterGroups: { label: string; filters: FilterDefinition[] }[] = [
    ...filters.reduce((groups, filter) => {
      const items = groups.get(filter.group) ?? [];
      items.push(filter);
      groups.set(filter.group, items);
      return groups;
    }, new Map<string, FilterDefinition[]>()),
  ].map(([label, items]) => ({ label, filters: items }));

  typesForm: FormGroup = this.fb.group(
    Object.fromEntries(filters.map((filter) => [filter.key, [filter.enabled]])),
  );


  onChangeFilter() {
    // apply filters
    this.sources.setFilters(
      this.typesForm.value
    );
    /*this.sources.applyFilters(
      this.typesForm.value
    );*/
  }
 
}
