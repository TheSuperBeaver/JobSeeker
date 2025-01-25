import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { JobQueries, JobQuery } from '../models/jobs.queries';
import { Injectable } from '@angular/core';

export interface AllJobStatus {
  name: string;
  checked: boolean;
  subtasks?: JobStatus[];
}

export interface JobStatus {
  name: string;
  checked: boolean;
  query_id: number;
  nb_jobs: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobQueriesService {
  public jobQueries: JobQueries | null = null;
  public allJobStatus!: AllJobStatus;

  constructor(
    private httpClient: HttpClient
  ) {
    this.loadJobQueries();
  }

  loadJobQueries(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${environment.apiUrl}queries/`;

      this.httpClient.get<{ queries: JobQuery[] }>(url).subscribe({
        next: (response) => {
          this.allJobStatus = { name: "All", checked: true, subtasks: [] };

          if (response?.queries?.length) {
            const flatQueries = response.queries.flat();

            this.allJobStatus.subtasks = flatQueries.map(query => ({
              name: query.search_term,
              checked: true,
              query_id: query.id,
              nb_jobs: query.nb_jobs
            }));
          }

          this.jobQueries = {
            queries: response.queries.flat(),
          };

          resolve();
        },
        error: (error) => {
          this.jobQueries = null;
          this.allJobStatus = { name: "All", checked: true, subtasks: [] };

          reject(error);
        },
      });
    });
  }

}