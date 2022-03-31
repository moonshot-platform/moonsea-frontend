import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseNowComponent } from './purchase-now.component';

describe('PurchaseNowComponent', () => {
  let component: PurchaseNowComponent;
  let fixture: ComponentFixture<PurchaseNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseNowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
