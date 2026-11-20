import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsMarkdown } from '../../components/docs-markdown/docs-markdown';
import { LucideAngularModule, Github, Gitlab, AppWindow, Container, Boxes, ExternalLink, Bookmark, Cloud} from 'lucide-angular';


@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, DocsMarkdown, RouterLink],
  templateUrl: './home.html'
})
export default class Home {

  readonly color = Bookmark; // default icon
  readonly github = Github;
  readonly gitlab = Gitlab;
  readonly app = AppWindow;         // application
  readonly container = Container;   // service
  readonly kluster = Boxes;         // kluster
  readonly link = ExternalLink;
  readonly cloud = Cloud;   

  markdownPath = computed(() => {
    return 'md/home/home.md';
  });

}
