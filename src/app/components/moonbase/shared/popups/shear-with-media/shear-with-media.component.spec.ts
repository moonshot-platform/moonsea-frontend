import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShearWithMediaComponent } from './shear-with-media.component';

describe('ShearWithMediaComponent', () => {
  let component: ShearWithMediaComponent;
  let fixture: ComponentFixture<ShearWithMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShearWithMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShearWithMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
