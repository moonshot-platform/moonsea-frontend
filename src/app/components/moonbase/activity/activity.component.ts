import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  data: any;
  Address: any;
  loader: boolean = true;
  listItemsFollowing: any;
  showfollowing: boolean = false;

  constructor(private getDataService:GetDataService,public cs:ContractService, private toastrService:ToastrService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.Address =  localStorage.getItem('address');

    this.NotificationListAll(this.Address);
    
  }


async following()
{
  this.showfollowing = true;
  this.getDataService.getItemsForFollowing(this.Address,this.Address).subscribe((response:any) => {
    this.listItemsFollowing=response.data;
    
  })
}

  async unfollow(address:string,index:number)
  {
    console.warn(address);
    var data={
      follower:this.Address,
      following : address,
      signature : ""
    };
    var status:any= await this.cs.signMsgForUnFollow(data);
    console.warn(data);
    if(status.status){
    
    this.getDataService.unFollowUser({
      follower:this.Address,
      following : address,
      signature : status.signature
    }).subscribe((response:any)=>
    {
      console.warn(response.isSuccess);
        if(response.isSuccess){
          this.listItemsFollowing.splice(index,1);
        this.toastrService.success(response.message)
        }
        else
        {

        }
    })
  }
  }

  async NotificationListAll(address:string)
  {
    this.showfollowing = false;
    
    this.getDataService.notificationListAll(
      address
    ).subscribe((response:any)=>
    {
        this.data = response.data;
        this.loader = false;
    })
  
  }

}
