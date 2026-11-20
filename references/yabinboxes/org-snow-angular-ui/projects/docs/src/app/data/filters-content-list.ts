import { FilterDefinition, TypesForm } from '../interfaces/filters.interface';

export const filters: FilterDefinition[] = [
  { key: 'civo', label: 'Civo', group: 'Providers', enabled: true },
  { key: 'digitalocean', label: 'DigitalOcean', group: 'Providers', enabled: true },
  { key: 'cloudflare', label: 'Cloudflare', group: 'Providers', enabled: true },
  { key: 'azure', label: 'Azure', group: 'Providers', enabled: true },
  { key: 'aws', label: 'AWS', group: 'Providers', enabled: true },
  { key: 'hetzner', label: 'Hetzner', group: 'Providers', enabled: true },
  { key: 'applications', label: 'Applications', group: 'Types', enabled: true },
  { key: 'services', label: 'Services', group: 'Types', enabled: true },
  { key: 'cluster', label: 'Clusters', group: 'Types', enabled: true },
];

export function initialFilterState(definitions: FilterDefinition[] = filters): TypesForm {
  const state = {} as TypesForm;
  for (const filter of definitions) {
    state[filter.key] = filter.enabled;
  }
  return state;
}
