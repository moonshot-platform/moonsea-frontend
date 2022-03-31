import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { ConnectWalletPopupComponent } from '../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  username: string="";
  userDetails: any;
  showEditCoverForm : boolean =false;
  imageUrl: string="";
  imagePath: any;
  file: any;
  listItemsOnSale=[];
  listItemsOwned : any;
  listItemsLikes : any;
  listItemsFollowing : any;
  tabName: any = "Created";
  isApiLoading : boolean = false;
  tabHeadings = ['On Sale','Owned','Created','Likes','Following','Followers'];
  tabHeadingsUrl = ['onSale','owned','created','likes','following','followers'];
  listItemsCreated: any;
  listItemsFollowers: any;
  connectedAddress = "";
  hideShow:any;
  isFollowByYou: any;
  loaded : boolean =  false;
  currentWalletAddress :any;
  constructor(public cs:ContractService, private toastrService:ToastrService, private _activatedRoute: ActivatedRoute,private getDataService:GetDataService,
    public dialog: MatDialog,
    public contractService:ContractService ,private location:Location) {

    _activatedRoute.params.subscribe(
      (params) =>{
      
      this.username = params['username'];
      this.tabName = params['tabName'];
      this.setApiLoadingFlag(true);
      if(this.loaded)
      {
        this.fetchData();
      }
      }
      );
   }

  ngOnInit(): void {
    this.currentWalletAddress =localStorage.getItem('address');
    
    window.scrollTo(0, 0);
    this.cs.getWalletObs().subscribe((data:any)=>
    {
      this.loaded = true;
      this.connectedAddress = data;

      this.fetchData();
    });
  }
  // let check2 =(localStorage.getItem("address"));

  // if(this.check === check2){
  //   this.hideShow= true
  // }else{
  //   this.hideShow= false

  // }

  setApiLoadingFlag(flag:boolean)
  {
    this.isApiLoading=flag;
  }

  fetchData()
  {

   this.getDataService.getUserDetails(this.username,this.connectedAddress).subscribe((response:any) => {
    if(response.data.length>0){
    this.userDetails=response.data[0];
    
          let check2 =(localStorage.getItem("address"));

          if(this.userDetails?.walletAddress==check2){
            this.hideShow= true
            }else{
              this.hideShow= false

            }
            this.isFollowByYou = response.data[0].isFollowByYou;
          this.imageUrl= response.data[0].coverPhoto ?? "";
          this.getListData();
    }
    });



  }

  getListData()
  {
    if(this.tabName==this.tabHeadingsUrl[0]){
      this.getDataService.getItemsForUser(this.userDetails?.walletAddress,3).subscribe((response:any) => {
        this.listItemsOnSale=response.data;
        this.setApiLoadingFlag(false);
      })
    }
    if(this.tabName==this.tabHeadingsUrl[1]){
      this.getDataService.getItemsForUser(this.userDetails?.walletAddress,2).subscribe((response:any) => {
        this.listItemsOwned=response.data;
        // console.log(this.listItemsOwned)
        this.setApiLoadingFlag(false);
      })
    }
    if(this.tabName==this.tabHeadingsUrl[2]){
      this.getDataService.getItemsForUser(this.userDetails?.walletAddress,1).subscribe((response:any) => {
        this.listItemsCreated=response.data;

        this.setApiLoadingFlag(false);
      })
    }
    if(this.tabName==this.tabHeadingsUrl[3]){
      this.getDataService.getItemsForUser(this.userDetails?.walletAddress,4).subscribe((response:any) => {
        this.listItemsLikes=response.data;

        this.setApiLoadingFlag(false);
      })
    }
    if(this.tabName==this.tabHeadingsUrl[4]){
      this.getDataService.getItemsForFollowing(this.userDetails?.walletAddress,this.cs.userAddress).subscribe((response:any) => {
        this.listItemsFollowing=response.data;
        this.setApiLoadingFlag(false);
      })
    }
    if(this.tabName==this.tabHeadingsUrl[5]){
      this.getDataService.getItemsForFollowers(this.userDetails?.walletAddress,this.cs.userAddress).subscribe((response:any) => {
        this.listItemsFollowers=response.data;
        this.setApiLoadingFlag(false);
      })
    }
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
        this.getDataService.uploadCoverPic(this.file,this.connectedAddress)
        .subscribe(
          (response:any) => {
            let data=response;
            if(data.isSuccess){
              this.imagePath=data.data.path;
              this.getDataService.updateCoverPhoto({
                walletAddress : this.connectedAddress,
                fileUrl : this.imagePath
              })
              .subscribe(
                (response:any) => {
                  this.hideEditForm();
                  if(response.isSuccess){
                  this.toastrService.success("Cover photo saved successfully.");
                  }
                  else
                  {
                    this.toastrService.error("Something went wrong");
                  }
                }
              );
            }
            else
            {
              this.imagePath="";
            }

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

  async followUser(address:string,index:number,listType:number)
  {
    debugger

    if(!this.contractService.checkValidAddress(this.connectedAddress))
    {
        this.connectWallet();
        return false;
    }

   var data={
      follower:this.connectedAddress,
      following : address,
      signature : ""
    };
    var status:any= await this.cs.signMsgForFollow(data);
    if(status.status){
    this.getDataService.followUser({
      follower:this.connectedAddress,
      following : address,
      signature : status.signature
    }).subscribe((response:any)=>
    {
          if(index>0 && listType==1)
          {
              this.listItemsFollowing[index-1].isFollowByYou = true;
          }
          else if(index>0 && listType==2)
          {
              this.listItemsFollowers[index-1].isFollowByYou = true;
          }
      this.userDetails.isFollowByYou = true;
      this.toastrService.success(response.message)
    })
  }
  return false;
  }

  async unfollow(address:string,index:number,listType:number)
  {

    if(!this.contractService.checkValidAddress(this.connectedAddress))
    {
        this.connectWallet();
        return false;
    }
    var data={
      follower:this.connectedAddress,
      following : address,
      signature : ""
    };
    var status:any= await this.cs.signMsgForUnFollow(data);
    if(status.status){

    this.getDataService.unFollowUser({
      follower:this.connectedAddress,
      following : address,
      signature : status.signature
    }).subscribe((response:any)=>
    {
        if(response.isSuccess){
          //this.listItemsFollowing.splice(index,1);
          if(index>0 && listType==1)
          {
              this.listItemsFollowing[index-1].isFollowByYou = false;
          }
          else if(index>0 && listType==2)
          {
              this.listItemsFollowers[index-1].isFollowByYou = false;
          }
          this.userDetails.isFollowByYou = false;
        this.toastrService.success(response.message)
        }
        else
        {

        }
    })
  }
  return false;
  }

  connectWallet()
{
  let dialogRef = this.dialog.open(ConnectWalletPopupComponent, {
    height: 'auto',
    width: 'auto',
  });
}

goBack(): void {
  this.location.back();
}

}
