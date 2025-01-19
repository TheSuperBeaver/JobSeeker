import { Component, Input } from '@angular/core';
import { JobPost } from '../../models/job.posts';
import { JobStatus } from '../../models/job.status';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'jobcard',
  imports: [CommonModule, MarkdownModule, HttpClientModule],
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.css'
})
export class JobcardComponent {
  @Input() job!: JobPost;  // Input the job data
  JobStatus = JobStatus;
  expandedJobId: number | undefined = undefined;

  // Property to hold the rendered markdown
  renderedDescription: string | Promise<String>;

  constructor() {
    this.renderedDescription = ''; // Initialize the rendered description
  }


  handleReadMoreToggle(jobId: number | undefined): void {
    this.expandedJobId = this.expandedJobId === jobId ? undefined : jobId;
  }


  updateJobStatus(id: string, status: JobStatus) {

  }
}