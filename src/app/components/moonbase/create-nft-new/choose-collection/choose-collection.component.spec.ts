import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCollectionComponent } from './choose-collection.component';

describe('ChooseCollectionComponent', () => {
  let component: ChooseCollectionComponent;
  let fixture: ComponentFixture<ChooseCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
