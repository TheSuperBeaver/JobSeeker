import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { JobPost } from '../../models/job.posts';
import { JobStatus } from '../../models/job.status';
import { JobsService } from '../../services/jobs.service';
import { JobDialogData } from '../../models/job.dialog.data';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'job-details-dialog',
  templateUrl: './job-details-dialog.component.html',
  styleUrls: ['./job-details-dialog.component.css'],
  imports: [MatDialogActions, MatDialogContent, MarkdownModule, MatDialogClose]
})
export class JobDetailsDialogComponent {
  JobStatus = JobStatus;
  job: JobPost;
  position: { top: number; left: number; width: number; height: number };

  constructor(@Inject(MAT_DIALOG_DATA) public data: JobDialogData, public jobsService: JobsService) {
    this.job = data.job;
    this.position = data.position;
  }

  ngOnInit(): void {
    this.position = this.data.position || { top: 0, left: 0, width: 0, height: 0 };
  }

  updateJobStatus(status: JobStatus): void {
    if (this.data?.job.id) {
      this.jobsService.updateJobStatus(this.data.job.id, status).then(
        () => {
          this.data.job.status = status;
        },
        (error) => {
          console.error('Error updating job status:', error);
        }
      );
    }
  }
}
