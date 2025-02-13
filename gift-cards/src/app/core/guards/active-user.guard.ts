import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class ActiveUserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean>  {
    try {
      await this.authService.getCurrentUser();
      this.router.navigate(['/dashboard']);
      return false;
    } catch {
      return true;
    }
  }
}
