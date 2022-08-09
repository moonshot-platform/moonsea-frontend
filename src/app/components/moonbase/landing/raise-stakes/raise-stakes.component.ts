import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-raise-stakes',
  templateUrl: './raise-stakes.component.html',
  styleUrls: ['./raise-stakes.component.scss']
})
export class RaiseStakesComponent implements OnInit {

  boxes: any[] = [
    {
      "img": "assets/media/images/moonbox/landing/wood.png",
      "name": "Wood",
      "quantity": "0,5B",
    },
    {
      "img": "assets/media/images/moonbox/landing/silver.png",
      "name": "Silver",
      "quantity": "1B",
    },
    {
      "img": "assets/media/images/moonbox/landing/gold.png",
      "name": "Gold",
      "quantity": "2B",
    },
    {
      "img": "assets/media/images/moonbox/landing/diamond.png",
      "name": "Diamond",
      "quantity": "10B",
    }
  ];
  boxIndex = 0;
  boxForMobile: any = this.boxes[this.boxIndex];


  constructor() { }

  ngOnInit(): void {
  }

  nextBox(): void {
    if (this.boxIndex < this.boxes.length) {
      this.boxIndex++;
    } else {
      this.boxIndex = 0;
    }
    this.boxForMobile = this.boxes[this.boxIndex];
  }
  prevBox(): void {
    if (this.boxIndex >= 0) {
      this.boxIndex--;
    } else {
      this.boxIndex = this.boxes.length - 1;
    }
    this.boxForMobile = this.boxes[this.boxIndex];
  }

  scrollToElement(page: string, fragment: string): void {
    const element = document.querySelector(`#${fragment}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
