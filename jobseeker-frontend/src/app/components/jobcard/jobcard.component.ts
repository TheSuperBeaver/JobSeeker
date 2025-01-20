import { Component, Input } from '@angular/core';
import { JobPost } from '../../models/job.posts';
import { JobStatus } from '../../models/job.status';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

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

  handleReadMoreToggle(): void {
    this.expandedJobId = this.expandedJobId === this.job?.id ? undefined : this.job?.id;
  }


  updateJobStatus(id: string, status: JobStatus) {

  }
}