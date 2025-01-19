import { Routes } from '@angular/router';
import { JobsComponent } from './pages/jobs/jobs.page';
import { QueriesComponent } from './pages/queries/queries.component';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/:status', component: JobsComponent },
  { path: 'queries', component: QueriesComponent },
];
