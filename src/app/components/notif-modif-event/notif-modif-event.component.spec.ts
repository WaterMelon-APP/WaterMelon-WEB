import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifModifEventComponent } from './notif-modif-event.component';

describe('NotifModifEventComponent', () => {
  let component: NotifModifEventComponent;
  let fixture: ComponentFixture<NotifModifEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifModifEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifModifEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
