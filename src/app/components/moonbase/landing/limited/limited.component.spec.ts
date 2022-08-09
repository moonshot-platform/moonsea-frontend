import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitedComponent } from './limited.component';

describe('LimitedComponent', () => {
  let component: LimitedComponent;
  let fixture: ComponentFixture<LimitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
