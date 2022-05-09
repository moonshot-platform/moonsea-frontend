import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CreateNftService } from 'src/app/services/create-nft.service';

@Component({
  selector: 'app-mycollections',
  templateUrl: './mycollections.component.html',
  styleUrls: ['./mycollections.component.scss']
})
export class MycollectionsComponent implements OnInit ,OnDestroy{
  tabIndex :any =1; 
 
  
  constructor(private location: Location,private createNftService:CreateNftService) { }
  ngOnDestroy(): void {
  
  }

  ngOnInit(): void {
    this.createNftService.subject.subscribe(
      (res:any)=>{
       this.tabIndex = res.tabIndex; 
      }
    )
  }

  isSelected(index: number) {
    if (this.tabIndex == index) {
        return false;
    } else {
        return true;
    }
}


  
}