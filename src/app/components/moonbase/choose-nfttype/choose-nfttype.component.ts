import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-nfttype',
  templateUrl: './choose-nfttype.component.html',
  styleUrls: ['./choose-nfttype.component.scss']
})
export class ChooseNfttypeComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {

  }

  createSignleNFT()
  {
    this.route.navigate(['createNft/type','single']);
  }

  createMultipleNFT()
  {
    this.route.navigate(['createNft/type','multiple']);
  }

}
