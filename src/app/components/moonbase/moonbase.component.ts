import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moonbase',
  templateUrl: './moonbase.component.html',
  styleUrls: ['./moonbase.component.scss']
})
export class MoonbaseComponent implements OnInit {
  subscription: Subscription;
  bgChange : boolean = false;
  static readonly routeName: string = '';

  constructor() {

  }

  ngOnInit(): void {
  }

}
