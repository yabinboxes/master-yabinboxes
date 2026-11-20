import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LeftMenu } from '../../shared/left-menu/left-menu';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, LeftMenu],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export default class Dashboard {
  readonly navOpen = signal(false);

  openNav(): void {
    this.navOpen.set(true);
  }

  closeNav(): void {
    this.navOpen.set(false);
  }

  toggleNav(): void {
    this.navOpen.update((open) => !open);
  }
}
