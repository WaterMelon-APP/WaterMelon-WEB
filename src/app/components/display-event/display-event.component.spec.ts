import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEventComponent } from './display-event.component';

describe('DisplayEventComponent', () => {
  let component: DisplayEventComponent;
  let fixture: ComponentFixture<DisplayEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
