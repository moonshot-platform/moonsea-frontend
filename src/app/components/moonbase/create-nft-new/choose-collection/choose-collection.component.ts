import { STEP_STATE } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-choose-collection',
  templateUrl: './choose-collection.component.html',
  styleUrls: ['./choose-collection.component.scss']
})
export class ChooseCollectionComponent implements OnInit ,AfterViewInit {
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => STEP_STATE.NUMBER;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
