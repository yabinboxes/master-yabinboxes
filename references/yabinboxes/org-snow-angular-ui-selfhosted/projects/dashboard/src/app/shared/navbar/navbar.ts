import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardAuth } from '../../services/auth/dashboard-auth';
import { HandleProfiles } from '../../services/handlers/handle-profiles';

@Component({
  selector: 'snow-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  encapsulation: ViewEncapsulation.None

})
export class Navbar {
  protected authService = inject(DashboardAuth);
  protected profilesService = inject(HandleProfiles);

  logout() {
    this.authService.signOut().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
