import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'session-expired-dialog',
  templateUrl: './session-expired-dialog.component.html',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions]
})
export class SessionExpiredDialogComponent {
  constructor(private dialogRef: MatDialogRef<SessionExpiredDialogComponent>) { }

  close(): void {
    this.dialogRef.close();
  }
}
