import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatedUsersComponent } from './rated-users.component';

describe('RatedUsersComponent', () => {
  let component: RatedUsersComponent;
  let fixture: ComponentFixture<RatedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
