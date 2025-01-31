import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideMarkdown } from 'ngx-markdown';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './app/auth.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from 'ngx-material-date-fns-adapter';
import { be } from 'date-fns/locale';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideMarkdown(),
    provideAnimations(),
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: be }
  ],
}).catch((err) => console.error(err));
