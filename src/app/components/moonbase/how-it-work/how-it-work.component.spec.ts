import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorkComponent } from './how-it-work.component';

describe('HowItWorkComponent', () => {
  let component: HowItWorkComponent;
  let fixture: ComponentFixture<HowItWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
