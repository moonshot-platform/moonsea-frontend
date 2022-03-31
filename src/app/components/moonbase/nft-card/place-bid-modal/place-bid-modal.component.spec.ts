import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceBidModalComponent } from './place-bid-modal.component';

describe('PlaceBidModalComponent', () => {
  let component: PlaceBidModalComponent;
  let fixture: ComponentFixture<PlaceBidModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceBidModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceBidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
