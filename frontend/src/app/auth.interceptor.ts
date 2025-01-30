import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessionExpiredDialogComponent } from './dialogs/session-expired-dialog/session-expired-dialog.component';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(MatDialog);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const dialogRef = dialog.open(SessionExpiredDialogComponent, {
          width: '400px',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('tokenExpiration');
          router.navigate(['/login']);
        });
      }
      return throwError(() => error);
    })
  );
};
