import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcollectionComponent } from './allcollection.component';

describe('AllcollectionComponent', () => {
  let component: AllcollectionComponent;
  let fixture: ComponentFixture<AllcollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllcollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllcollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
