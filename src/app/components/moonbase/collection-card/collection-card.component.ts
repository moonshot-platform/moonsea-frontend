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
   defaultImage = 'https://www.placecage.com/1000/1000';
   image = 'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?fm=jpg';
  constructor(private router :Router) { }

  ngOnInit(): void {
    this.correntRoute = this.router.url;
    // console.log("correntRoute==>",this.correntRoute);
    
  }


  gotoNftDetails(nftAddress:any,nftTokenID:any){
    this.router.navigate(['/createNFT/details', nftAddress, nftTokenID]);
  }
}
