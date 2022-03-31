import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaversionModalComponent } from './betaversion-modal.component';

describe('BetaversionModalComponent', () => {
  let component: BetaversionModalComponent;
  let fixture: ComponentFixture<BetaversionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetaversionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaversionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
