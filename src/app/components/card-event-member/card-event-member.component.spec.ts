import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEventMemberComponent } from './card-event-member.component';

describe('CardEventMemberComponent', () => {
  let component: CardEventMemberComponent;
  let fixture: ComponentFixture<CardEventMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardEventMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardEventMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
