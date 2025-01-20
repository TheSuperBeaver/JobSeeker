import { Component, Input, SimpleChanges } from '@angular/core';
import { JobsService } from '../../services/jobs.service';
import { JobPost } from '../../models/job.posts';
import { CommonModule } from '@angular/common';
import { JobStatus } from '../../models/job.status';
import { JobFilterComponent } from '../filter/filter.component';
import { JobcardComponent } from '../jobcard/jobcard.component';

@Component({
  selector: 'app-joblist',
  imports: [CommonModule, JobFilterComponent, JobcardComponent],
  templateUrl: './joblist.component.html',
  styleUrl: './joblist.component.css'
})
export class JoblistComponent {

  @Input() jobStatus: string | undefined;
  jobPosts: JobPost[] = [];

  JobStatus = JobStatus;
  allJobsCount: number = 0;
  newJobsCount: number = 0;
  viewedJobsCount: number = 0;
  starredJobsCount: number = 0;
  hiddenJobsCount: number = 0;


  constructor(private jobsService: JobsService) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobStatus']) {
      console.log("jobStatus changed to: ", this.jobStatus);
      this.loadJobs();
    }
  }

  async loadJobs(): Promise<void> {
    this.jobPosts = [];
    try {
      console.log("loading job, job status = " + this.jobStatus);
      await this.jobsService.loadJobs(this.jobStatus);
      this.jobPosts = this.jobsService.jobs;
      this.allJobsCount = this.jobsService.allJobsCount;
      this.newJobsCount = this.jobsService.newJobsCount;
      this.viewedJobsCount = this.jobsService.viewedJobsCount;
      this.starredJobsCount = this.jobsService.starredJobsCount;
      this.hiddenJobsCount = this.jobsService.hiddenJobsCount;
    } catch (error) {
      console.error('Failed to load job posts.', error);
    }
  }
}
