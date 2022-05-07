import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingOneComponent } from './landing-one.component';

describe('LandingOneComponent', () => {
  let component: LandingOneComponent;
  let fixture: ComponentFixture<LandingOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
