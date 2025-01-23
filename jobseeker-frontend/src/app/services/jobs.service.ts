import { Injectable } from '@angular/core';
import { JobPost } from '../models/job.posts';
import { HttpClient } from '@angular/common/http';
import { JobResponse } from '../models/job.response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  jobResponse: JobResponse | null = null;

  constructor(
    private httpClient: HttpClient
  ) { }

  loadJobs(jobStatus: string | null = null): Promise<any> {
    return new Promise((resolve, reject) => {
      const statusParam = jobStatus && jobStatus.trim() ? jobStatus : 'all';
      const url = `${environment.apiUrl}jobs/${statusParam}`;

      this.httpClient.get<JobResponse | null>(url).subscribe(
        (response: JobResponse | null) => {
          this.jobResponse = response;
          resolve(true);
        },
        (error) => {
          console.error('Error loading jobs:', error);
          this.jobResponse = null;
          reject(false);
        }
      );
    });
  }

  updateJobStatus(id: number, status: string): Promise<any> {
    const url = `${environment.apiUrl}jobs/${id}/status`;
    return new Promise((resolve, reject) => {
      this.httpClient.post(url, { status }).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          console.error('Error updating job status:', error);
          reject(false);
        }
      );
    });
  }

  get jobs(): JobPost[] {
    return this.jobResponse?.jobs ?? [];
  }

  get allJobsCount(): number {
    return this.jobResponse?.allJobsCount ?? 0;
  }

  get newJobsCount(): number {
    return this.jobResponse?.newJobsCount ?? 0;
  }

  get viewedJobsCount(): number {
    return this.jobResponse?.viewedJobsCount ?? 0;
  }

  get starredJobsCount(): number {
    return this.jobResponse?.starredJobsCount ?? 0;
  }

  get hiddenJobsCount(): number {
    return this.jobResponse?.hiddenJobsCount ?? 0;
  }
}