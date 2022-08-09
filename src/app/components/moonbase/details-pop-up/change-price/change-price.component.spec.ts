import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePriceComponent } from './change-price.component';

describe('ChangePriceComponent', () => {
  let component: ChangePriceComponent;
  let fixture: ComponentFixture<ChangePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
