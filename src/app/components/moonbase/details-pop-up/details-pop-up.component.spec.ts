import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPopUpComponent } from './details-pop-up.component';

describe('DetailsPopUpComponent', () => {
  let component: DetailsPopUpComponent;
  let fixture: ComponentFixture<DetailsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
