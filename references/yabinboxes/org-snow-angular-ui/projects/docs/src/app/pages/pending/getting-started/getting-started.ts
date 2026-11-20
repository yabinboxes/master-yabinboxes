import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DocsMarkdown } from '../../../components/docs-markdown/docs-markdown';

@Component({
  selector: 'app-getting-started',
  imports: [DocsMarkdown],
  templateUrl: './getting-started.html'
})
export default class GettingStarted {
  /*private route = inject(ActivatedRoute);

  mdFile = toSignal(
    this.route.params.pipe(map((params) => params['mdFile'] || ''))
  );*/

  markdownPath = computed(() => {
    return 'md/getting-started/intro-snowmonkeys.md';
  });
}


