import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DocsMarkdown } from '../../components/docs-markdown/docs-markdown';
import { DocsPageHeader } from '../../components/docs-page-header/docs-page-header';

@Component({
  selector: 'docs-provider',
  imports: [DocsMarkdown, DocsPageHeader],
  templateUrl: './provider.html',
})
export default class Provider {
  private params = toSignal(inject(ActivatedRoute).params);

  readonly pageMeta = computed(() => {
    const provider = String(this.params()?.['provider'] ?? '');
    const mdFile = String(this.params()?.['mdFile'] ?? '');
    const providerLabel = provider
      ? provider.charAt(0).toUpperCase() + provider.slice(1)
      : 'Provider';
    const fileLabel = mdFile
      ? mdFile
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Docs';

    return {
      eyebrow: providerLabel,
      title: fileLabel,
      lead: `Provider docs for ${providerLabel}.`,
    };
  });

  markdownPath = computed(() => {
    const provider = this.params()?.['provider'];
    const mdFile = this.params()?.['mdFile'];
    if (!provider || !mdFile) return '';
    return `md/providers/${provider}/${mdFile}.md`;
  });
}
