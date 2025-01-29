import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobQueriesService } from '../../services/job.queries.service';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-query-modal',
  templateUrl: './query-modal.component.html',
  styleUrls: ['./query-modal.component.css'],
  imports: [MatFormField, MatLabel, MatError, FormsModule, MatCheckboxModule, MatOption, ReactiveFormsModule, CommonModule]
})
export class QueryModalComponent {
  queryForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private queryService: JobQueriesService,
    public dialogRef: MatDialogRef<QueryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data.query;
    this.queryForm = this.fb.group({
      search_term: [data.query?.search_term || '', Validators.required],
      town: [data.query?.town || ''],
      country: [data.query?.country || 'BE'],
      query_google: [data.query?.query_google || false],
      query_indeed: [data.query?.query_indeed || false],
      query_linkedin: [data.query?.query_linkedin || false],
      results: [data.query?.results || 25],
      hour_automatic_query: [data.query?.hour_automatic_query || 0],
      status: [data.query?.status || 'ACTIVE'],
    });
  }

  onSubmit() {
    const queryData = this.queryForm.value;
    this.dialogRef.close(queryData);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
