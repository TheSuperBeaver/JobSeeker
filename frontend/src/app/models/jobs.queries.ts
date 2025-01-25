export class JobQueries {
  queries: JobQuery[] = [];
}

export enum JobQueryStatus {
  Automatic = "automatic",
  Manual = "manual",
  Deactivated = "deactivated",
}

export interface JobQuery {
  id: number;
  search_term: string;
  town?: string;
  country: string;
  query_google: boolean;
  query_indeed: boolean;
  query_linkedin: boolean;
  offset_google: number;
  offset_indeed: number;
  offset_linkedin: number;
  results: number;
  hour_automatic_query: number;
  status: JobQueryStatus;
  filters: string;
  created_at: Date;
  updated_at: Date;
  nb_jobs: number;
}
