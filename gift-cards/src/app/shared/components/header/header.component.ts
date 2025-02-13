import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alerts.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  title: string = '';

  constructor(
    private alertService: AlertService,
    private authService: AuthService, 
    private router: Router) {
      this.title = this.router.url.replace('/', '');
    }

    async logout() {
      try {
        await this.authService.signOut();
        this.router.navigate(['/login']);
      }catch (error) {
        this.alertService.error('Tuvimos un problema, vuelve a intentar más tarde.');

      }
    }

}
