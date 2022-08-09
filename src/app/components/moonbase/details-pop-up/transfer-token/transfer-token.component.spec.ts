import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTokenComponent } from './transfer-token.component';

describe('TransferTokenComponent', () => {
  let component: TransferTokenComponent;
  let fixture: ComponentFixture<TransferTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
