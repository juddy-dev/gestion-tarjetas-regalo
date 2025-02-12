import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alerts.service';
import { confirmSignIn } from "aws-amplify/auth";


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);

  constructor(
    private alertService: AlertService,
    private authService: AuthService, 
    private router: Router) {}
/*
  async login() {
    if (this.emailControl.valid && this.passwordControl.valid) {
      try {
        const email = this.emailControl.value ?? '';
        const pwd = this.passwordControl.value ?? '';
        await this.authService.signIn(email, pwd);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.log(error);
        this.emailControl.reset();
        this.passwordControl.reset();
        this.alertService.error('Tu usuario y/o contraseña no coinciden.');
      }

    }
    
  }*/

    async login() {
        try {          
          const tokenSession = await this.authService.getTokenSession();
          console.log(tokenSession);
        } catch (error) {
          console.log(error);
        }
      
    }

}
