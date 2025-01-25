import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTabGroup } from './query-tab-group.component';

describe('SideDrawerComponent', () => {
  let component: QueryTabGroup;
  let fixture: ComponentFixture<QueryTabGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryTabGroup]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QueryTabGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
