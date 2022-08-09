import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { HomeService } from 'src/app/services/home.service';
import { ConnectWalletPopupComponent } from '../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  username: string = "";
  userDetails: any;
  showEditCoverForm: boolean = false;
  imageUrl: string = "";
  imagePath: any;
  file: any;
  listItemsOnSale = [];
  listItemsOwned: any = [];
  listItemsLikes: any=[];
  listItemsFollowing: any = [];
  tabName: any = "Created";
  isApiLoading: boolean = false;
  tabHeadings = ['Created', 'On Sale', 'Collected', 'Following', 'Followers','Likes'];
  tabHeadingsUrl = ['Created', 'On Sale', 'Collected', 'following', 'followers','Likes'];
  listItemsCreated: any;
  listItemsFollowers: any =[];
  hideShow: any;
  isFollowByYou: any;
  loaded: boolean = false;
  currentWalletAddress: any;
  correntRoute: any;
  unSubscribeRequest: Subscription;
  myCollection: any = [];
  isLoaded:boolean[]=[];
  pageNo:any=1;
  PageSize:any = 100;


  constructor(public cs: ContractService, private toastrService: ToastrService, private _activatedRoute: ActivatedRoute, private getDataService: GetDataService,
    public dialog: MatDialog, private homeService: HomeService,
    public contractService: ContractService, private location: Location,private _titleService : Title) {

      for (let index = 0; index < 100; index++) {
        this.isLoaded[index] = false;
      }
  }

  ngOnInit(): void {
    this._titleService.setTitle('User Profile');
    this._activatedRoute.params.subscribe(
      (params) => {
        this.pageNo = 1;
        this.username = params['username'];
        this.tabName = params['tabName'];
    
        if(!params['tabName']){
          this.tabName = 'Created';
        }
        this.setApiLoadingFlag(true);
        if (this.loaded) {
          this.fetchData();
        }
      }
    );

    window.scrollTo(0, 0);

    this.correntRoute = window.location.href;

    this.cs.getWalletObs().subscribe((data: any) => {
      this.loaded = true;
      if(this.currentWalletAddress != data){
        this.currentWalletAddress = data;
          this.fetchData();
        }else{
          this.fetchData();
        }
   
    });
  }


  @HostListener('document:click', ['$event'])
  onMouseEnter(event: any) {
    if (!document.getElementById('dropdownButton').contains(event.target)) {
      var dropdowns = document.getElementsByClassName('dropdown-content');
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }



  setApiLoadingFlag(flag: boolean) {
    this.isApiLoading = flag;
  }

  fetchData() {
 
    
    this.getDataService.getUserDetails(this.username, this.currentWalletAddress).subscribe((response: any) => {
      if (response.data.length > 0) {
        this.userDetails = response.data[0];


        let check2 = (localStorage.getItem("address"));

        if (this.userDetails?.walletAddress == check2) {
          this.hideShow = true
        } else {
          this.hideShow = false

        }
        this.isFollowByYou = response.data[0].isFollowByYou;
        this.imageUrl = response.data[0].coverPhoto ?? "";

        this.getListData();
      }
    });



  }

  getListData() {

    if (this.tabName == this.tabHeadingsUrl[0]) {

      this.getmyCollectionList();
    }
    if (this.tabName == this.tabHeadingsUrl[1]) {
      this.getDataService.getItemsForUser(this.userDetails?.walletAddress, 3,this.pageNo,this.PageSize).subscribe((response: any) => {
        this.listItemsOnSale.push(...response.data);
        this.setApiLoadingFlag(false);
      },(err:any)=>{
        this.setApiLoadingFlag(false);
      })
    }
    if (this.tabName == this.tabHeadingsUrl[2]) {
      this.getDataService.getItemsForUser(this.userDetails?.walletAddress, 2,this.pageNo,this.PageSize).subscribe((response: any) => {
        this.listItemsOwned.push(...response.data);
        this.setApiLoadingFlag(false);
      },(err:any)=>{
        this.setApiLoadingFlag(false);
      })
    }

    if (this.tabName == this.tabHeadingsUrl[3]) {
      this.getDataService.getItemsForFollowing(this.userDetails?.walletAddress, this.cs.userAddress).subscribe((response: any) => {
        if(response.status == 200){
          this.listItemsFollowing.push(...response.data);
        }
        this.setApiLoadingFlag(false);
      },(err:any)=>{
        this.setApiLoadingFlag(false);
      })
    }
    if (this.tabName == this.tabHeadingsUrl[4]) {
      this.getDataService.getItemsForFollowers(this.userDetails?.walletAddress, this.cs.userAddress).subscribe((response: any) => {
        this.listItemsFollowers = response.data;
        this.setApiLoadingFlag(false);
      },(err:any)=>{
        this.setApiLoadingFlag(false);
      })
    }
    if (this.tabName == this.tabHeadingsUrl[5]) {
      this.getDataService.getItemsForUser(this.currentWalletAddress, 4,this.pageNo,this.PageSize).subscribe((response: any) => {
        this.listItemsLikes = response.data;
        this.setApiLoadingFlag(false);
      },(err:any)=>{
        this.setApiLoadingFlag(false);
      })
    }
  }

  getmyCollectionList() {
    this.myCollection = [];
    this.unSubscribeRequest = this.homeService.myCollectionList(this.userDetails?.walletAddress).subscribe((response: any) => {
      if (response.status == 200) {
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

        this.myCollection.push(...response.data);
        this.setApiLoadingFlag(false);

      } else {
        this.setApiLoadingFlag(false);
      }

    }, (err: any) => {
      this.setApiLoadingFlag(false);
    });
  }


  loadMore(){
    this.pageNo = this.pageNo + 1;
    this.getListData()
  }

  showEditForm() {
    this.showEditCoverForm = true;
  }

  hideEditForm() {
    this.showEditCoverForm = false;
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

  saveCoverPic(event: any) {
    if (this.file) {
      this.getDataService.uploadCoverPic(this.file, this.currentWalletAddress)
        .subscribe(
          (response: any) => {
            let data = response;
            if (data.isSuccess) {
              this.imagePath = data.data.path;
              this.getDataService.updateCoverPhoto({
                walletAddress: this.currentWalletAddress,
                fileUrl: this.imagePath
              })
                .subscribe(
                  (response: any) => {
                    this.hideEditForm();
                    if (response.isSuccess) {
                      this.toastrService.success("Cover photo saved successfully.");
                    }
                    else {
                      this.toastrService.error("Something went wrong");
                    }
                  }
                );
            }
            else {
              this.imagePath = "";
            }

          },
          (error: any) => {
            this.imagePath = "";
          });
    }
    else {
      this.toastrService.error("Image not selected")
    }
  }

  async followUser(address: string, index: number, listType: number) {


    if (!this.contractService.checkValidAddress(this.currentWalletAddress)) {
      this.connectWallet();
      return false;
    }

    var data = {
      follower: this.currentWalletAddress,
      following: address,
      signature: ""
    };
    var status: any = await this.cs.signMsgForFollow(data);
    if (status.status) {
      this.getDataService.followUser({
        follower: this.currentWalletAddress,
        following: address,
        signature: status.signature
      }).subscribe((response: any) => {
        if (index > 0 && listType == 1) {
          this.listItemsFollowing[index - 1].isFollowByYou = true;
        }
        else if (index > 0 && listType == 2) {
          this.listItemsFollowers[index - 1].isFollowByYou = true;
        }
        this.userDetails.isFollowByYou = true;
        this.toastrService.success(response.message)
      })
    }
    return false;
  }

  async unfollow(address: string, index: number, listType: number) {
    if (!this.contractService.checkValidAddress(this.currentWalletAddress)) {
      this.connectWallet();
      return false;
    }
    var data = {
      follower: this.currentWalletAddress,
      following: address,
      signature: ""
    };
    var status: any = await this.cs.signMsgForUnFollow(data);
    if (status.status) {

      this.getDataService.unFollowUser({
        follower: this.currentWalletAddress,
        following: address,
        signature: status.signature
      }).subscribe((response: any) => {
        if (response.isSuccess) {

          if (index > 0 && listType == 1) {
            this.listItemsFollowing[index - 1].isFollowByYou = false;
          }
          else if (index > 0 && listType == 2) {
            this.listItemsFollowers[index - 1].isFollowByYou = false;
          }
          this.userDetails.isFollowByYou = false;
          this.toastrService.success(response.message)
        }
        else {

        }
      })
    }
    return false;
  }

  connectWallet() {
    let dialogRef = this.dialog.open(ConnectWalletPopupComponent, {
      height: 'auto',
      width: 'auto',
    });
  }

  goBack(): void {
    this.location.back();
  }

  openSharedrop() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  copyMessage(val: string) {
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
    this.toastrService.success("Text copied.");
  }

  

  onMediaLoad(event, index) {
    if (event && event.target) {
      this.isLoaded[index] = true;
    } else {
      this.isLoaded[index] = false;
    }

    if (event.readyState == 4) {
      this.isLoaded[index] = true;
    }
  }
}
