import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DocsMarkdown } from '../../components/docs-markdown/docs-markdown';
import { DocsPageHeader } from '../../components/docs-page-header/docs-page-header';

@Component({
  selector: 'app-get-started',
  imports: [DocsMarkdown, DocsPageHeader],
  templateUrl: './get-started.html',
})
export default class GetStarted {
  mdFile = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['mdFile'] || '')),
  );

  readonly pageMeta = computed(() => {
    switch (this.mdFile()) {
      case 'web':
        return {
          eyebrow: 'Get Started',
          title: 'Web',
          lead: 'Use the hosted Snow Monkeys dashboard in the browser with GitHub sign-in.',
        };
      case 'local':
        return {
          eyebrow: 'Get Started',
          title: 'Local',
          lead: 'Run and configure Snow Monkeys on your own machine.',
        };
      default:
        return {
          eyebrow: 'Get Started',
          title: 'Not found',
          lead: 'This documentation page does not exist.',
        };
    }
  });

  markdownPath = computed(() => {
    if (this.mdFile() === 'local') {
      return 'md/get-started/local.md';
    }
    if (this.mdFile() === 'web') {
      return 'md/get-started/web.md';
    }
    return 'md/notfound.md';
  });
}
