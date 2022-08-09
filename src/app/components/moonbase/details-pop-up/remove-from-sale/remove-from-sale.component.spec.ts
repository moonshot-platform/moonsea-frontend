import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFromSaleComponent } from './remove-from-sale.component';

describe('RemoveFromSaleComponent', () => {
  let component: RemoveFromSaleComponent;
  let fixture: ComponentFixture<RemoveFromSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveFromSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveFromSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
