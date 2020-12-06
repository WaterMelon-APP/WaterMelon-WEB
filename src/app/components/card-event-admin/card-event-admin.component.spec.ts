import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEventAdminComponent } from './card-event-admin.component';

describe('CardEventAdminComponent', () => {
  let component: CardEventAdminComponent;
  let fixture: ComponentFixture<CardEventAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardEventAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardEventAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
