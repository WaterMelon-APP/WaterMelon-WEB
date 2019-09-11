import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEventUserPageComponent } from './list-event-user-page.component';

describe('ListEventUserPageComponent', () => {
  let component: ListEventUserPageComponent;
  let fixture: ComponentFixture<ListEventUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEventUserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEventUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
