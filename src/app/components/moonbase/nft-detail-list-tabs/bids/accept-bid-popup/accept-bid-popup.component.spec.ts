import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptBidPopupComponent } from './accept-bid-popup.component';

describe('AcceptBidPopupComponent', () => {
  let component: AcceptBidPopupComponent;
  let fixture: ComponentFixture<AcceptBidPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptBidPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptBidPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
