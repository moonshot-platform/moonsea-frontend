import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddspecificdetailsComponent } from './addspecificdetails.component';

describe('AddspecificdetailsComponent', () => {
  let component: AddspecificdetailsComponent;
  let fixture: ComponentFixture<AddspecificdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddspecificdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddspecificdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
