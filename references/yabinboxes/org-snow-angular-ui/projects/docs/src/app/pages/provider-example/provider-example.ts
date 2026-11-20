import { Component, computed, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocsMarkdown } from '../../components/docs-markdown/docs-markdown';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'docs-provider-example',
  imports: [DocsMarkdown],
  templateUrl: './provider-example.html',
})
export default class ProviderExample {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap);
  private readonly query = toSignal(this.route.queryParamMap);

  readonly exampleFile = computed(() => {
    const fromQuery = this.query()?.get('file');
    if (fromQuery) return fromQuery;
    const file = this.params()?.get('exampleFile');
    if (file) return file;
    return 'README.md';
  });

  readonly provider = computed(() => this.params()?.get('provider') ?? '');

  readonly assetPath = computed(() => {
    const provider = this.provider();
    const file = this.exampleFile();
    if (!provider || !file) return '';
    return `/md/providers/${provider}/examples/${file}`;
  });

  readonly docsPath = computed(() => {
    const provider = this.provider();
    const file = this.exampleFile();
    if (!provider || !file || file === 'README.md') {
      return provider ? `/docs/provider/${provider}/examples` : '';
    }
    return `/docs/provider/${provider}/examples?file=${encodeURIComponent(file)}`;
  });

  readonly isMarkdown = computed(() => this.exampleFile().toLowerCase().endsWith('.md'));

  readonly rawContent = signal('');
  readonly loadError = signal(false);

  constructor() {
    effect(() => {
      const path = this.assetPath();
      if (!path || this.isMarkdown()) {
        this.rawContent.set('');
        this.loadError.set(false);
        return;
      }

      this.http.get(path, { responseType: 'text' }).subscribe({
        next: (content) => {
          this.rawContent.set(content);
          this.loadError.set(false);
        },
        error: () => {
          this.rawContent.set('');
          this.loadError.set(true);
        },
      });
    });
  }

  readonly language = computed(() => {
    const file = this.exampleFile().toLowerCase();
    if (file.endsWith('.yml') || file.endsWith('.yaml')) return 'yaml';
    if (file.endsWith('.sh')) return 'bash';
    if (file.endsWith('.sql')) return 'sql';
    if (file.endsWith('.conf')) return 'nginx';
    return 'text';
  });
}
