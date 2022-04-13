import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent implements OnInit {
  
   @Input() item :any ;
   correntRoute:any;
   defaultImage = 'assets/media/videos/moonsea-animated-logo.webm';
   image = 'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?fm=jpg';

   loaded :boolean;
   loaded01 :boolean;



  constructor(private router :Router) { }

  ngOnInit(): void {
    this.correntRoute = this.router.url;
  }


  gotoNftDetails(nftAddress:any,nftTokenID:any){
    this.router.navigate(['/details', nftAddress, nftTokenID]);
  }
}
