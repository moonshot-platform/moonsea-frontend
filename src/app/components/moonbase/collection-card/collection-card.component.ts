import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent implements OnInit {

  @Input() item: any;
  correntRoute: any;
  defaultImage = 'assets/media/videos/moonsea-animated-logo.webm';
  image = 'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?fm=jpg';

  loaded: boolean;
  loaded01: boolean;

  elementsHasLoaded: boolean[] = [];
  searchKey: any = 'all';

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) {
    for (let index = 0; index < 100; index++) {
      this.elementsHasLoaded[index] = false;
    }
  }

  ngOnInit(): void {
    this.correntRoute = this.router.url;
    this.activatedRoute.queryParams.subscribe((res: any) => {
    this.searchKey = res.searchKey;
    });

  }

  gotoNftDetails(nftAddress: any, nftTokenID: any) {
    this.router.navigate(['/detailsCom/details', nftAddress, nftTokenID]);
  }

  onMediaLoad(event, index) {
    if (event && event.target) {
      // console.log("IMAGE HAS LOADED!");
      this.elementsHasLoaded[index] = true;
    } else {
      this.elementsHasLoaded[index] = false;
      // console.log("IMAGE HAS NOT LOADED!");
    }

    if (event.readyState == 4) {
      this.elementsHasLoaded[index] = true;
    }
  }

}
