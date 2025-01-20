import { Component } from '@angular/core';
import { JoblistComponent } from '../../components/joblist/joblist.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jobs',
  imports: [JoblistComponent, CommonModule],
  templateUrl: './jobs.page.html',
  styleUrl: './jobs.page.css'
})
export class JobsComponent {
  jobStatus: string | undefined = undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.jobStatus = params.get('status')?? undefined;
    });
  }
}
