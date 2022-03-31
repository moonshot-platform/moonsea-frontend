import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-socialbuttons',
  templateUrl: './socialbuttons.component.html',
  styleUrls: ['./socialbuttons.component.scss']
})
export class SocialbuttonsComponent implements OnInit {
@Input() data:any;

  constructor() { }

  ngOnInit(): void {
  }

}
