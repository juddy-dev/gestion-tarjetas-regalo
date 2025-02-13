import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alerts.service';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

const DASHBOARD = '/dashboard';
const TRANSACTIONS = '/transactions';

@Component({
  selector: 'app-header',
  imports: [LoaderComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  title: string = '';
  isLoading:boolean = false;
  isDashboard = false;
  isTransactions = false;

  constructor(
    private alertService: AlertService,
    private authService: AuthService, 
    private router: Router) {
      switch(this.router.url){
        case DASHBOARD:
          this.title = 'Panel de tarjetas';
          this.isTransactions = false;
          this.isDashboard = true;
          break;
        case TRANSACTIONS:
          this.title = 'Transacciones por tarjeta';
          this.isTransactions = true;
          this.isDashboard = false;
          break;
      }

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

    goToDahsboard() {
      this.router.navigate(['/dashboard']);
    }

    goToTransactions() {
      this.router.navigate(['/transactions']);
    }

}
