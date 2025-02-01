import { Component, inject, OnInit } from '@angular/core';
import { JobQueriesService } from '../../services/job.queries.service';
import { JobQuery } from '../../models/jobs.queries';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { QueryDialogComponent } from '../../dialogs/query-dialog/query-dialog.component';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'queries-table',
  templateUrl: './queries-table.component.html',
  styleUrls: ['./queries-table.component.css'],
  imports: [CommonModule, MatTableModule, MatButtonModule]
})
export class QueriesTableComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  jobQueries: JobQuery[] = [];
  displayedColumns: string[] = ['searchTerm', 'town', 'queries', 'results', 'automatic_hour', 'filters', 'status', 'nb_jobs', 'actions'];
  loadingQueries: { [key: string]: boolean } = {};

  constructor(private dialog: MatDialog, private jobQueriesService: JobQueriesService) { }

  ngOnInit(): void {
    this.fetchQueries();
  }

  async fetchQueries(): Promise<void> {
    try {
      await this.jobQueriesService.loadJobQueries();
      this.jobQueries = this.jobQueriesService.jobQueries?.queries ?? [];
    } catch (error) {
      console.error('Failed to load job posts.', error);
    }
  }

  addQuery() {
    const dialogRef = this.dialog.open(QueryDialogComponent, {
      width: 'auto',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'custom-modal-container',
      data: { query: null },
    });

    dialogRef.afterClosed().subscribe((newQuery) => {
      if (newQuery) {
        this.jobQueriesService.addQuery(newQuery).subscribe(() => {
          console.log('Query added successfully');
          this.fetchQueries();
        });
      }
    });
  }

  modifyQuery(query: JobQuery) {
    const dialogRef = this.dialog.open(QueryDialogComponent, {
      width: 'auto',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'custom-modal-container',
      data: { query },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jobQueriesService.modifyQuery(query.id, result).subscribe(() => {
          console.log('Query modified successfully');
          this.fetchQueries();
        });
      }
    });
  }


  deleteQuery(query: JobQuery): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: "Are you sure you want to delete this query?" },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.jobQueriesService.deleteQuery(query.id).subscribe(() => {
          console.log('Query deleted successfully');
          this.fetchQueries();
        });
      }
    });
  }

  runQuery(query: JobQuery): void {
    this.loadingQueries[query.id] = true;
    this.jobQueriesService.runQuery(query.id).subscribe({
      next: (scrapeResponse) => {
        let message = "";
        message += `Google jobs : ${scrapeResponse.google_jobs_scraped} | `
        message += `Indeed jobs : ${scrapeResponse.indeed_jobs_scraped} | `
        message += `LinkedIn jobs : ${scrapeResponse.linkedin_jobs_scraped}`
        this._snackBar.open(message, "Close")
      },
      error: (err) => console.error('Error running query:', err),
      complete: () => {
        this.loadingQueries[query.id] = false;
        this.fetchQueries();
      }
    });
  }
}
