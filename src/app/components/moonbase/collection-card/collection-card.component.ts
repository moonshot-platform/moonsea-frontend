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
  constructor(private router :Router) { }

  ngOnInit(): void {
    this.correntRoute = this.router.url;
    // console.log("correntRoute==>",this.correntRoute);
    
  }


  gotoNftDetails(nftAddress:any,nftTokenID:any){
    this.router.navigate(['/details', nftAddress, nftTokenID]);
  }
}
