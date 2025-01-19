import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: JobFilterComponent;
  let fixture: ComponentFixture<JobFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobFilterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JobFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
