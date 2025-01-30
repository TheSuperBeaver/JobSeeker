import { Injectable } from '@angular/core';
import { JobPost } from '../models/job.posts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  loadJobs(jobStatus: string[] | null = null, queryId: number | null = null): Promise<any> {

    const accessToken = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');

    // Set up headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'X-User-Email': email || '' // Use a custom header for email
    });


    return new Promise((resolve, reject) => {
      let url = `${environment.apiUrl}jobs`;
      const params = new URLSearchParams();

      if (jobStatus && jobStatus.length > 0) {
        params.append("status", jobStatus.join(","));
      } else {
        params.append("status", "New,Viewed,Starred");
      }

      if (queryId !== null && queryId !== undefined) {
        params.append("queryId", queryId.toString());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      this.httpClient.get<JobResponse | null>(url, { headers }).subscribe({
        next: (response) => {
          this.jobResponse = response;
          resolve(true);
        },
        error: (error) => {
          console.error("Error loading jobs:", error);
          this.jobResponse = null;
          reject(false);
        }
      });
    });
  }


  updateJobStatus(id: number, status: string): Promise<any> {
    const url = `${environment.apiUrl}jobs/${id}/status`;

    const accessToken = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');

    // Set up headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'X-User-Email': email || '' // Use a custom header for email
    });

    return new Promise((resolve, reject) => {
      this.httpClient.post(url, { status }, { headers }).subscribe(
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