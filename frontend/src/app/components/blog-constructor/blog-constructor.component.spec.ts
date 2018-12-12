import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogConstructorComponent } from './blog-constructor.component';

describe('BlogConstructorComponent', () => {
  let component: BlogConstructorComponent;
  let fixture: ComponentFixture<BlogConstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogConstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
