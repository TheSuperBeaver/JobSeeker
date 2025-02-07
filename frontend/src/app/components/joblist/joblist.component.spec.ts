import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoblistComponent } from './joblist.component';

describe('JoblistComponent', () => {
  let component: JoblistComponent;
  let fixture: ComponentFixture<JoblistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoblistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoblistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
