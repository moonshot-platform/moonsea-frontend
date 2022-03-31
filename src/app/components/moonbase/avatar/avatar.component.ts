import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() imagePath:any;
  @Input() walletAddress:any;
  loggedInWalletAddress:any;
  constructor() { }

  ngOnInit(): void {
    this.loggedInWalletAddress = localStorage.getItem('address');

    if(this.imagePath==undefined || this.imagePath.length==0)
    {
      this.imagePath = "assets/media/images/moonsea/avatar-big.jpg";
    }
  }


}
