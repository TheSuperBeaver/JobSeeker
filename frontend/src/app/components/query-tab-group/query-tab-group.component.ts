import { Component } from '@angular/core';
import { JoblistComponent } from '../joblist/joblist.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { JobQueries } from '../../models/jobs.queries';
import { AllJobStatus, JobQueriesService } from '../../services/job.queries.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'query-tab-group',
  imports: [
    JoblistComponent,
    CommonModule,
    FooterComponent,
    MatTabsModule
  ],
  templateUrl: './query-tab-group.component.html',
  styleUrl: './query-tab-group.component.css'
})
export class QueryTabGroup {
  jobStatus: string | undefined = undefined;
  jobQueries: JobQueries | null = null;
  allJobStatus: AllJobStatus | null = null;

  constructor(private route: ActivatedRoute, private jobQueriesService: JobQueriesService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.jobStatus = params.get('status') ?? undefined;
    });
    this.loadJobs();
  }

  async loadJobs(): Promise<void> {
    try {
      await this.jobQueriesService.loadJobQueries();
      this.jobQueries = this.jobQueriesService.jobQueries;
      this.allJobStatus = this.jobQueriesService.allJobStatus;
    } catch (error) {
      console.error('Failed to load job posts.', error);
    }
  }

  update(status: boolean, query_id?: number) {
    throw new Error('Method not implemented.');
  }
}
