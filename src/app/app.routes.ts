import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddExpenseComponent } from './components/expenses/add-expense/add-expense.component';
import { ExpenseHistoryComponent } from './components/expenses/expense-history/expense-history.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AuthGuard } from './guards/auth.guard';


export const routes: Routes =  [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'add-expense', component: AddExpenseComponent, canActivate: [AuthGuard] },
  { path: 'expense-summary', component: ExpenseHistoryComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];


    @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule],
      })
      export class AppRoutingModule {}