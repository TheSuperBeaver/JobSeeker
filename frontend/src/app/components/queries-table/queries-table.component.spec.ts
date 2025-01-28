import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueriesTableComponent } from './queries-table.component';

describe('QueriesTableComponent', () => {
  let component: QueriesTableComponent;
  let fixture: ComponentFixture<QueriesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueriesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
