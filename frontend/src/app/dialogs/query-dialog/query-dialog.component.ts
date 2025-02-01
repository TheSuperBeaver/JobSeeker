import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatTimepickerModule } from '@angular/material/timepicker';
import { JobQueriesService } from '../../services/job.queries.service';

@Component({
  selector: 'app-query-dialog',
  templateUrl: './query-dialog.component.html',
  styleUrls: ['./query-dialog.component.css'],
  imports: [MatFormField, MatLabel, MatError, FormsModule, MatCheckboxModule, MatOption, ReactiveFormsModule, CommonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTimepickerModule]
})
export class QueryDialogComponent {
  queryForm: FormGroup;
  isEdit: boolean;
  formControl: FormControl<Date | null>;

  constructor(
    private fb: FormBuilder,
    private jobQueriesService: JobQueriesService,
    public dialogRef: MatDialogRef<QueryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const initialValue = new Date();
    initialValue.setHours(7, 0, 0);
    this.formControl = new FormControl(initialValue);
    this.isEdit = !!data.query;
    this.queryForm = this.fb.group({
      search_term: [data.query?.search_term || '', Validators.required],
      town: [data.query?.town || ''],
      country: [data.query?.country || 'BE'],
      query_google: [data.query?.query_google || false],
      query_indeed: [data.query?.query_indeed || false],
      query_linkedin: [data.query?.query_linkedin || false],
      results: [data.query?.results || 25],
      hour_automatic_query: [data.query?.hour_automatic_query || 7],
      filters: [data.query?.filters || ''],
      status: [data.query?.status || 'automatic'],
    });
  }

  onSubmit() {
    const queryData = this.queryForm.value;
    const formData = { ...this.queryForm.value };

    // Ensure hour_automatic_query is stored as a number (not Date)
    if (formData.hour_automatic_query instanceof Date) {
      formData.hour_automatic_query = formData.hour_automatic_query.getHours();
    }

    if (this.isEdit) {
      this.jobQueriesService.modifyQuery(this.data.query.id, formData).subscribe({
        next: (updatedQuery) => this.dialogRef.close(updatedQuery), // Return updated query
        error: (err) => console.error('Error modifying query:', err),
      });
    } else {
      this.jobQueriesService.addQuery(formData).subscribe({
        next: (newQuery) => this.dialogRef.close(newQuery), // Return new query
        error: (err) => console.error('Error adding query:', err),
      });
    }
  }

  onTimeSelected(event: any) {
    if (event instanceof Date) {
      const selectedHour = event.getHours();
      this.queryForm.patchValue({ hour_automatic_query: selectedHour });
    } else {
      console.error('Unexpected event format:', event);
    }
  }


  onCancel() {
    this.dialogRef.close();
  }
}
