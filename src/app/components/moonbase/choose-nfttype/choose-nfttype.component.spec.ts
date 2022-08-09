import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseNfttypeComponent } from './choose-nfttype.component';

describe('ChooseNfttypeComponent', () => {
  let component: ChooseNfttypeComponent;
  let fixture: ComponentFixture<ChooseNfttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseNfttypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseNfttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
