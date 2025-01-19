import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'job-filter',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class JobFilterComponent {

  @Input() allJobsCount: number = 0;
  @Input() newJobsCount: number = 0;
  @Input() viewedJobsCount: number = 0;
  @Input() starredJobsCount: number = 0;
  @Input() hiddenJobsCount: number = 0;

}