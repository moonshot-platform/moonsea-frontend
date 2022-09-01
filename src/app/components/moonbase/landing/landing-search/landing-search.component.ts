import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-landing-search',
  templateUrl: './landing-search.component.html',
  styleUrls: ['./landing-search.component.scss']
})
export class LandingSearchComponent implements OnInit ,OnDestroy{
  flag:boolean =false;
  searchResult: any;
  @ViewChild('searchText') searchInput01 : ElementRef;
  unSubscribeSubscription:Subscription;

  constructor(private router:Router, private getDataService: GetDataService,private toaster:ToastrService) { }
  ngOnDestroy(): void {
    if(this.unSubscribeSubscription){
      this.unSubscribeSubscription.unsubscribe();
    }
    
  }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.flag = false;
    this.searchInput01.nativeElement.value = '';
  }
  searchClient(searchText: any) {
  
    this.router.navigate(['/searchcollection'], {
      queryParams: { searchKey: searchText },
    });
  }

  uniquedata :any=[];
  properties:any= [];
  autoComplete(searchText) {
    this.uniquedata =[];
    this.properties= [];
    if (searchText.length > 2) {
      this.unSubscribeSubscription = this.getDataService.searchResult(searchText).subscribe(async (response) => {
    
         
          if(response.data.length > 0){
            this.flag = true;

            this.searchResult = response.data;
          this.searchResult.forEach(element => {
              if(this.uniquedata.indexOf(element.serachType) === -1){
                this.uniquedata.push(element.serachType);
              }
          });

         await this.arraymove(this.uniquedata,2,1);
          

          this.uniquedata.forEach((element:any,index:any) => {
            this.properties[index] = [];
            this.searchResult.forEach((el:any) => {
                if(el.serachType == element){
                  this.properties[index].push(el)
                }
            });
          });
       
          
          }else{
            this.flag = false;
          }
        
      },(err:HttpErrorResponse)=>{
        if(err.status == 400){
          this.toaster.error(`${err.error.Message}`)
        }
        else if(err.status == 500){
          this.toaster.error(`Enternal Server Error.`)
        }else{
          this.toaster.error(`Something went wrong.`)
        }
      });
    }
    else{
      this.flag = false;
    }
  }
  arraymove(arr, fromIndex, toIndex) {
    let prmise = new Promise((resolve,rejects)=>{
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      resolve('a')

    })
 
    return prmise;
  
}

onselectClient(enterText: any, serachType: any, nftToken: any,nftAddress:any,blockchainId:any) {
  
  console.log(blockchainId);
  
  if (serachType == 1) {
    this.router.navigate(['/details',nftAddress, nftToken,blockchainId]);
  } else if (serachType == 2) {
    this.router.navigate(['/profile', enterText]);
  } else if (serachType == 4) {
    this.router.navigate(['/profile', enterText]);
  } else {
    this.router.navigate(['/collection', enterText]);
  }
}
}
