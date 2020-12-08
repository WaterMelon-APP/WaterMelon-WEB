import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDiscoveryComponent } from './card-discovery.component';

describe('CardDiscoveryComponent', () => {
  let component: CardDiscoveryComponent;
  let fixture: ComponentFixture<CardDiscoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDiscoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
