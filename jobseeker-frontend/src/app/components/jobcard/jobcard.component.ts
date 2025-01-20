import { Component, Input } from '@angular/core';
import { JobPost } from '../../models/job.posts';
import { JobStatus } from '../../models/job.status';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'jobcard',
  imports: [CommonModule, MarkdownModule],
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.css'
})
export class JobcardComponent {
  @Input() job!: JobPost;
  JobStatus = JobStatus;
  expandedJobId: number | undefined = undefined;

  constructor(private jobsService: JobsService) {}

  handleReadMoreToggle(): void {
    this.expandedJobId = this.expandedJobId === this.job?.id ? undefined : this.job?.id;
  }


  updateJobStatus(status: JobStatus) {
    if (this.job?.id) {
      this.jobsService.updateJobStatus(this.job.id, status.toString().toLocaleLowerCase()).then(
        (response) => {
          console.log('Job status updated successfully:', response);
          this.job.status = status;
        },
        (error) => {
          console.error('Error updating job status:', error);
        }
      );
    }
  }
}