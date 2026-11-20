import { Component, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface DocsNavItem {
  label: string;
  path: string;
}

export interface DocsNavSection {
  num: string;
  title: string;
  items: DocsNavItem[];
}

@Component({
  selector: 'docs-left-menu',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './left-menu.html',
})
export class LeftMenu {
  /** Emitted when a nav link is activated (used to close the mobile drawer). */
  readonly navigated = output<void>();

  readonly search = signal('');

  readonly sections: DocsNavSection[] = [
    {
      num: '01',
      title: 'GUIDE',
      items: [
        { label: 'Overview', path: '/docs/overview' },
        { label: 'Modules', path: '/docs/modules' },
      ],
    },
    {
      num: '02',
      title: 'SNOW MONKEYS',
      items: [
        { label: 'Intro SnowMonkeys', path: '/docs/snow-monkeys/intro' },
        { label: 'Core Components', path: '/docs/snow-monkeys/core' },
      ],
    },
    {
      num: '03',
      title: 'GET STARTED',
      items: [{ label: 'Web', path: '/docs/get-started/web' }],
    },
  ];

  readonly filteredSections = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) {
      return this.sections;
    }
    return this.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0);
  });

  onSearchInput(value: string): void {
    this.search.set(value);
  }

  onNavigate(): void {
    this.navigated.emit();
  }
}
