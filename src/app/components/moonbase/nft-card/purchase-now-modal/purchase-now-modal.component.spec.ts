import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseNowModalComponent } from './purchase-now-modal.component';

describe('PurchaseNowModalComponent', () => {
  let component: PurchaseNowModalComponent;
  let fixture: ComponentFixture<PurchaseNowModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseNowModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseNowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
