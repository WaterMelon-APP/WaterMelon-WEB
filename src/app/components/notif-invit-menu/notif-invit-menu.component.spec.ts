import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifInvitMenuComponent } from './notif-invit-menu.component';

describe('NotifInvitMenuComponent', () => {
  let component: NotifInvitMenuComponent;
  let fixture: ComponentFixture<NotifInvitMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifInvitMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifInvitMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
