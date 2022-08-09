import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseStakesComponent } from './raise-stakes.component';

describe('RaiseStakesComponent', () => {
  let component: RaiseStakesComponent;
  let fixture: ComponentFixture<RaiseStakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseStakesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseStakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
