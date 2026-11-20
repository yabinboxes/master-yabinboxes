import { Component, input } from '@angular/core';
import { ModulesItem } from '../../interfaces/source-deployment.interface';
import { LucideAngularModule, Github, Gitlab, AppWindow, Container, Boxes, ExternalLink } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-module-card',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './module-card.html',
  host: { class: 'block h-full' }
})
export class ModuleCard {

  itemCard = input.required<any>();

  readonly github = Github;
  readonly gitlab = Gitlab;
  readonly app = AppWindow;         // application
  readonly container = Container;   // service
  readonly kluster = Boxes;         // kluster
  readonly link = ExternalLink;

  pageRoute(page: string): string {
    const segments = page.split('/').filter(Boolean);
    return '/docs/provider/' + segments.slice(2).join('/');
  }

  providerIcon(provider: string): string {
    const icons: Record<string, string> = {
      snow: 'icons/snow.svg',
      digitalocean: 'icons/digitalocean.svg',
      docker: 'icons/docker.svg',
      civo: 'icons/civo.svg',
      cloudflare: 'icons/cloudflare.svg',
      hetzner: 'icons/hetzner.svg',
    };
    return icons[provider] ?? 'icons/snow.png';
  }

}
