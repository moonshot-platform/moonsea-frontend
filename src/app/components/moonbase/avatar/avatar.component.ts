import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() imagePath:any;
  @Input() walletAddress:any;
  loggedInWalletAddress:any;
  constructor(public router:Router) { }

  ngOnInit(): void {
    
    this.loggedInWalletAddress = localStorage.getItem('address');

    if(this.imagePath==undefined || this.imagePath.length==0)
    {
      this.imagePath = "assets/media/images/moonsea/profile.png";
    }
    
  }


}
