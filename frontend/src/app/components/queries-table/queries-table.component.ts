import { Component, OnInit } from '@angular/core';
import { JobQueriesService } from '../../services/job.queries.service';
import { JobQuery } from '../../models/jobs.queries';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { QueryModalComponent } from '../query-modal/query-modal.component';

@Component({
  selector: 'queries-table',
  templateUrl: './queries-table.component.html',
  styleUrls: ['./queries-table.component.css'],
  imports: [CommonModule, MatTableModule, MatButtonModule]
})
export class QueriesTableComponent implements OnInit {
  jobQueries: JobQuery[] = [];
  displayedColumns: string[] = ['searchTerm', 'town', 'queries', 'results', 'automatic_hour', 'filters', 'status', 'nb_jobs', 'actions'];
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
    const dialogRef = this.dialog.open(QueryModalComponent, {
      width: '500px',
      data: { query: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jobQueriesService.addQuery(result).subscribe(() => {
          console.log('Query added successfully');
          // Reload your table data
        });
      }
    });
  }

  modifyQuery(query: JobQuery) {
    const dialogRef = this.dialog.open(QueryModalComponent, {
      width: '500px',
      data: { query },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jobQueriesService.modifyQuery(query.id, result).subscribe(() => {
          console.log('Query modified successfully');
          // Reload your table data
        });
      }
    });
  }


  deleteQuery(): void {

  }

  runQuery(): void {

  }
}
