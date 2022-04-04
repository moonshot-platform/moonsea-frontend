import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { Location } from '@angular/common'
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { SocialSharePopUpComponent } from '../../common/social-share-pop-up/social-share-pop-up.component';


@Component({
  selector: 'app-collectiondetails',
  templateUrl: './collectiondetails.component.html',
  styleUrls: ['./collectiondetails.component.scss']
})
export class CollectiondetailsComponent implements OnInit {
  name: string="";
  collectionDetails: any;
  showEditCoverForm : boolean =false;
  imageUrl: string="";
  imagePath: any;
  check :any;
  file: any;
  hideShow:any;
  listItemsOnSale=[];
  listItemsOwned : any;
  listItemsLikes : any;
  listItemsFollowing : any;
  tabName: any;
  isApiLoading : boolean = false;
  tabHeadings = ['On Sale','Owned','Created','Likes','Following','Followers'];
  tabHeadingsUrl = ['onSale','owned','created','likes','following','followers'];
  listItemsCreated: any;
  listItemsFollowers: any;
  connectedAddress = "";
  correntRoute :any;

  constructor(public cs:ContractService, private toastrService:ToastrService,
     private collectionApi:CollectionApiService,private _activatedRoute: ActivatedRoute,
     private location: Location,private ngxService: NgxUiLoaderService,
     public dialog: MatDialog,
     private router:Router) {
    _activatedRoute.params.subscribe(
      (params) =>{ 
      this.name = params['name'];
      // this.setApiLoadingFlag(true); 
      }
      );

      
   }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.correntRoute = window.location.href;
 
    


    this.cs.getWalletObs().subscribe((data:any)=>
    {
      this.connectedAddress = data;
    });
    this.getCollectionDetails();

    window.onclick = function (event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName('dropdown-content');
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    };

  }

  getCollectionDetails()
  {
    
    this.collectionApi.getCollectionDetails(this.name).subscribe((response:any)=>{
      this.check = response.data.walletAddress
      let check2 =(localStorage.getItem("address"));
      
      if(this.check === check2){
        this.hideShow= true
      }else{
        this.hideShow= false

      }
      
      if(response.isSuccess){
         this.collectionDetails = response.data;
        this.imageUrl= this.collectionDetails.collectionCoverPhoto ?? "";
        
      }
    });
  }

  
  showEditForm()
  {
    this.showEditCoverForm=true;
  }

  hideEditForm()
  {
    this.showEditCoverForm=false;
  }

  onLogoFile(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = event => {
        this.imageUrl = reader.result?.toString() ?? "";
      };
    }
  }

  saveCoverPic(event:any)
  {
      if(this.file)
      {
        this.collectionApi.uploadCoverPic(this.file,this.connectedAddress)
        .subscribe(
          (response:any) => {
            let data=response;
            
              this.imagePath=data.data.path;
              
              this.collectionApi.updateCoverPhoto({
                collectionId : this.collectionDetails?.collectionId,
                fileUrl : this.imagePath
              })
              .subscribe( 
                (response:any) => {
                  if(response.isSuccess){
                  this.toastrService.success("Cover photo saved successfully.");
                }
              else
              {
                this.imagePath="";
              }
            });
            
            
           },
          (error:any) => {
            this.imagePath="";
          });
      }
      else
      {
          this.toastrService.error("Image not selected")
      }
  }

  goBack(): void {
    this.location.back();
  }

  shareSocialLink()
  {
    const dialogRef = this.dialog.open(SocialSharePopUpComponent, {
      width: 'auto',
      data: this.router.url
    });
  }


  refresh(){
    // let url ="api/refreshData?nftAddress=&nftTokenId="
    // // this.collectionApi
  }

  openSharedrop() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastrService.success("Text copied....");
  }

}
