import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DocsMarkdown } from '../../components/docs-markdown/docs-markdown';
import { DocsPageHeader } from '../../components/docs-page-header/docs-page-header';

@Component({
  selector: 'app-snow-monkeys',
  imports: [DocsMarkdown, DocsPageHeader],
  templateUrl: './snow-monkeys.html',
})
export default class SnowMonkeys {
  mdFile = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['mdFile'] || '')),
  );

  readonly pageMeta = computed(() => {
    switch (this.mdFile()) {
      case 'intro':
        return {
          eyebrow: 'Snow Monkeys',
          title: 'Intro',
          lead: 'What Snow Monkeys is, how repositories are classified, and what the dashboard shows.',
        };
      case 'core':
        return {
          eyebrow: 'Snow Monkeys',
          title: 'Core components',
          lead: 'The main pieces of the platform and how they fit together.',
        };
      case 'start':
        return {
          eyebrow: 'Snow Monkeys',
          title: 'How to start',
          lead: 'First steps to get Snow Monkeys running.',
        };
      default:
        return {
          eyebrow: 'Snow Monkeys',
          title: 'Not found',
          lead: 'This documentation page does not exist.',
        };
    }
  });

  markdownPath = computed(() => {
    if (this.mdFile() === 'intro') {
      return 'md/snow-monkeys/intro.md';
    }
    if (this.mdFile() === 'start') {
      return 'md/snow-monkeys/how-to-start.md';
    }
    if (this.mdFile() === 'core') {
      return 'md/snow-monkeys/core-components.md';
    }
    return 'md/snow-monkeys/notfound.md';
  });
}
