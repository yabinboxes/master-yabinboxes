import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Github, Gitlab, AppWindow, Container, Boxes, ExternalLink, Bookmark, Cloud} from 'lucide-angular';

@Component({
  selector: 'app-landing',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './landing.html'
})
export default class Landing {

  readonly color = Bookmark; // default icon
  readonly github = Github;
  readonly gitlab = Gitlab;
  readonly app = AppWindow;         // application
  readonly container = Container;   // service
  readonly kluster = Boxes;         // kluster
  readonly link = ExternalLink;
  readonly cloud = Cloud;           // civo icon

}
