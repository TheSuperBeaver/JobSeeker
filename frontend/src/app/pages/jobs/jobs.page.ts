import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { QueryTabGroup } from "../../components/query-tab-group/query-tab-group.component";

@Component({
  selector: 'jobs',
  imports: [
    HeaderComponent,
    CommonModule,
    QueryTabGroup
  ],
  templateUrl: './jobs.page.html',
  styleUrl: './jobs.page.css'
})
export class JobsComponent {
  jobStatus: string | undefined = undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.jobStatus = params.get('status') ?? undefined;
    });
  }
}
