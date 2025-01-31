import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDialogComponent } from './query-dialog.component';

describe('QueryModalComponent', () => {
  let component: QueryDialogComponent;
  let fixture: ComponentFixture<QueryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QueryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
