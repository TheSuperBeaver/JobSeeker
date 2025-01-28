import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryModalComponent } from './query-modal.component';

describe('QueryModalComponent', () => {
  let component: QueryModalComponent;
  let fixture: ComponentFixture<QueryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
