import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ActiveUserGuard } from './core/guards/active-user.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent, canActivate: [ActiveUserGuard]},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
    
];
