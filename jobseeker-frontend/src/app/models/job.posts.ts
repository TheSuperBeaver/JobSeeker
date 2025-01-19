import { JobStatus } from "./job.status";
import { JobType } from "./job.type";

export class JobPost {
  id?: number;
  site_id?: string;
  site?: string;
  title?: string;
  company?: string;
  company_url?: string;
  job_url?: string;
  location_country?: string;
  location_city?: string;
  location_state?: string;
  description?: string;
  shortDescription?: string;
  fullDescription?: string;
  job_type?: JobType
  date_posted?: Date;
  emails?: string;
  is_remote: boolean = false;
  job_level?: string;
  company_industry?: string;
  company_country?: string;
  company_addresses?: string;
  company_employees_label?: string;
  company_revenue_label?: string;
  company_description?: string;
  company_logo?: string;
  status?: JobStatus;
  style?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(init?: Partial<JobPost>) {
    Object.assign(this, init);
  }
}