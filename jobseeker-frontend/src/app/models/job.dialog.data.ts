import { JobPost } from "./job.posts";

export interface JobDialogData {
  job: JobPost;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}