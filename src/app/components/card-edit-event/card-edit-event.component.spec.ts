import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEditEventComponent } from './card-edit-event.component';

describe('CardEditEventComponent', () => {
  let component: CardEditEventComponent;
  let fixture: ComponentFixture<CardEditEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardEditEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardEditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
