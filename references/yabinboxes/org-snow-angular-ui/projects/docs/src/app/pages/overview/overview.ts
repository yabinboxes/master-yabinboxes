import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, BookOpen, Rocket } from 'lucide-angular';
import { DocsMarkdown } from '../../components/docs-markdown/docs-markdown';
import { DocsPageHeader } from '../../components/docs-page-header/docs-page-header';

@Component({
  selector: 'app-overview',
  imports: [DocsMarkdown, DocsPageHeader, RouterLink, LucideAngularModule],
  templateUrl: './overview.html',
})
export default class Overview {
  readonly book = BookOpen;
  readonly rocket = Rocket;

  markdownPath = computed(() => 'md/overview/overview.md');
}
