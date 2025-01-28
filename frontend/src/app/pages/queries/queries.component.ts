import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { QueriesTableComponent } from "../../components/queries-table/queries-table.component";

@Component({
  selector: 'app-queries',
  imports: [HeaderComponent, FooterComponent, QueriesTableComponent],
  templateUrl: './queries.component.html',
  styleUrl: './queries.component.css'
})
export class QueriesComponent {

}
