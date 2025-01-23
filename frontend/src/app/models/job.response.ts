import { JobPost } from "./job.posts";

export class JobResponse {
  jobs: JobPost[] | [] = [];
  allJobsCount: number = 0;
  newJobsCount: number = 0;
  viewedJobsCount: number = 0;
  starredJobsCount: number = 0;
  hiddenJobsCount: number = 0;
}