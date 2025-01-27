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
  constructor(private route: ActivatedRoute) { }
}
