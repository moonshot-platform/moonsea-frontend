import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingStaticsComponent } from './landing-statics.component';

describe('LandingStaticsComponent', () => {
  let component: LandingStaticsComponent;
  let fixture: ComponentFixture<LandingStaticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingStaticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingStaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
