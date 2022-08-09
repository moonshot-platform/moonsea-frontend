import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalForCreateNftComponent } from './modal-for-create-nft.component';

describe('ModalForCreateNftComponent', () => {
  let component: ModalForCreateNftComponent;
  let fixture: ComponentFixture<ModalForCreateNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalForCreateNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalForCreateNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
