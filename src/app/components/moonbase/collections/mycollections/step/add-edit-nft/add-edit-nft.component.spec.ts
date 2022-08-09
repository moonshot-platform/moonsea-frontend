import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNftComponent } from './add-edit-nft.component';

describe('AddEditNftComponent', () => {
  let component: AddEditNftComponent;
  let fixture: ComponentFixture<AddEditNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
