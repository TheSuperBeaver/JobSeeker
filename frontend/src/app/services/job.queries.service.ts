import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { JobQueries, JobQuery } from '../models/jobs.queries';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScrapeResponse } from '../models/scrape.response';

export interface AllJobStatus {
  statuses: string[]; // List of job statuses (e.g., ["Open", "In Progress", "Closed"])
  subtasks: {
    name: string;       // Name of the subtask (e.g., "Task A")
    query_id: number;   // ID of the query associated with this subtask
    nb_jobs: number;    // Number of jobs associated with this subtask
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class JobQueriesService {
  public jobQueries: JobQueries | null = null;
  public allJobStatus!: AllJobStatus;
  public google_jobs_scraped: number = 0;
  public indeed_jobs_scraped: number = 0;
  public linkedin_jobs_scraped: number = 0;

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
          this.allJobStatus = { statuses: ["New", "Viewed", "Starred", "Hidden"], subtasks: [] };

          if (response?.queries?.length) {
            const flatQueries = response.queries.flat();

            this.allJobStatus.subtasks = flatQueries.map(query => ({
              name: query.search_term,
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
          this.allJobStatus = { statuses: ["New", "Viewed", "Starred", "Hidden"], subtasks: [] };

          reject(error);
        },
      });
    });
  }

  addQuery(query: JobQuery): Observable<JobQuery> {
    return this.httpClient.post<JobQuery>(`${environment.apiUrl}queries/`, query);
  }

  modifyQuery(id: number, query: JobQuery): Observable<JobQuery> {
    return this.httpClient.put<JobQuery>(`${environment.apiUrl}queries/${id}`, query);
  }

  deleteQuery(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/queries/${id}`);
  }

  runQuery(id: number): Observable<ScrapeResponse> {
    return this.httpClient.post<ScrapeResponse>(`${environment.apiUrl}/scrape/${id}`, id);
  }


}