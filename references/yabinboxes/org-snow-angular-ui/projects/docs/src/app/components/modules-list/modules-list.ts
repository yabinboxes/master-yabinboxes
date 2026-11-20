import { Component, computed, inject } from '@angular/core';
import { ModuleCard } from '../module-card/module-card';
import { modules } from "../../data/modules-content-list";
import { HandleFilters } from '../../services/handle-filters';
import { TypesForm } from '../../interfaces/filters.interface';

@Component({
  selector: 'docs-modules-list',
  imports: [ModuleCard],
  templateUrl: './modules-list.html'
})
export class ModulesList {
  private readonly filtersSource = inject(HandleFilters);

  modules = computed(() => {
    const filters = this.filtersSource.filters();
    const isFilterKey = (key: string): key is keyof TypesForm =>
      key in filters;

    return modules.filter((card) => {
      const typeKey =
        card.type === 'application'
          ? 'applications'
          : card.type === 'service'
            ? 'services'
            : card.type;
      const typeAllowed = isFilterKey(typeKey) ? filters[typeKey] : true;

      const providerKey = card.provider ?? '';
      const providerAllowed = isFilterKey(providerKey)
        ? filters[providerKey]
        : true;

      return typeAllowed && providerAllowed;
    });
  });
}
