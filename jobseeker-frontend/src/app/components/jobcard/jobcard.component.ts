import { Component, Input } from '@angular/core';
import { JobPost } from '../../models/job.posts';
import { JobStatus } from '../../models/job.status';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { JobsService } from '../../services/jobs.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { JobDetailsDialogComponent } from '../job-details-dialog/job-details-dialog.component';

@Component({
  selector: 'jobcard',
  imports: [CommonModule, MarkdownModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.css'
})
export class JobcardComponent {
  @Input() job!: JobPost;
  JobStatus = JobStatus;
  expandedJobId: number | undefined = undefined;
  isExpanded = false;

  constructor(private jobsService: JobsService, private dialog: MatDialog) { }

  handleReadMoreToggle(): void {
    this.expandedJobId = this.expandedJobId === this.job?.id ? undefined : this.job?.id;
  }

  updateJobStatus(status: JobStatus) {
    if (this.job?.id) {
      this.jobsService.updateJobStatus(this.job.id, status).then(
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

  openCard(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const rect = target.closest('.job-card')?.getBoundingClientRect();
    if (rect) {
      if (this.job.status == JobStatus.New) {
        this.updateJobStatus(JobStatus.Viewed);
      }

      this.dialog.open(JobDetailsDialogComponent, {
        data: {
          job: this.job
        },
        panelClass: 'dialog-container',
        enterAnimationDuration: '150ms'
      });
    }
  }

  toggleCardState(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleDescription(event: MouseEvent): void {
    this.isExpanded = !this.isExpanded;
    event.stopPropagation();
  }

  getStatusText(): string {
    return this.job.status || 'Unknown';
  }

  getBadgeClass(): string {
    switch (this.getStatusText()) {
      case 'new':
        return 'badge-new';
      case 'hidden':
        return 'badge-hidden';
      case 'viewed':
        return 'badge-viewed';
      case 'starred':
        return 'badge-starred';
      default:
        return '';
    }
  }

  getStatusIcon(): string {
    switch (this.getStatusText()) {
      case 'new':
        return 'fas fa-plus-circle';
      case 'hidden':
        return 'fas fa-eye-slash';
      case 'viewed':
        return 'fas fa-eye';
      case 'starred':
        return 'fas fa-star';
      default:
        return '';
    }
  }
}