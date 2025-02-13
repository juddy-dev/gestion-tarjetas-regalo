import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alerts.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-header',
  imports: [LoaderComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  title: string = '';
  isLoading:boolean = false;

  constructor(
    private alertService: AlertService,
    private authService: AuthService, 
    private router: Router) {
      this.title = this.router.url.replace('/', '');
    }

    async logout() {
      try {
        this.isLoading = true;
        await this.authService.signOut();
        this.router.navigate(['/']);
      }catch (error) {
        this.isLoading = false;
        this.alertService.error('Tuvimos un problema, vuelve a intentar más tarde.', 3);
      }
    }

}
