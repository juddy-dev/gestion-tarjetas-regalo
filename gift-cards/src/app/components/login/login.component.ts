import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alerts.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, LoaderComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading:boolean = false;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  submitted: boolean = false;

  constructor(
    private alertService: AlertService,
    private authService: AuthService, 
    private router: Router) {

    }

  async login() {
    this.submitted = true;
    if (this.emailControl.valid && this.passwordControl.valid) {
      this.isLoading = true;
      try {
        const email = this.emailControl.value ?? '';
        const pwd = this.passwordControl.value ?? '';
        await this.authService.signIn(email, pwd);
        this.router.navigate(['/dashboard']);
      } catch (error) {   
        console.log(error);     
        this.isLoading = false;
        this.emailControl.reset();
        this.passwordControl.reset();
        this.alertService.error('Tu usuario y/o contraseña no coinciden.', 2);
      }

    }
    
  }

}
