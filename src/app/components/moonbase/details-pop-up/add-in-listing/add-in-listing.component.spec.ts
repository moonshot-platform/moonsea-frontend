import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInListingComponent } from './add-in-listing.component';

describe('AddInListingComponent', () => {
  let component: AddInListingComponent;
  let fixture: ComponentFixture<AddInListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
