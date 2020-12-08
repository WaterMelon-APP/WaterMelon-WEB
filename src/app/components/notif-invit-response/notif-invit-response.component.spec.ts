import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifInvitResponseComponent } from './notif-invit-response.component';

describe('NotifInvitResponseComponent', () => {
  let component: NotifInvitResponseComponent;
  let fixture: ComponentFixture<NotifInvitResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifInvitResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifInvitResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
