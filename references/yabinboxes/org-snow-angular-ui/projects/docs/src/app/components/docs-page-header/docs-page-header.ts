import { Component, input } from '@angular/core';

@Component({
  selector: 'docs-page-header',
  templateUrl: './docs-page-header.html',
})
export class DocsPageHeader {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>('');
}
