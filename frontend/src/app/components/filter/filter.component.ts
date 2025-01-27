import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { JobStatus } from '../../models/job.status';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'job-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MarkdownModule, MatButtonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class JobFilterComponent {
  readonly jobStatusList = [
    { value: JobStatus.New, label: 'New', icon: 'fas fa-plus-circle', style: 'badge-new' },
    { value: JobStatus.Viewed, label: 'Viewed', icon: 'fas fa-eye', style: 'badge-viewed' },
    { value: JobStatus.Starred, label: 'Starred', icon: 'fas fa-star', style: 'badge-starred' },
    { value: JobStatus.Hidden, label: 'Hidden', icon: 'fas fa-eye-slash', style: 'badge-hidden' },
  ];

  @Output() jobStatusChange = new EventEmitter<string[]>();

  jobStatuses = new FormControl<string[]>(['New', 'Viewed', 'Starred']);

  onStatusChange(): void {
    this.jobStatusChange.emit(this.jobStatuses.value || []);
  }
}
