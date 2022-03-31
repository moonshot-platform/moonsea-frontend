import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HomeService } from 'src/app/services/home.service';
import { ContractService } from 'src/app/services/contract.service';
import { CreateCollectionComponent } from '../../create-nft/create-collection/create-collection.component';
import { ImportCollectionComponent } from './import-collection/import-collection.component';

@Component({
  selector: 'app-mycollections',
  templateUrl: './mycollections.component.html',
  styleUrls: ['./mycollections.component.scss']
})
export class MycollectionsComponent implements OnInit {

  id: string="";
  connectedAddress: any;
  myCollection: any =[];
  isLoading: any = false;
  isShow: any = false;
  selectedCategory:any;
  constructor(private homeService: HomeService,
     private cs: ContractService, public dialog: MatDialog, private router: Router,private _activatedRoute: ActivatedRoute,
    private location: Location) {
    _activatedRoute.params.subscribe(
      (params:any) =>{this.id = params['id'];});

      this.homeService.getBrowseSelectedBycategoryCollectionList(this.id).subscribe((res)=>{
        this.selectedCategory =res.data
      })


   }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.cs.getWalletObs().subscribe((data: any) => {
      this.connectedAddress = data;
      this.getmyCollectionList();

    });
  }


  get formControls() { return this.importForm.controls; }

  importForm = new FormGroup(
    {
      contractaddress: new FormControl('', Validators.required)
    }
  )



  getmyCollectionList() {

    this.homeService.myCollectionList(this.connectedAddress).subscribe((response: any) => {
      if(response.status == 200){
        for (let i = 0; i < response.data.length; i++) {
          for (let j = 0; j < response.data[i].nftDetailsList.length; j++) {
            response.data[i].nftFileUrl01 =
              response.data[i].nftDetailsList[0].nftFileUrl;
            response.data[i].nftTokenID01 =
              response.data[i].nftDetailsList[0].nftTokenID;
            response.data[i].nftAddress =
              response.data[i].nftDetailsList[0].nftAddress;
          }
        }
  
        this.myCollection = response.data;
        // console.log("%%%%%=>",this.myCollection);
          
      }
     
    });


  }

  show() {
    this.isShow = true;
  }


  saveOtherCollectionsList(contractaddress: any) {
    console.warn(contractaddress.contractaddress);

    this.homeService.getOtherCollections(contractaddress.contractaddress).subscribe((response: any) => {
      this.myCollection = response.data;
    });

    this.isLoading = true;
    this.homeService.getCollectionId().subscribe((response: any) => {
      console.warn("9999999999999999999999999999999999999");
      console.warn(response.data.collectionName);

      this.router.navigate(['/collection', response.data.collectionName]);

      // login successful so redirect to return url
      //this.router.navigateByUrl('collection/'+response.data);
    });
    this.isLoading = false;

  }


  openDialogCreateCollection(): void {
    const dialogRef = this.dialog.open(CreateCollectionComponent, {
      width: 'auto',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    
    });
  }

  gotoNftDetails(nftAddress:any,tockenId:any){
    this.router.navigate(['/details', nftAddress, tockenId]);
  }

  goBack(): void {
    this.location.back();
  }

  importcollection() {
    const dialogRef = this.dialog.open(ImportCollectionComponent, {
      width: 'auto',
    });
  }

}
