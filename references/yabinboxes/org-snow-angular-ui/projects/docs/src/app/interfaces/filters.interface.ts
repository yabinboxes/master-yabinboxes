export interface TypesForm {
  applications: boolean;
  services: boolean;
  cluster: boolean;
  civo: boolean;
  digitalocean: boolean;
  cloudflare: boolean;
  azure: boolean;
  aws: boolean;
  hetzner: boolean;
}

export type FilterGroup = 'Providers' | 'Types';

export interface FilterDefinition {
  key: keyof TypesForm;
  label: string;
  group: FilterGroup;
  enabled: boolean;
}
