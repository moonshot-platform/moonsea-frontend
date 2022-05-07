import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingHotCollectionComponent } from './landing-hot-collection.component';

describe('LandingHotCollectionComponent', () => {
  let component: LandingHotCollectionComponent;
  let fixture: ComponentFixture<LandingHotCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingHotCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingHotCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
