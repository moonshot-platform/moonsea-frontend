import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { ConnectWalletPopupComponent } from '../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';


@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {
  @Input() listItemsFollowing :any =[];
  connectedAddress = "";
  listItemsFollowers: any;
  walletAddress :any;
  userDetails :any;
  hideShow:any;
  isFollowByYou: any;
  imageUrl :any ="";
  correntRoute :any;
  constructor(  public contractService:ContractService, public dialog: MatDialog, 
     public cs:ContractService,private getDataService:GetDataService, private toastrService:ToastrService,) { }

  ngOnInit(): void {
    
    this.correntRoute = window.location.href;
    this.cs.getWalletObs().subscribe((data:any)=>
    {
      this.connectedAddress = data;
    });
  }

  async followUser(address:string,index:number,listType:number)
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

  connectWallet()
  {
    let dialogRef = this.dialog.open(ConnectWalletPopupComponent, {
      height: 'auto',
      width: 'auto',
    });
  }


  fetchData()
  {

   this.getDataService.getUserDetails(this.walletAddress,this.connectedAddress).subscribe((response:any) => {
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
    }
    });



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
    this.toastrService.success("Address copied");
  }

} 
