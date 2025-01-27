import { Routes } from '@angular/router';
import { JobsComponent } from './pages/jobs/jobs.page';
import { QueriesComponent } from './pages/queries/queries.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard] },
  { path: 'queries', component: QueriesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
];
