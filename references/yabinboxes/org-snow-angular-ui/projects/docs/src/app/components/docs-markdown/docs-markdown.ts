import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

export interface DocsTocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

@Component({
  selector: 'docs-markdown',
  imports: [MarkdownModule],
  templateUrl: './docs-markdown.html',
})
export class DocsMarkdown {
  readonly src = input.required<string>();
  /** Sticky in-page TOC (h2/h3). Disable for short embeds like the home blurb. */
  readonly showToc = input(true);
  /** Hide the first markdown h1 when the page already shows docs-page-header. */
  readonly skipFirstH1 = input(false);

  readonly toc = signal<DocsTocItem[]>([]);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      this.host.nativeElement.addEventListener(
        'click',
        (event: Event) => this.onContentClick(event as MouseEvent),
        true,
      );
    });
  }

  onReady(): void {
    if (!this.isBrowser) {
      return;
    }

    const root = this.host.nativeElement;
    this.bindHeadingIds(root);
    this.hideFirstH1(root);
    this.decorateCodeBlocks(root);
    this.toc.set(this.collectToc(root));
    this.scrollToFragment();
  }

  private hideFirstH1(root: HTMLElement): void {
    if (!this.skipFirstH1()) {
      return;
    }
    const first = root.querySelector('article.docs-article h1, .docs-article h1, h1');
    if (first instanceof HTMLElement) {
      first.classList.add('sr-only');
    }
  }

  onTocClick(event: MouseEvent, id: string): void {
    event.preventDefault();
    const target = this.findTarget(id);
    if (target) {
      this.scrollToTarget(target, id);
    }
  }

  onContentClick(event: MouseEvent): void {
    if (!this.isBrowser) {
      return;
    }

    const anchor = (event.target as HTMLElement | null)?.closest('a');
    const href = anchor?.getAttribute('href');
    if (!href) {
      return;
    }

    const id = this.inPageFragment(href);
    if (!id) {
      return;
    }

    const target = this.findTarget(id);
    if (!target) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.scrollToTarget(target, id);
  }

  private scrollToFragment(): void {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!id) {
      return;
    }

    const target = this.findTarget(id);
    if (target) {
      this.scrollToTarget(target, id);
    }
  }

  private bindHeadingIds(root: HTMLElement): void {
    const used = new Set<string>();

    root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      const el = heading as HTMLElement;
      const base = el.id || this.slugify(el.textContent ?? '');
      if (!base) {
        return;
      }

      let id = base;
      let suffix = 1;
      while (used.has(id)) {
        id = `${base}-${suffix++}`;
      }

      el.id = id;
      used.add(id);
    });
  }

  private collectToc(root: HTMLElement): DocsTocItem[] {
    if (!this.showToc()) {
      return [];
    }

    const items: DocsTocItem[] = [];
    root.querySelectorAll('h2, h3').forEach((heading) => {
      const el = heading as HTMLElement;
      if (!el.id) {
        return;
      }
      const level = el.tagName === 'H2' ? 2 : 3;
      const text = (el.textContent ?? '').trim();
      if (!text) {
        return;
      }
      items.push({ id: el.id, text, level });
    });
    return items;
  }

  private decorateCodeBlocks(root: HTMLElement): void {
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.parentElement?.classList.contains('docs-code-window')) {
        return;
      }

      const frame = document.createElement('div');
      frame.className = 'docs-code-window not-prose';

      const bar = document.createElement('div');
      bar.className = 'docs-code-window__bar';
      bar.setAttribute('aria-hidden', 'true');
      bar.innerHTML =
        '<span class="docs-code-window__dot"></span>' +
        '<span class="docs-code-window__dot"></span>' +
        '<span class="docs-code-window__dot"></span>' +
        '<span class="docs-code-window__title">code</span>';

      const parent = pre.parentNode;
      if (!parent) {
        return;
      }
      parent.insertBefore(frame, pre);
      frame.appendChild(bar);
      frame.appendChild(pre);
    });
  }

  private inPageFragment(href: string): string | null {
    const hashIndex = href.lastIndexOf('#');
    if (hashIndex === -1 || hashIndex === href.length - 1) {
      return null;
    }

    const path = href.slice(0, hashIndex);
    const samePage = path === '' || path === window.location.pathname;
    if (!samePage) {
      return null;
    }

    return decodeURIComponent(href.slice(hashIndex + 1));
  }

  private findTarget(id: string): HTMLElement | null {
    const byId = this.host.nativeElement.querySelector(`#${CSS.escape(id)}`);
    if (byId instanceof HTMLElement) {
      return byId;
    }

    const headings = this.host.nativeElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const heading of headings) {
      if (this.slugify(heading.textContent ?? '') === id) {
        return heading as HTMLElement;
      }
    }

    return null;
  }

  private scrollToTarget(target: HTMLElement, id: string): void {
    history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${id}`,
    );

    requestAnimationFrame(() => {
      const pane = document.getElementById('docs-scroll');
      if (pane) {
        const top =
          target.getBoundingClientRect().top -
          pane.getBoundingClientRect().top +
          pane.scrollTop -
          16;
        pane.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        return;
      }

      target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/<[^>]*>/g, '')
      .replace(/&[a-z0-9#]+;/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
