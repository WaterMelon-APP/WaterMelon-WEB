import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifInfoMenuComponent } from './notif-info-menu.component';

describe('NotifInfoMenuComponent', () => {
  let component: NotifInfoMenuComponent;
  let fixture: ComponentFixture<NotifInfoMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifInfoMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifInfoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
